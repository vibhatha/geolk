from graphene_django.types import DjangoObjectType
import graphene
from geo_app.models import GeoPolygon
from geo_app.schema.types import GeoPolygonType

class CreateGeoPolygon(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        region_id = graphene.String(required=True)
        type = graphene.String(required=True)
        geom = graphene.String()  # Accepts GeoJSON input

    polygon = graphene.Field(lambda: GeoPolygonType)

    def mutate(self, info, name, region_id, type, geom):
        polygon = GeoPolygon(name=name, region_id=region_id, type=type, geom=geom)
        polygon.save()
        return CreateGeoPolygon(polygon=polygon)

class UpdateGeoPolygon(graphene.Mutation):
    class Arguments:
        region_id = graphene.String(required=True)
        name = graphene.String()
        type = graphene.String()

    polygon = graphene.Field(lambda: GeoPolygonType)

    def mutate(self, info, region_id, name=None, type=None):
        polygon = GeoPolygon.objects.get(region_id=region_id)
        if name:
            polygon.name = name
        if type:
            polygon.type = type
        polygon.save()
        return UpdateGeoPolygon(polygon=polygon)

class DeleteGeoPolygon(graphene.Mutation):
    class Arguments:
        region_id = graphene.String(required=True)

    success = graphene.Boolean()

    def mutate(self, info, region_id):
        try:
            polygon = GeoPolygon.objects.get(region_id=region_id)
            polygon.delete()
            return DeleteGeoPolygon(success=True)
        except GeoPolygon.DoesNotExist:
            return DeleteGeoPolygon(success=False)
