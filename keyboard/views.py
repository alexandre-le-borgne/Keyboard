import json
import urllib.parse

from django.utils import translation
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect, render_to_response

from keyboard.models.preset import Preset


def index(request):
    return render(request, 'index.html', locals())


def classicals(request):
    names = []
    for preset in Preset.objects.filter(type=Preset.CLASSICAL):
        names.append(preset.name)
    return JsonResponse(names, safe=False)


def classical(request, name):
    presets = Preset.objects.filter(name=urllib.parse.unquote(name), type=Preset.CLASSICAL)
    if presets:
        return JsonResponse(json.loads(presets[0].data), safe=False)
    return JsonResponse(dict())


def ergofips(request):
    names = []
    for preset in Preset.objects.filter(type=Preset.ERGOFIP):
        names.append(preset.name)
    return JsonResponse(names, safe=False)


def ergofip(request, name):
    presets = Preset.objects.filter(name=urllib.parse.unquote(name), type=Preset.ERGOFIP)
    if presets:
        return JsonResponse(json.loads(presets[0].data), safe=False)
    return JsonResponse(dict())