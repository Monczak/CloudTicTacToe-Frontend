ARG PORT=8000

FROM python:3.11.7-alpine
ARG PORT

ENV SERVER_PORT=$PORT

ENV POETRY_VERSION=1.8.2
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VENV=/opt/poetry-venv
ENV POETRY_CACHE_DIR=/opt/.cache

RUN python3 -m venv $POETRY_VENV \
    && $POETRY_VENV/bin/pip install -U pip setuptools \
    && $POETRY_VENV/bin/pip install poetry==${POETRY_VERSION}

ENV PATH="${PATH}:${POETRY_VENV}/bin"

WORKDIR /app
COPY poetry.lock pyproject.toml /app/

RUN poetry install 

COPY ./src /app/src
COPY ./static /app/static
COPY ./templates /app/templates 

CMD poetry run gunicorn --bind 0.0.0.0:$SERVER_PORT src.app:app
EXPOSE $SERVER_PORT