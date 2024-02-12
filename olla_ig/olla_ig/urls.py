from django.contrib import admin
from django.urls import path, include
from django.conf.urls import include

urlpatterns = [
    path('', include('login.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),

]
