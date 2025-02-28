from django.contrib.gis.db import models

class GeoPolygon(models.Model):
    name = models.CharField(max_length=100)
    region_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    geom = models.MultiPolygonField()  # This will now work with the correct import

    def __str__(self):
        return self.name + ", " + self.type

class Topology(models.Model):
    """
    # Example TopoJSON structure stored in topology_data:
    {
        "type": "Topology",
        "objects": {
            "data": {
                "geometries": [{
                    "properties": {
                        "id": "LK-43",
                        "name": "Vavuniya",
                        ...
                    },
                    "type": "MultiPolygon",
                    "arcs": [[[0]]]
                }]
            }
        },
        ...
    }
    """
    # Fields for efficient querying
    region_id = models.CharField(max_length=10, primary_key=True)  # e.g., "LK-1"
    name = models.CharField(max_length=100)  # e.g., "Western Province"
    type = models.CharField(max_length=20)   # e.g., "PROVINCE"
    properties = models.JSONField()          # All properties from the TopoJSON
    geometry_type = models.CharField(max_length=20)  # e.g., "MultiPolygon"
    arcs = models.JSONField()                # The arcs array for this region

    class Meta:
        verbose_name_plural = "topologies"

    def __str__(self):
        return f"{self.name} ({self.region_id})"