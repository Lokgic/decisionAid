from django.shortcuts import render
from numpy import random
from django.http import HttpResponse

from rest_framework.views import APIView
from rest_framework.response import Response
# Create your views here.

def viz_beta(request):
    samples =random.beta(1,2,5)
    return render(request,'vizs/beta_viz.html',{'samples':samples})

def draw_beta(a,b,n):
    samples = random.beta(a,b,n)
    return [round(sample,3) for sample in samples]

class SampleBeta(APIView):
    def get(self, request, format=None):
        parm = {p:int(request.GET[p]) for p in request.GET}
        sample = draw_beta(parm['a'],parm['b'],parm['n'])
        return Response(sample)
