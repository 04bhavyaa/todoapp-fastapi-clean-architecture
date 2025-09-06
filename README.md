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
5. (Additional) To run all tests:
  ```sh
  pytest
  ```

## Usage

- Register a new user
- Login to get access to your todos
- Add, complete, and delete todos
- Change your password (with strength validation)

## Project Gallery
<img width="1919" height="833" alt="Screenshot 2025-09-06 130317" src="https://github.com/user-attachments/assets/5487deb4-2bff-430d-a9e8-e6c7c72e10bc" />
<img width="1919" height="688" alt="Screenshot 2025-09-06 130255" src="https://github.com/user-attachments/assets/56c26802-c7d8-4160-959d-f3fa58a7f28e" />
<img width="1919" height="690" alt="Screenshot 2025-09-06 130241" src="https://github.com/user-attachments/assets/192cf45f-0948-4ef6-8fec-7dcdf0620c2f" />
<img width="1259" height="674" alt="Screenshot 2025-09-06 130545" src="https://github.com/user-attachments/assets/d4a6818d-4f43-43ce-a70f-2611a3399ba7" />
<img width="635" height="591" alt="Screenshot 2025-09-06 130521" src="https://github.com/user-attachments/assets/fd85e7e5-bbfb-4763-a282-044c72f31cf0" />
<img width="1919" height="701" alt="Screenshot 2025-09-06 130446" src="https://github.com/user-attachments/assets/a78fe8dc-3d9b-40f9-a8c1-01a871ad5285" />
<img width="1919" height="712" alt="Screenshot 2025-09-06 130432" src="https://github.com/user-attachments/assets/ab9f8864-c3ff-4346-b698-e49154b2b0f4" />
<img width="1235" height="632" alt="Screenshot 2025-09-06 130417" src="https://github.com/user-attachments/assets/74fbd3a6-d781-4372-80ee-5a4b2a5ef0b6" />
<img width="1919" height="728" alt="Screenshot 2025-09-06 130408" src="https://github.com/user-attachments/assets/e72743d1-ce32-435f-a550-95a1ac3e01ab" />
<img width="1918" height="768" alt="Screenshot 2025-09-06 130348" src="https://github.com/user-attachments/assets/63e4bbf1-57f2-4c6b-bdf8-453531665be1" />

