import graphene
from geo_app.schema.queries import Query

schema = graphene.Schema(query=Query) 