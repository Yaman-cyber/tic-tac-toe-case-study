from fastapi import FastAPI
from start.routes import router

app = FastAPI(
    title="Tic Tac Toe AI API",
    description="API for playing Tic Tac Toe against an AI opponent",
    version="1.0.0"
)

# Include the router from routes.py
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 