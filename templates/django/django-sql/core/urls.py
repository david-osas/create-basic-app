from django.urls import path

from . import views

urlpatterns = [
    # ex: /core/
    path('', views.index, name='index'),
    # ex: /instagram
    path('instaloader/', views.instaloader, name='instaloader'),
]