from django.core.management.base import BaseCommand
from geo_app.models import Topology
import json
import os

class Command(BaseCommand):
    help = 'Dump topology data to fixture files by type'

    def add_arguments(self, parser):
        parser.add_argument('--type', type=str, required=True,
                          help='Type of region (PROVINCE, DISTRICT, DSD)')
        parser.add_argument('--output', type=str, required=True,
                          help='Output file path')

    def handle(self, *args, **options):
        region_type = options['type'].upper()
        output_file = options['output']

        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(output_file), exist_ok=True)

        # Get records of specified type
        records = Topology.objects.filter(type=region_type)

        # Convert to fixture format
        fixture_data = [
            {
                "model": "geo_app.topology",
                "pk": record.region_id,
                "fields": {
                    "name": record.name,
                    "type": record.type,
                    "properties": record.properties,
                    "geometry_type": record.geometry_type,
                    "arcs": record.arcs
                }
            }
            for record in records
        ]

        # Write to file
        with open(output_file, 'w') as f:
            json.dump(fixture_data, f, indent=2)

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully dumped {len(fixture_data)} {region_type} records to {output_file}'
            )
        ) 