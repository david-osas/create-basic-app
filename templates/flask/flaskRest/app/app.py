import os
import sys
from flask import Flask, Blueprint
from pluggy import PluginManager
from app.extentions import db, mirgrate, ma, jwt
from app.configs import config
from app.plugins import spec
from app.core.error_handlers import configure_errorhandler


def create_app(config=None):
    app = Flask("app", instance_relative_config=True)

    if not os.path.exists(app.instance_path):
        os.makedirs(app.instance_path)

    configure_app(app)
    configure_extentions(app)
    touch_files()
    load_plugins(app)
    configure_errorhandler(app)
    configure_blueprints(app)

    @app.route('/')
    def index():
        return 'Index Page'

    return app


def configure_app(app):
    app.config.from_object(
        config.ENVIRONMENT_MAPPING.get(app.config['ENV'], None))
    app.config.from_mapping(os.environ)
    app.pluggy = PluginManager('app')


def configure_extentions(app):
    db.init_app(app)
    mirgrate.init_app(app, db=db)
    ma.init_app(app)
    jwt.init_app(app)


def load_plugins(app):
    def iteritems(d): return iter(d.items())
    app.pluggy.add_hookspecs(spec)

    app_modules = set(
        module for name, module in iteritems(sys.modules)
        if name.startswith('app')
    )

    for module in app_modules:
        app.pluggy.register(module)


def touch_files():
    from app.user import models as UserModels, resources
    from app.core import decorators


def configure_blueprints(app):
    app.pluggy.hook.app_load_blueprints(app=app)
