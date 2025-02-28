from django.contrib.gis.db import models

class GeoPolygon(models.Model):
    name = models.CharField(max_length=100)
    region_id = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    geom = models.MultiPolygonField()  # Changed from PolygonField to MultiPolygonField

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
    region_id = models.CharField(max_length=10, primary_key=True)  # e.g., "LK-43"
    name = models.CharField(max_length=100)                        # e.g., "Vavuniya"
    type = models.CharField(max_length=20)                         # e.g., "DISTRICT"
    
    # Store the complete TopoJSON file
    topology_data = models.JSONField()  # Changed from postgres.JSONField to models.JSONField
    
    class Meta:
        db_table = 'topology'
        indexes = [
            models.Index(fields=['type']),
        ]

    def __str__(self):
        return f"{self.name} ({self.type})"