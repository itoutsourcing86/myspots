from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from .views import *

urlpatterns = [
    url(r'^$', MapView.as_view()),
    url(r'^contact/$', ContactView.as_view()),
    url(r'^add_marker/$', csrf_exempt(MarkerView.as_view())),
    url(r'^marker_popup/$', MarkerPopup.as_view())
]