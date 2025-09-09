from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLAlchemyEnum
from .database import Base
import datetime
import enum

class UserRole(str, enum.Enum):
    OPERATOR = "Operator"
    INVESTIGATOR = "Investigator"
    QA_APPROVER = "QA Approver"

class QMSEvent(Base):
    __tablename__ = "qms_events"
    id = Column(Integer, primary_key=True, index=True)
    event_id_str = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    event_type = Column(String)
    description = Column(String)
    occurrence_date = Column(DateTime)
    reported_by = Column(String)
    location = Column(String)
    severity = Column(String)
    risk = Column(String)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    root_cause_summary = Column(String, nullable=True)
    capa_summary = Column(String, nullable=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLAlchemyEnum(UserRole), nullable=False)