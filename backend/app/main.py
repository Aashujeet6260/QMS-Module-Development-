from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from . import crud, models, schemas, auth
from .database import SessionLocal, engine, init_db
from .services import ai_service

init_db()
app = FastAPI()

# --- CORS MIDDLEWARE ---
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE DEPENDENCY ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- AUTHENTICATION ENDPOINTS ---
@app.post("/api/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=400, 
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/users/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/api/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user

# --- QMS Event Endpoints ---
@app.post("/api/events/", response_model=schemas.QMSEvent)
def create_qms_event(event: schemas.QMSEventCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return crud.create_event(db=db, event=event)

@app.get("/api/events/", response_model=List[schemas.QMSEvent])
def read_qms_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return crud.get_events(db, skip=skip, limit=limit)

@app.get("/api/events/{event_id}", response_model=schemas.QMSEvent)
def read_qms_event(event_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@app.put("/api/events/{event_id}", response_model=schemas.QMSEvent)
def update_qms_event(event_id: int, event: schemas.QMSEventCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    updated_event = crud.update_event(db=db, event_id=event_id, event_update=event)
    if updated_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return updated_event

@app.delete("/api/events/")
def delete_qms_events(request: schemas.EventsDeleteRequest, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    deleted_count = crud.delete_events_by_ids(db=db, event_ids=request.ids)
    if deleted_count == 0:
        raise HTTPException(status_code=404, detail="No events found to delete")
    return {"detail": f"Successfully deleted {deleted_count} events."}

@app.post("/api/ai/prompt")
# THE FIX IS HERE: Corrected schemas.AIPromt to schemas.AIPrompt
def get_ai_insight(prompt_data: schemas.AIPrompt, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    all_events = crud.get_events(db, limit=1000)
    ai_response = ai_service.get_ai_response(prompt_data.prompt, all_events)
    return {"response": ai_response}

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    if not db.query(models.QMSEvent).first():
        print("Database is empty. Seeding with initial data...")
        seed_data = [
            schemas.QMSEventCreate(
                title="Line 3 temperature out of range", event_type="Deviation",
                description="During routine monitoring of Manufacturing Line 3, the temperature of Reactor R-101 was observed to be at 85°C, exceeding the upper limit of 80°C.",
                occurrence_date="2025-06-22T10:45:00", reported_by="Charlie Brown", location="Manufacturing - Line 3",
                severity="High", risk="Medium", status="Investigation",
                root_cause_summary="Preventative maintenance schedule for temperature sensor was not followed due to a clerical error.",
                capa_summary="Update CMMS workflow to require dual verification for PM deferrals."
            ),
            schemas.QMSEventCreate(
                title="Annual GMP Compliance for Mfg Line B", event_type="Audit",
                description="Annual internal audit to ensure GMP compliance for Manufacturing Line B operations.",
                occurrence_date="2025-05-14T09:00:00", reported_by="QA Department", location="Manufacturing - Line B",
                severity="Medium", risk="Medium", status="Closed",
                root_cause_summary="Minor gaps in training documentation for new operators.",
                capa_summary="Refresher training conducted and documentation updated."
            ),
            schemas.QMSEventCreate(
                title="CAPA for Audit Finding AUD-2025-001", event_type="CAPA",
                description="Implement a new digital training module for all Manufacturing Line B operators to address documentation gaps identified in the annual GMP audit.",
                occurrence_date="2025-07-01T09:00:00", reported_by="QA Manager", location="Training Department",
                severity="Low", risk="Low", status="Open",
                root_cause_summary="Training records were incomplete.",
                capa_summary="New training module to be implemented."
            ),
            schemas.QMSEventCreate(
                title="Change Control: Upgrade Firmware on HPLC-04", event_type="Change Control",
                description="Proposed upgrade of the firmware for the QC Lab's HPLC-04 to version 3.2b. This change requires re-validation of 5 analytical methods.",
                occurrence_date="2025-10-15T14:00:00", reported_by="Lab Supervisor", location="QC Laboratory",
                severity="Medium", risk="Low", status="Open",
                root_cause_summary="N/A",
                capa_summary="N/A"
            )
        ]
        for event_data in seed_data:
            crud.create_event(db, event_data)
    db.close()