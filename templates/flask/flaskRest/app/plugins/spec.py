from pluggy import HookspecMarker

spec = HookspecMarker('app')


@spec
def app_load_blueprints(app):
    """Hook for registering blueprints."""
