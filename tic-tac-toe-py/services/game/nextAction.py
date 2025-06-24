import numpy as np
import os
from typing import Tuple
from services.engine import engine


def get_next_action(env:engine.Environment, symbol: str, sv_path: str) -> Tuple[int, int]:
    engine_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    vx_val = np.load(os.path.join(engine_dir, 'engine', 'vx.npy'))
    vo_val = np.load(os.path.join(engine_dir, 'engine', 'vo.npy'))
    x_agent = engine.AgentEval(env.x, vx_val)
    o_agent = engine.AgentEval(env.o, vo_val)
    if symbol == 'x':
        return x_agent.take_action(env)
    else:
        return o_agent.take_action(env)