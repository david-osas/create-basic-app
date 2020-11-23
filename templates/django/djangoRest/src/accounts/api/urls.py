from django.urls import path

from .views import refresh_access_token

urlpatterns = [
    path('refresh_access_token/', refresh_access_token, name='refresh_access_token'),
]