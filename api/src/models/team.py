import uuid

from sqlalchemy import Column, String, ForeignKey, text
from sqlalchemy.orm import Session, relationship

from src.database import Base


class Team(Base):
    __tablename__ = "team"

    id = Column(String, primary_key=True, default=lambda:str(uuid.uuid4()))
    name = Column(String, nullable=False)
    parent_team_id = Column(String, ForeignKey("team.id"), nullable=True)
    parent_team = relationship("Team", foreign_keys=[parent_team_id])


class TeamService:
    def __init__(self, session: Session):
        self.model = Team
        self.session = session

    def create(self, **values):
        team = self.model(**values)
        self.session.add(team)
        self.session.commit()
        self.session.refresh(team)
        return team

    def read(self, team_id):
        query = f"SELECT * FROM {self.model.__tablename__} WHERE id = '{team_id}';"
        return self.session.execute(text(query)).fetchone()

    def read_all(self):
        query = f"SELECT * FROM {self.model.__tablename__}"
        return self.session.execute(text(query)).fetchall()

    def update(self, team_id, **values):
        team = self.session.query(self.model).filter(self.model.id == team_id).first()
        if not team:
            return None
        
        for key, value in values.items():
            setattr(team, key, value)
        
        self.session.commit()
        self.session.refresh(team)
        return team

    def delete(self, team_id):
        team = self.session.query(self.model).filter(self.model.id == team_id).first()
        if team:
            self.session.delete(team)
            self.session.commit()
            return True
        return False
