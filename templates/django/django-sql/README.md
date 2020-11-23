# About this project

**Django + CELERY + SQLite Boilerplate.**

The intent of this project is to:

1. Validate **SQLite migration** and **CRUD operations** in a Django application.
2. Integrate **INSTALOADER** with **CELERY**



# Dependencies

```python
# Setup Celery
https://docs.celeryproject.org/en/stable/getting-started/first-steps-with-celery.html

# Setup RabbitMQ or Redis as a SERVICE
https://www.rabbitmq.com/download.html
```

# How to start

```python
# Install Module Dependencies
pip install requirements.txt
```

```python
# In one terminal tab
# Start the django application
python manage.py runserver
```

```python
# In another terminal tab
# Start celery
celery -A digimarket_test worker --pool=eventlet -l INFO
```

# File Streucture

```js
/digimarket_test
  manage.py
  /digimarket_test
    __init__.py
    settings.py
    urls.py
    asgi.py
    wsgi.py
  /code
    /migrations
    /static // Static files
    /templates // Django template filees
    __init__.py
    admin.py
    apps.py
    forms.py
    modles.py
    tasks.py // Celery Task
    tests.py
    urls.py // Django endpoint/route setup
    views.py // View Renderer
```

# References

1. (Django + Celery) https://simpleisbetterthancomplex.com/tutorial/2017/08/20/how-to-use-celery-with-django.html
2. (Instaloader) https://instaloader.github.io/codesnippets.html
