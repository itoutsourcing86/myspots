# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-06 17:27
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('world', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='image',
            field=models.ImageField(blank=True, upload_to='uploads/'),
        ),
    ]
