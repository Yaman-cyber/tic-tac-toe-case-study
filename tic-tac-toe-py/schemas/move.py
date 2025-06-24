from pydantic import BaseModel

class Model(BaseModel):
    row: int
    col: int