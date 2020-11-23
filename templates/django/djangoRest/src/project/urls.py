from django.urls import path, include
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include("main.urls")),
    path('accounts/', include('accounts.urls')),
    path('api/accounts/', include('accounts.api.urls')),
]