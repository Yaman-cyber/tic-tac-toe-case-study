from pydantic import BaseModel
from typing import List

class Model(BaseModel):
    board: List[List[int]]
    current_player: str