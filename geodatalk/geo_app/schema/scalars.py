import graphene
from graphene.types import Scalar
from graphql.language import ast
import json

class GeoJSONScalar(Scalar):
    """
    Scalar type for GeoJSON geometry
    """
    @staticmethod
    def serialize(geom):
        # Convert geometry to GeoJSON
        return json.loads(geom.geojson)

    @staticmethod
    def parse_literal(node):
        if isinstance(node, ast.StringValue):
            return json.loads(node.value)
        return None

    @staticmethod
    def parse_value(value):
        return json.loads(value)
