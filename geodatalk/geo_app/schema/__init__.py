import graphene
from .queries import Query
from .mutations import CreateGeoPolygon, UpdateGeoPolygon, DeleteGeoPolygon

class Mutation(graphene.ObjectType):
    create_polygon = CreateGeoPolygon.Field()
    update_polygon = UpdateGeoPolygon.Field()
    delete_polygon = DeleteGeoPolygon.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
