from typing import Optional
from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    completed: bool

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class TodoResponse(TodoBase):
    id: int

    model_config = {
        "from_attributes": True
    }
