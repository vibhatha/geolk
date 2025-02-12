from django.contrib.gis.db import models

class GeoPolygon(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    geom = models.PolygonField()  # PostGIS Polygon field

    def __str__(self):
        return self.name + ", " + self.type
