from django.db import models

# Create your models here.


class Marker(models.Model):
    elat = models.DecimalField(max_digits=30, decimal_places=20, blank=True, null=True)
    elon = models.DecimalField(max_digits=30, decimal_places=20, blank=True, null=True)
    email = models.EmailField()
    title = models.CharField(max_length=100)
    token = models.CharField(max_length=12, unique=True)
    message = models.TextField()
    pub_date = models.DateField(auto_now_add=True)

    def send_token(email):
        # Here send token for user
        return email

    def __str__(self):
        return self.title


class Photo(models.Model):
    marker = models.ForeignKey(Marker, related_name='photos')
    image = models.ImageField(upload_to='photos/', blank=True)


class Report(models.Model):
    email = models.EmailField()
    theme = models.CharField(max_length=100)
    message = models.TextField()

    def send_mail(email, theme, message):
        # Here we're send mail to admin
        return email, theme, message

    def __str__(self):
        return self.theme