from django.db import models


class Preset(models.Model):
    name = models.CharField(null=True, max_length=50)
    data = models.TextField(null=True)

    def __str__(self):
        return self.name
