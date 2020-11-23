from django.urls import path

from .views import SignUp, signin

urlpatterns = [
    path('signup/', SignUp.as_view(), name='signup'),
    path('signin/', signin, name='signin'),
]