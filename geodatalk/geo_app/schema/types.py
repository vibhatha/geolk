import graphene
from graphene_django.types import DjangoObjectType
from geo_app.models import GeoPolygon, Topology
from geo_app.schema.scalars import GeoJSONScalar, TopoJSONScalar

class GeoPolygonType(DjangoObjectType):
    geom = GeoJSONScalar()

    class Meta:
        model = GeoPolygon
        fields = ('id', 'name', 'region_id', 'type')

    def resolve_geom(self, info):
        return self.geom

class TopologyType(DjangoObjectType):
    topology_data = TopoJSONScalar()

    class Meta:
        model = Topology
        fields = ('region_id', 'name', 'type')

    def resolve_topology_data(self, info):
        return self.topology_data
