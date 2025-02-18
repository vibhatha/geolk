from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import GeoPolygon

class GeoPolygonSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = GeoPolygon
        geo_field = 'geom'
        fields = ('id', 'name', 'region_id', 'type', 'geom') 