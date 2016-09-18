from django.conf.urls import url, include
from django.contrib import admin
from django.views.i18n import javascript_catalog


from . import views

app_name = 'keyboard'

js_info_dict = {
    'packages': ('keyboard',),
}

urlpatterns = [
    url(r'^classicals$', views.classicals),
    url(r'^classical/(?P<name>.*)$', views.classical),
    url(r'^ergofips$', views.ergofips),
    url(r'^ergofip/(?P<name>.*)$', views.ergofip),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^jsi18n/$', javascript_catalog, js_info_dict, name='javascript-catalog'),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r'^(?P<lang>.*)$', views.index),
]
