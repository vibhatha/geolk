from django.contrib.gis.db import models

class GeoPolygon(models.Model):
    name = models.CharField(max_length=100)
    region_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    geom = models.MultiPolygonField()  # Changed from PolygonField to MultiPolygonField

    def __str__(self):
        return self.name + ", " + self.type
