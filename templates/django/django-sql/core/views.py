from django.shortcuts import render
from django.contrib import messages
from django.views.generic import TemplateView
from django.views.generic.list import ListView
from django.views.generic.edit import FormView
from django.shortcuts import redirect
from django.http import HttpResponse, Http404
import sys

# External Modules
from .tasks import run_script
from .forms import InstaloaderForm

def index(request):
    return render(request, 'core/index.html')

def instaloader(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = InstaloaderForm(request.POST)

        # check whether it's valid:
        if form.is_valid():
            USERNAME = form.cleaned_data['username']
            PASSWORD = form.cleaned_data['password']
            SHORTCODE = form.cleaned_data['shortcode']
            
            try:
                # Python Celery
                run_script.delay(USERNAME, PASSWORD)

                messages.success(request, 'fetching posts')
                messages.success(request, 'Wait a moment and refresh this page.')
            except ValueError as e:
                messages.error(request, e.message)
            except Exception as e:
                messages.error(request, "Unexpected error. " + e.message)
                    
            return redirect('index')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = InstaloaderForm()

    return render(request, 'core/instaloader.html', {'form': form})