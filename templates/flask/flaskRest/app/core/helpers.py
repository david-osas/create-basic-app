def handleInternalError(e):
    print(e)
    return {'error': "Internal error"}, 500
