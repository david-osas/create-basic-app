FROM python:3.7-alpine

ENV PYTHONUNBUFFERED 1
ENV C_FORCE_ROOT true

RUN mkdir /src
RUN mkdir /static

WORKDIR /src

RUN apk update && apk add --no-cache \
    postgresql \
    zlib \
    jpeg \
    openblas \ 
    libstdc++ 

RUN apk add --no-cache --virtual build-deps \
    gcc \  
    python3-dev \ 
    musl-dev \
    postgresql-dev\
    zlib-dev \
    jpeg-dev \ 
    g++ \
    openblas-dev \
    cmake \
    && ln -s /usr/include/locale.h /usr/include/xlocale.h

RUN pip install --upgrade pip

COPY ./src/requirements.pip /scripts/
RUN pip install --no-cache-dir -r /scripts/requirements.pip

RUN apk del build-deps && \
    find -type d -name __pycache__ -prune -exec rm -rf {} \; && \
    rm -rf ~/.cache/pip

CMD ["sh", "-c", "python manage.py collectstatic --no-input; python manage.py migrate; gunicorn project.wsgi -b 0.0.0.0:8000"]
