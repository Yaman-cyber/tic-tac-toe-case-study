# Tic Tac Toe AI API

A FastAPI-based web application that expose the stateless tic-tac-toe engine provided to use with REST API's

## Installation

1. Create virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Run Application

run:

```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Documentation

API documentation at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
tic-tac-toe-py/
├── controllers/    # Request handlers and business logic
├── enums/          # Enumeration classes
├── schemas/        # Data models and validation schemas
├── services/       # Core game logic and AI implementation
├── start/          # Application startup and routing
├── main.py         # Application entry point
└── requirements.txt # Project dependencies
```
