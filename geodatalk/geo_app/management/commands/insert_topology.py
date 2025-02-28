from django.core.management.base import BaseCommand
from geo_app.models import Topology
from geo_app.utils.topology import TopologyTransformer
import json

class Command(BaseCommand):
    """
    This command is used to insert topology data from TopoJSON files into the database.
    It will create or update the topology data for each region in the TopoJSON file,
    extracting only the necessary arcs for each region.

    Example:
    python manage.py insert_topology --type PROVINCE --data-file data/province.topojson
    """
    help = 'Insert topology data from TopoJSON files'

    def add_arguments(self, parser):
        parser.add_argument('--type', type=str, required=True,
                          help='Type of region (PROVINCE, DISTRICT, etc.)')
        parser.add_argument('--data-file', type=str, required=True,
                          help='Path to the TopoJSON file')

    def handle(self, *args, **options):
        region_type = options['type'].upper()
        
        # Read the TopoJSON file
        with open(options['data_file'], 'r') as f:
            topology_data = json.load(f)

        # Split into individual records
        records = TopologyTransformer.split_topology(topology_data)

        # Insert/update records
        for record in records:
            try:
                topology, created = Topology.objects.update_or_create(
                    region_id=record['region_id'],
                    defaults={
                        'name': record['name'],
                        'type': region_type,
                        'properties': record['properties'],
                        'geometry_type': record['geometry_type'],
                        'arcs': record['arcs']
                    }
                )

                action = 'Created' if created else 'Updated'
                self.stdout.write(
                    self.style.SUCCESS(
                        f'{action} {region_type} region: {record["name"]} (ID: {record["region_id"]})'
                    )
                )

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f'Error processing region {record["name"]}: {str(e)}'
                    )
                )
