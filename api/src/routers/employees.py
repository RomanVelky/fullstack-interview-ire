from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from src.dependencies import employee_service_factory, verify_token
from src.models.employee import EmployeeService


class EmployeeBaseSchema(BaseModel):
    name: str
    surname: str
    position: str


class EmployeeResponseSchema(EmployeeBaseSchema):
    id: str
    created_at: datetime
    start_date: datetime | None
    end_date: datetime | None
    team_id: str

    class Config:
        from_attributes = True


class EmployeeCreateSchema(EmployeeBaseSchema):
    team_id: str
    start_date: datetime | None = None
    end_date: datetime | None = None


router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get(
    "",
    dependencies=[Depends(verify_token)],
    operation_id="list_employees",
    response_model=list[EmployeeResponseSchema],
)
async def list_employees(
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    return employee_service.read_all()


@router.post(
    "",
    dependencies=[Depends(verify_token)],
    operation_id="create_employee",
    response_model=EmployeeResponseSchema,
)
async def create_employee(
    data: EmployeeCreateSchema,
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    return employee_service.create(**data.model_dump())


@router.get(
    "/{employee_id}",
    dependencies=[Depends(verify_token)],
    operation_id="get_employee",
    response_model=EmployeeResponseSchema,
)
async def get_employee(employee_id, employee_service=Depends(employee_service_factory)):
    employee = employee_service.read(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        )
    return employee


@router.put(
    "/{employee_id}",
    dependencies=[Depends(verify_token)],
    operation_id="update_employee",
    response_model=EmployeeResponseSchema,
)
async def update_employee(
    employee_id: str,
    data: EmployeeCreateSchema,
    employee_service: EmployeeService = Depends(employee_service_factory),
):
    employee = employee_service.read(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        )
    return employee_service.update(employee_id, **data.model_dump())


@router.delete(
    "/{employee_id}",
    dependencies=[Depends(verify_token)],
    operation_id="delete_employee",
)
async def delete_employee(
    employee_id: str, 
    employee_service: EmployeeService = Depends(employee_service_factory)
):
    employee = employee_service.read(employee_id)
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found"
        )
    return employee_service.delete(employee_id)
