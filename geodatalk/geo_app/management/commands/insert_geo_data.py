from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Polygon, MultiPolygon
from geo_app.models import GeoPolygon
import json
import os

class Command(BaseCommand):
    help = 'Insert geographic data from GeoJSON files'

    def add_arguments(self, parser):
        parser.add_argument('--type', type=str, required=True,
                          help='Type of region (provincial, district, etc.)')
        parser.add_argument('--name', type=str, required=True,
                          help='Name of the region')
        parser.add_argument('--region-id', type=str, required=True,
                          help='Unique identifier for the region')
        parser.add_argument('--data-file', type=str, required=True,
                          help='Path to the GeoJSON file')

    def handle(self, *args, **options):
        region_type = options['type']
        region_name = options['name']
        region_id = options['region_id']
        data_file = options['data_file']

        # Ensure data file exists
        if not os.path.exists(data_file):
            self.stdout.write(self.style.ERROR(f'File {data_file} does not exist'))
            return

        try:
            with open(data_file, 'r') as f:
                data = json.load(f)

            # Create multipolygon from coordinates
            try:
                # Convert each coordinate array to a Polygon
                polygons = [Polygon(coords) for coords in data]
                # Create a MultiPolygon from all polygons
                multipolygon = MultiPolygon(polygons)
                
                GeoPolygon.objects.create(
                    name=region_name,
                    region_id=region_id,
                    type=region_type,
                    geom=multipolygon
                )
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Successfully created {region_type} region: {region_name} (ID: {region_id})'
                    )
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'Error creating polygon for {region_name} (ID: {region_id}): {str(e)}'
                    )
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error reading {data_file}: {str(e)}')
            )
