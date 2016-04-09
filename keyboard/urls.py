from django.conf.urls import url, include
from django.contrib import admin

from . import views

app_name = 'keyboard'

urlpatterns = [
    url(r'^$', views.index),
    url(r'^admin/', include(admin.site.urls)),
]
