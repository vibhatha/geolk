import graphene
from geo_app.models import GeoPolygon, Topology
from geo_app.schema.types import GeoPolygonType, TopologyType

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

class CreateTopology(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        region_id = graphene.String(required=True)
        type = graphene.String(required=True)
        topology_data = graphene.JSONString(required=True)  # Accepts TopoJSON input

    topology = graphene.Field(TopologyType)

    def mutate(self, info, name, region_id, type, topology_data):
        topology = Topology(
            name=name,
            region_id=region_id,
            type=type,
            topology_data=topology_data
        )
        topology.save()
        return CreateTopology(topology=topology)

class UpdateTopology(graphene.Mutation):
    class Arguments:
        region_id = graphene.String(required=True)
        name = graphene.String()
        type = graphene.String()
        topology_data = graphene.JSONString()

    topology = graphene.Field(TopologyType)

    def mutate(self, info, region_id, name=None, type=None, topology_data=None):
        try:
            topology = Topology.objects.get(region_id=region_id)
            if name:
                topology.name = name
            if type:
                topology.type = type
            if topology_data:
                topology.topology_data = topology_data
            topology.save()
            return UpdateTopology(topology=topology)
        except Topology.DoesNotExist:
            raise Exception(f"Topology with region_id {region_id} does not exist")

class DeleteTopology(graphene.Mutation):
    class Arguments:
        region_id = graphene.String(required=True)

    success = graphene.Boolean()

    def mutate(self, info, region_id):
        try:
            topology = Topology.objects.get(region_id=region_id)
            topology.delete()
            return DeleteTopology(success=True)
        except Topology.DoesNotExist:
            return DeleteTopology(success=False)

class Mutation(graphene.ObjectType):
    # Existing GeoPolygon mutations
    create_geo_polygon = CreateGeoPolygon.Field()
    update_geo_polygon = UpdateGeoPolygon.Field()
    delete_geo_polygon = DeleteGeoPolygon.Field()
    
    # New Topology mutations
    create_topology = CreateTopology.Field()
    update_topology = UpdateTopology.Field()
    delete_topology = DeleteTopology.Field()
