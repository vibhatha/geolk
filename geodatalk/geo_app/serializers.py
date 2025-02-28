from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from geo_app.models import GeoPolygon, Topology

class GeoPolygonSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = GeoPolygon
        geo_field = 'geom'
        fields = ('id', 'name', 'region_id', 'type', 'geom')

class TopologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Topology
        fields = ['region_id', 'name', 'type', 'topology_data']
        read_only_fields = ['region_id']  # region_id should not be modified after creation 