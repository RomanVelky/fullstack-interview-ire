from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from starlette import status

from src.database import SessionLocal
from src.models.employee import EmployeeService
from src.models.team import TeamService

STATIC_TOKEN = "mysecrettoken123"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


def employee_service_factory(session: db_dependency):
    return EmployeeService(session)


def team_service_factory(session: db_dependency):
    return TeamService(session)


security = HTTPBearer()


def verify_token(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
):
    if credentials.credentials != STATIC_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,  detail="Invalid authentication credentials",
        )
    return True
