import graphene
from geo_app.schema.queries import Query
from geo_app.schema.mutations import Mutation

schema = graphene.Schema(query=Query, mutation=Mutation) 