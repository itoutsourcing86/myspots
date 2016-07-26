from django import forms
from .models import *


class ContactForm(forms.ModelForm):

    def __init__(self):
        super(ContactForm, self).__init__()
        for field in ['email', 'theme', 'message']:
            self.fields[field].widget.attrs['class'] = 'form-control'
            self.fields[field].widget.attrs['required'] = 'required'

    class Meta:
        model = Report
        fields = '__all__'
        labels = {'theme': 'Тема письма', 'message': 'Сообщение'}


class MarkerForm(forms.ModelForm):

    def __init__(self):
        super(MarkerForm, self).__init__()
        for field in ['email', 'title', 'message']:
            self.fields[field].widget.attrs['class'] = 'form-control'
            self.fields[field].widget.attrs['required'] = 'required'
            if field == 'message':
                self.fields[field].widget.attrs['rows'] = '3'

    class Meta:
        model = Marker
        fields = ['email', 'title', 'message']
        labels = {'title': 'Название маркера', 'message': 'Сообщение'}