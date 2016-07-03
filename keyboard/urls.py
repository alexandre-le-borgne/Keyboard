from django.conf.urls import url, include
from django.contrib import admin

from . import views

app_name = 'keyboard'

urlpatterns = [
    url(r'^$', views.index),
    url(r'^classicals$', views.classicals),
    url(r'^classical/(?P<name>.*)$', views.classical),
    url(r'^ergofips$', views.ergofips),
    url(r'^ergofip/(?P<name>.*)$', views.ergofip),
    url(r'^admin/', include(admin.site.urls)),
]
