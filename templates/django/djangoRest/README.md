# Django project boilerplate
Boilerplate with JWT authentication, login and signup views.

By dedault web service installs python dependencies based on [requeriments.pip](https://github.com/imjulioc/django-project-boilerplate/blob/master/src/requirements.pip) which does not specify any version (so last dependencie version would be downloaded).

## Development enviroment
Develop and test your django project setting a virtual enviroment inside [src](https://github.com/imjulioc/django-project-boilerplate/tree/master/src) and running **django runserver** command with **--settings='project.local_settings'** parameter.

## Useful commands
- make build: build services from docker-compose
- make start: starts services
- make stop: stops services
- make restart: restarts services
- make collectstatic: invoke django-collectstatic command in web service
- make createsuperuser username=USERNAME email=EMAIL password=PASSWORD: invoke django-createsuperuser command in webservice. Parameters must be single quoted.
