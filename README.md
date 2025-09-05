# Clean Architecture FastAPI Todo App

A full-stack Todo application built with FastAPI, PostgreSQL, Docker, and a modern Bootstrap frontend. The project follows Clean Architecture principles for maintainability and scalability.

## Tech Stack

- **Backend:** FastAPI, SQLAlchemy, Python 3.11+
- **Frontend:** HTML, CSS, JavaScript, Bootstrap 5, Font Awesome
- **Database:** PostgreSQL (Dockerized)
- **Auth:** JWT, bcrypt
- **Testing:** Pytest (unit & e2e), Docker Compose
- **DevOps:** Docker, Docker Compose

## Features

- User registration, login, and JWT authentication
- Secure password hashing and validation (with strength meter)
- Add, complete, and delete todos
- Password change with validation
- PostgreSQL database (Dockerized)
- Clean, modular backend structure
- Fully containerized with Docker Compose
- Frontend is served automatically by FastAPI (no separate static server needed)
- Comprehensive tests: unit and end-to-end tests in the `tests/` folder

## Project Structure

```
├── src/
│   ├── main.py            # FastAPI app entrypoint
│   ├── api.py             # API route registration
│   ├── entities/          # SQLAlchemy models (User, Todo)
│   ├── users/             # User logic (controller, service, model, validators)
│   ├── todos/             # Todo logic (controller, service, model)
│   ├── auth/              # Auth logic (JWT, password hashing)
│   ├── database/          # DB connection/core
│   ├── exceptions.py      # Custom exceptions
│   ├── logging.py         # Logging config
│   └── rate_limiting.py   # (Optional) Rate limiting logic
├── frontend/
│   ├── index.html         # Main UI
│   ├── app.js             # Frontend logic
│   └── style.css          # Custom styles
├── tests/
│   ├── conftest.py        # Pytest fixtures
│   ├── test_auth_service.py
│   ├── test_todos_service.py
│   ├── test_users_service.py
│   └── e2e/               # End-to-end API tests
│       ├── test_auth_endpoints.py
│       ├── test_todo_endpoints.py
│       └── test_users_endpoints.py
├── requirements.txt
├── requirements-dev.txt
├── docker-compose.yml
├── Dockerfile
├── pyproject.toml
└── README.md
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- (Optional) Python 3.11+ for local dev

### Quick Start (Docker)

```sh
git clone https://github.com/04bhavyaa/todoapp-fastapi-clean-architecture.git
cd todoapp-fastapi-clean-architecture
docker compose up --build
```

- Visit [http://localhost:8000](http://localhost:8000) in your browser. The frontend is served automatically by FastAPI.

### Local Development

1. Create a virtual environment and install dependencies:
   ```sh
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
2. Start PostgreSQL (or use Docker Compose)
3. Run the FastAPI app:
   ```sh
   uvicorn src.main:app --reload
   ```
4. Visit [http://localhost:8000](http://localhost:8000) — the frontend is served automatically.

## Usage

- Register a new user
- Login to get access to your todos
- Add, complete, and delete todos
- Change your password (with strength validation)

## Password Policy

- Minimum 8 characters
- At least one uppercase, one lowercase, one digit, and one special character
- Password strength meter shown in UI

## Testing

- All business logic and API endpoints are covered by unit and end-to-end tests in the `tests/` folder.
- To run all tests:
  ```sh
  pytest
  ```

