from werkzeug.exceptions import BadRequest
from marshmallow.exceptions import ValidationError as DataError


def configure_errorhandler(app):
    @app.errorhandler(BadRequest)
    def handle_bad_request(error):
        return {"error": "Invalid data"}, 400

    @app.errorhandler(DataError)
    def handle_data_error(data_error):
        return {'error': data_error.normalized_messages()}, 422

    @app.errorhandler(Exception)
    def handle_server_error(error):
        print(error)
        return {'error': "Internal error"}, 500
