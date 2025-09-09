from sqlalchemy.orm import Session
from . import models, schemas
from passlib.context import CryptContext
import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- User CRUD ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Event CRUD ---
def get_event(db: Session, event_id: int):
    return db.query(models.QMSEvent).filter(models.QMSEvent.id == event_id).first()

def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.QMSEvent).order_by(models.QMSEvent.id.desc()).offset(skip).limit(limit).all()

def create_event(db: Session, event: schemas.QMSEventCreate):
    event_type_prefix = {
        "Deviation": "DEV", "CAPA": "CAPA", "Audit": "AUD", "Change Control": "CC"
    }.get(event.event_type, "EVT")
    year = datetime.datetime.now().year
    last_event = db.query(models.QMSEvent).filter(models.QMSEvent.event_id_str.like(f"{event_type_prefix}-{year}-%")).order_by(models.QMSEvent.id.desc()).first()
    new_id_num = 1
    if last_event:
        new_id_num = int(last_event.event_id_str.split('-')[-1]) + 1
    event_id_str = f"{event_type_prefix}-{year}-{str(new_id_num).zfill(3)}"
    db_event = models.QMSEvent(**event.dict(), event_id_str=event_id_str)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event(db: Session, event_id: int, event_update: schemas.QMSEventCreate):
    db_event = db.query(models.QMSEvent).filter(models.QMSEvent.id == event_id).first()
    if db_event:
        update_data = event_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_event, key, value)
        db.commit()
        db.refresh(db_event)
    return db_event

def delete_events_by_ids(db: Session, event_ids: list[int]):
    num_deleted = db.query(models.QMSEvent).filter(models.QMSEvent.id.in_(event_ids)).delete(synchronize_session=False)
    db.commit()
    return num_deleted