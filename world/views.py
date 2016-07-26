from django.http import JsonResponse
from django.utils.crypto import get_random_string
from django.views.generic import View, TemplateView
from .forms import *


# Create your views here.


class MapView(TemplateView):
    template_name = 'main.html'
    contact_form = None

    def get(self, request, *args, **kwargs):
        self.contact_form = ContactForm()
        return super(MapView, self).get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(MapView, self).get_context_data(**kwargs)
        context['contact_form'] = self.contact_form
        return context


class ContactView(View):

    def post(self, request):
        report = Report.objects.create(email=request.POST['email'],
                                       theme=request.POST['theme'],
                                       message=request.POST['message'])
        report.save()
        return JsonResponse({'status': 'success'})


class MarkerView(View):

    def get(self, request):
        return JsonResponse({'markers': list(Marker.objects.all().values('elat', 'elon', 'title'))},
                            safe=False)

    def post(self, request):
        marker = Marker.objects.create(elat=request.POST['lat'],
                                       elon=request.POST['lng'],
                                       email=request.POST['email'],
                                       title=request.POST['title'],
                                       message=request.POST['message'],
                                       token=get_random_string(length=16))
        photo = Photo.objects.create(marker=marker, image=request.FILES['image'])
        photo.save()
        marker.save()
        return JsonResponse({'status': 'success'})


class MarkerPopup(View):

    def get(self, request):
        try:
            marker = Marker.objects.get(elat=request.GET['elat'], elon=request.GET['elon'])
            return JsonResponse({'photos': list(marker.photos.all().values('image')),
                                'message': marker.message}, safe=False)
        except Exception as e:
            return JsonResponse({'details': 'Something wrong...'})