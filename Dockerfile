FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pyproject.toml poetry.lock /app/

RUN pip install --upgrade pip \
    && pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

COPY backend/ /app/backend/

WORKDIR /app/backend

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
