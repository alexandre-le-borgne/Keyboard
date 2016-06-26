import json

from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect

from keyboard.models.preset import Preset


def index(request):
    return render(request, 'index.html', locals())


def classicals(request):
    names = []
    for preset in Preset.objects.all():
        names.append(preset.name)
    return JsonResponse(names, safe=False)


def classical(request, name):
    presets = Preset.objects.filter(name=name.replace('_', ' '))
    if presets:
        return JsonResponse(json.loads(presets[0].data), safe=False)
    return JsonResponse(dict())