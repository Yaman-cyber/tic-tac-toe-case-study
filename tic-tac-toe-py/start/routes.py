from fastapi import APIRouter
from controllers.main import router as main_router
from controllers.game import router as game_router

# Create the main router
router = APIRouter()

router.include_router(main_router, prefix="/api", tags=["main"])
router.include_router(game_router, prefix="/api/game", tags=["game"])

