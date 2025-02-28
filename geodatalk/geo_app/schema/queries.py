import graphene
from geo_app.schema.types import GeoPolygonType, TopologyType
from geo_app.models import GeoPolygon, Topology

class Query(graphene.ObjectType):
    all_regions = graphene.List(GeoPolygonType)
    region_by_id = graphene.Field(GeoPolygonType, region_id=graphene.String(required=True))
    regions_by_type = graphene.List(GeoPolygonType, region_type=graphene.String(required=True))

    # New Topology queries
    all_topologies = graphene.List(TopologyType)
    topology_by_id = graphene.Field(TopologyType, region_id=graphene.String(required=True))
    topologies_by_type = graphene.List(TopologyType, region_type=graphene.String(required=True))

    def resolve_all_regions(self, info):
        return GeoPolygon.objects.all()

    def resolve_region_by_id(self, info, region_id):
        try:
            return GeoPolygon.objects.get(region_id=region_id)
        except GeoPolygon.DoesNotExist:
            return None

    def resolve_regions_by_type(self, info, region_type):
        return GeoPolygon.objects.filter(type=region_type)

    # New Topology resolvers
    def resolve_all_topologies(self, info):
        return Topology.objects.all()

    def resolve_topology_by_id(self, info, region_id):
        try:
            return Topology.objects.get(region_id=region_id)
        except Topology.DoesNotExist:
            return None

    def resolve_topologies_by_type(self, info, region_type):
        return Topology.objects.filter(type=region_type)
