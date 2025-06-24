import os
import numpy as np
from schemas import boardState, gameResponse, move
from services.game import nextAction
from services.engine import engine
from enums.players import Players, Winners

from fastapi import APIRouter, HTTPException


router = APIRouter()

@router.post("/ai-move", response_model=gameResponse.Model)
async def get_ai_move(state:boardState.Model):
    try:
        if len(state.board) != 3 or any(len(row) != 3 for row in state.board):
            raise HTTPException(status_code=400, detail="Invalid board size")
        if state.current_player not in [Players.X.value, Players.O.value]:
            raise HTTPException(status_code=400, detail="Invalid player symbol")
        
        board = np.array(state.board)
        
        env =engine.Environment()
        env.set_state(board)
        
        if env.game_over():
            winner = Winners.X.value if env.winner == env.x else Winners.O.value if env.winner == env.o else None
            return gameResponse.Model(
                board=board.tolist(),
                next_move=None,
                game_over=True,
                winner=winner,
                message="Game is already over"
            )
        
        # Get AI move
        sv_path = os.path.dirname(os.path.abspath(__file__))
        next_move = nextAction.get_next_action(env, state.current_player, sv_path)
        
        # Make the move
        env.board[next_move[0], next_move[1]] = env.x if state.current_player == Players.X.value else env.o
        
        game_over = env.game_over()
        winner = Winners.X.value if env.winner == env.x else Winners.O.value if env.winner == env.o else None
        
        return gameResponse.Model(
            board=env.board.tolist(),
            next_move=next_move,
            game_over=game_over,
            winner=winner,
            message="Move successful" if not game_over else "Game over"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/player-move", response_model=gameResponse.Model)
async def validate_move(state: boardState.Model, move:move.Model):
    try:
        if len(state.board) != 3 or any(len(row) != 3 for row in state.board):
            raise HTTPException(status_code=400, detail="Invalid board size")
        if state.current_player not in [Players.X.value, Players.O.value]:
            raise HTTPException(status_code=400, detail="Invalid player symbol")
        if not (0 <= move.row <= 2 and 0 <= move.col <= 2):
            raise HTTPException(status_code=400, detail="Invalid move coordinates")
        
        board = np.array(state.board)
        
        env = engine.Environment()
        env.set_state(board)
        
        # Check if move is valid
        if not env.is_empty(move.row, move.col):
            raise HTTPException(status_code=400, detail="Cell is already occupied")
        
        env.board[move.row, move.col] = env.x if state.current_player == Players.X.value else env.o
        
        game_over = env.game_over()
        winner = Winners.X.value if env.winner == env.x else Winners.O.value if env.winner == env.o else None
        
        return gameResponse.Model(
            board=env.board.tolist(),
            next_move=None,
            game_over=game_over,
            winner=winner,
            message="Move is valid" if not game_over else "Game over"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
