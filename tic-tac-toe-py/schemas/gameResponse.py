from pydantic import BaseModel
from typing import List, Tuple, Optional

class Model(BaseModel):
    board: List[List[int]]
    next_move: Optional[Tuple[int, int]]
    game_over: bool
    winner: Optional[str]
    message: str
