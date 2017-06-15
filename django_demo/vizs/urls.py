from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.viz_beta),
    url(r'^sample/', views.SampleBeta.as_view(), name='beta_sample')
]
