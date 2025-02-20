import graphene
from graphene_django.types import DjangoObjectType
from geo_app.models import GeoPolygon
from geo_app.schema.scalars import GeoJSONScalar

class GeoPolygonType(DjangoObjectType):
    geom = GeoJSONScalar()

    class Meta:
        model = GeoPolygon
        fields = ('id', 'name', 'region_id', 'type')

    def resolve_geom(self, info):
        return self.geom
