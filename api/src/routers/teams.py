from fastapi import APIRouter, Depends, HTTPException

from pydantic import BaseModel, Field
from starlette import status

from src.dependencies import (
    team_service_factory,
    verify_token,
    employee_service_factory,
)
from src.models.employee import EmployeeService
from src.models.team import TeamService


class TeamBaseSchema(BaseModel):
    name: str


class TeamResponseSchema(TeamBaseSchema):
    id: str
    parent_team_id: str | None = Field(default=None)


class TeamCreateSchema(TeamBaseSchema):
    parent_team_id: str | None = Field(default=None)


router = APIRouter(prefix="/teams", tags=["Teams"])


@router.get(
    "",
    dependencies=[Depends(verify_token)],
    operation_id="list_teams",
    response_model=list[TeamResponseSchema],
)
async def list_teams(
    team_service: TeamService = Depends(team_service_factory),
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    teams = team_service.read_all()
    return [
        dict(team._mapping) | {"employees": employee_service.read_all_by_team_id(team.id)}
        for team in teams
    ]


@router.post(
    "",
    dependencies=[Depends(verify_token)],
    operation_id="create_team",
    response_model=TeamResponseSchema,
)
async def create_team(
    data: TeamCreateSchema, team_service: TeamService = Depends(team_service_factory)
):
    return team_service.create(**data.model_dump())


@router.get(
    "/{team_id}",
    dependencies=[Depends(verify_token)],
    operation_id="get_team",
    response_model=TeamResponseSchema,
)
async def get_team(
    team_id: str,
    team_service: TeamService = Depends(team_service_factory),
):
    team = team_service.read(team_id)
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team not found"
        )
    return team


@router.put(
    "/{team_id}", 
    dependencies=[Depends(verify_token)], 
    operation_id="update_team",
    response_model=TeamResponseSchema
)
async def update_team(
    team_id: str,
    data: TeamCreateSchema, 
    team_service: TeamService = Depends(team_service_factory),
):
    updated_team = team_service.update(team_id, **data.model_dump())
    if not updated_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team not found"
        )
    return updated_team


@router.delete(
    "/{team_id}", dependencies=[Depends(verify_token)], operation_id="delete_team",
    status_code=status.HTTP_200_OK
)
async def delete_team(
    team_id: str,
    team_service: TeamService = Depends(team_service_factory),
):
    deleted = team_service.delete(team_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Team not found"
        )
    return {"status": "ok"}
