from collections import OrderedDict

class TopologyTransformer:
    @staticmethod
    def extract_required_arcs(geometry, all_arcs):
        """Extract only the arcs needed for this geometry"""
        required_arc_indices = set()
        
        # Handle MultiPolygon structure
        for polygon_arcs in geometry.get('arcs', []):
            for ring_arcs in polygon_arcs:
                for arc_index in ring_arcs:
                    # Handle negative indices (reversed arcs)
                    actual_index = abs(arc_index) - 1 if arc_index < 0 else arc_index
                    required_arc_indices.add(actual_index)
        
        # Create new arcs array with only required arcs
        return [all_arcs[i] for i in sorted(required_arc_indices)]

    @staticmethod
    def split_topology(topology_data):
        """
        Split a TopoJSON file into individual region records
        Returns a list of dictionaries ready for database insertion
        """
        geometries = topology_data['objects']['data']['geometries']
        records = []

        for geometry in geometries:
            record = {
                'region_id': geometry['properties']['id'],
                'name': geometry['properties']['name'],
                'properties': geometry['properties'],
                'geometry_type': geometry['type'],
                'arcs': geometry['arcs']
            }
            records.append(record)

        return records

    @staticmethod
    def combine_topologies(topology_records, region_type):
        """
        Combine individual topology records back into a complete TopoJSON file
        """
        if not topology_records:
            return None

        # Create the basic structure
        combined = OrderedDict([
            ('type', 'Topology'),
            ('objects', OrderedDict([
                ('data', OrderedDict([
                    ('type', 'GeometryCollection'),
                    ('geometries', [])
                ]))
            ]))
        ])

        # Add each region's geometry
        for record in topology_records:
            geometry = {
                'type': record.geometry_type,
                'properties': record.properties,
                'arcs': record.arcs
            }
            combined['objects']['data']['geometries'].append(geometry)

        # Sort geometries by region_id for consistency
        combined['objects']['data']['geometries'].sort(
            key=lambda x: x['properties']['id']
        )

        return combined

    @staticmethod
    def update_geometry_arcs(geometry, original_arcs, arc_mapping):
        """Update arc indices in a geometry based on the new mapping"""
        def update_arc_indices(arcs):
            if isinstance(arcs, list):
                for i, item in enumerate(arcs):
                    if isinstance(item, list):
                        update_arc_indices(item)
                    else:
                        # Handle negative indices (reversed arcs)
                        is_negative = item < 0
                        original_index = abs(item) - 1 if is_negative else item
                        arc_tuple = tuple(map(tuple, original_arcs[original_index]))
                        new_index = arc_mapping[arc_tuple]
                        arcs[i] = -(new_index + 1) if is_negative else new_index

        update_arc_indices(geometry['arcs']) 