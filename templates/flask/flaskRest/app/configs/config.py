from .development_config import DevelopmentConfig
from .production_config import ProductionConfig
from .testing_config import TestingConfig

ENVIRONMENT_MAPPING = {
    "production": ProductionConfig,
    "development": DevelopmentConfig,
    "testing": TestingConfig
}
