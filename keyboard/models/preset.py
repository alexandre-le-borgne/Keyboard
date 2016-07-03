from django.db import models


class Preset(models.Model):
    CLASSICAL = 0
    ERGOFIP = 1
    name = models.CharField(null=True, max_length=50)
    data = models.TextField(null=True)
    type = models.IntegerField()

    def __str__(self):
        return self.name
