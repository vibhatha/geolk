from django.core.management.base import BaseCommand
from geo_app.models import Topology
import json
from collections import OrderedDict
import os

class Command(BaseCommand):
    """
    This command is used to insert topology data from TopoJSON files into the database.
    It will create or update the topology data for the given region type and data file.

    Example:
    python manage.py insert_topology --type DISTRICT --data-file data/districts.topojson
    """
    help = 'Insert topology data from TopoJSON files'

    def add_arguments(self, parser):
        parser.add_argument('--type', type=str, required=True,
                          help='Type of region (DISTRICT, PROVINCE, etc.)')
        parser.add_argument('--data-file', type=str, required=True,
                          help='Path to the TopoJSON file')

    def handle(self, *args, **options):
        region_type = options['type'].upper()
        data_file = options['data_file']

        # Ensure data file exists
        if not os.path.exists(data_file):
            self.stdout.write(self.style.ERROR(f'File {data_file} does not exist'))
            return

        try:
            # Read the entire TopoJSON file while preserving field order
            with open(data_file, 'r') as f:
                file_content = f.read()  # Read as string first
                print("Original JSON structure:")
                print(file_content[:200])  # Print first 200 chars to see order
                
                # Reset file pointer and load as JSON
                f.seek(0)
                topology_data = json.load(f, object_pairs_hook=OrderedDict)
                
                print("Loaded JSON structure:")
                print(json.dumps(dict(topology_data), indent=2)[:200])  # Print first 200 chars

            # Process each geometry in the topology
            geometries = topology_data['objects']['data']['geometries']
            
            for geometry in geometries:
                try:
                    # Extract fields for querying
                    region_id = geometry['properties']['id']
                    name = geometry['properties']['name']
                    
                    # Store the complete topology data with preserved order
                    topology, created = Topology.objects.update_or_create(
                        region_id=region_id,
                        defaults={
                            'name': name,
                            'type': region_type,
                            'topology_data': topology_data
                        }
                    )

                    action = 'Created' if created else 'Updated'
                    self.stdout.write(
                        self.style.SUCCESS(
                            f'{action} {region_type} region: {name} (ID: {region_id})'
                        )
                    )

                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(
                            f'Error processing region {geometry.get("properties", {}).get("name", "Unknown")}: {str(e)}'
                        )
                    )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error reading {data_file}: {str(e)}')
            ) 