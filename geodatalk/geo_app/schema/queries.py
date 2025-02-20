import graphene
from .types import GeoPolygonType
from geo_app.models import GeoPolygon

class Query(graphene.ObjectType):
    all_regions = graphene.List(GeoPolygonType)
    region_by_id = graphene.Field(GeoPolygonType, region_id=graphene.String(required=True))
    regions_by_type = graphene.List(GeoPolygonType, region_type=graphene.String(required=True))

    def resolve_all_regions(self, info):
        return GeoPolygon.objects.all()

    def resolve_region_by_id(self, info, region_id):
        try:
            return GeoPolygon.objects.get(region_id=region_id)
        except GeoPolygon.DoesNotExist:
            return None

    def resolve_regions_by_type(self, info, region_type):
        return GeoPolygon.objects.filter(type=region_type)
