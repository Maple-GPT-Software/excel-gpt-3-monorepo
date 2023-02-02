from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions

from . import views

urlpatterns = [
    path('', csrf_exempt(views.completion), name='completion'),
]
