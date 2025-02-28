from django.test import TestCase
from geo_app.models import Topology
from geo_app.utils.topology import TopologyTransformer
import json
import os
import logging
import sys

# Set up logging to write to both file and console
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Create console handler with a higher log level
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.DEBUG)
console_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler.setFormatter(console_formatter)

# Create file handler which logs even debug messages
file_handler = logging.FileHandler('test_topology.log')
file_handler.setLevel(logging.DEBUG)
file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)

# Add both handlers to the logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)

class TopologyTests(TestCase):
    """
    Test cases for Topology model and transformations.
    
    This test verifies that we can:
    1. Read a TopoJSON file from submodules
    2. Split it into individual records
    3. Store those records in the database
    4. Recombine the records into a TopoJSON
    5. Verify the recombined data matches the original
    """
    
    @classmethod
    def setUpTestData(cls):
        """Set up data for all test methods in this class"""
        super().setUpTestData()
        logger.info("=" * 80)
        logger.info("Setting up test data for all tests")
        
        # Load original file from submodules
        file_path = os.path.join(
            '..', 'submodules', 'gig-data', 'mylocal-data', 'geo',
            'topo-geo_json', 'province.topojson'
        )
        
        logger.debug(f"Looking for topology file at: {file_path}")
        if not os.path.exists(file_path):
            raise Exception(
                f"Original topology file not found at {file_path}. "
                "Please ensure the submodules are properly initialized."
            )

        # Load and process the original file
        logger.info("Loading original topology file")
        with open(file_path, 'r') as f:
            cls.original_topology = json.load(f)
        
        cls.original_geometries = cls.original_topology['objects']['data']['geometries']
        logger.debug(f"Loaded topology with {len(cls.original_geometries)} geometries")

        # Create a map of original geometries by ID for easier comparison
        cls.original_by_id = {
            g['properties']['id']: g for g in cls.original_geometries
        }
        logger.debug(f"Original region IDs: {list(cls.original_by_id.keys())}")

        # Split into records
        logger.info("Splitting topology into individual records")
        records = TopologyTransformer.split_topology(cls.original_topology)
        logger.debug(f"Split into {len(records)} individual records")
        
        # Insert records into test database
        logger.info("Inserting records into test database")
        for record in records:
            logger.debug(f"Creating record for region: {record['name']} ({record['region_id']})")
            Topology.objects.create(
                region_id=record['region_id'],
                name=record['name'],
                type='PROVINCE',
                properties=record['properties'],
                geometry_type=record['geometry_type'],
                arcs=record['arcs']
            )
        
        logger.info("Test data setup completed")
        logger.info("=" * 80)

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        logger.info("=" * 80)
        logger.info("Starting Topology Tests")
        logger.info("=" * 80)
    
    def setUp(self):
        logger.info("-" * 40)
        logger.info(f"Starting test: {self._testMethodName}")
        logger.info("-" * 40)
    
    def tearDown(self):
        logger.info(f"Finished test: {self._testMethodName}")
        logger.info("-" * 40)
    
    @classmethod
    def tearDownClass(cls):
        logger.info("=" * 80)
        logger.info("All Topology Tests Completed")
        logger.info("=" * 80)
        super().tearDownClass()
    
    def test_topology_transformation(self):
        """Test splitting and recombining topology data"""
        logger.info("Starting topology transformation test")

        # Retrieve and recombine
        logger.info("Retrieving records from database")
        province_records = Topology.objects.filter(type='PROVINCE')
        logger.debug(f"Retrieved {province_records.count()} records")
        
        logger.info("Recombining records into complete topology")
        combined_topology = TopologyTransformer.combine_topologies(
            province_records, 'PROVINCE'
        )

        # Compare each geometry individually
        logger.info("Comparing individual geometries")
        combined_geometries = combined_topology['objects']['data']['geometries']
        combined_by_id = {
            g['properties']['id']: g for g in combined_geometries
        }
        logger.debug(f"Combined region IDs: {list(combined_by_id.keys())}")

        # First check if we have the same set of region IDs
        original_ids = set(self.original_by_id.keys())
        combined_ids = set(combined_by_id.keys())
        
        # Check for missing or extra regions
        missing_ids = original_ids - combined_ids
        extra_ids = combined_ids - original_ids
        
        if missing_ids:
            logger.error(f"Missing regions in combined topology: {missing_ids}")
            self.fail(f"Missing regions in combined topology: {missing_ids}")
        
        if extra_ids:
            logger.error(f"Extra regions in combined topology: {extra_ids}")
            self.fail(f"Extra regions in combined topology: {extra_ids}")

        # Compare each region's properties and arcs
        for region_id in original_ids:
            logger.debug(f"Comparing region: {region_id}")
            original = self.original_by_id[region_id]
            combined = combined_by_id[region_id]
            
            # Compare properties
            try:
                self.assertEqual(
                    original['properties'],
                    combined['properties'],
                    f"Properties mismatch for region {region_id}"
                )
                logger.debug(f"Properties match for region {region_id}")
            except AssertionError as e:
                logger.error(f"Properties mismatch for region {region_id}")
                logger.error(f"Original: {original['properties']}")
                logger.error(f"Combined: {combined['properties']}")
                raise

            # Compare geometry type
            try:
                self.assertEqual(
                    original['type'],
                    combined['type'],
                    f"Geometry type mismatch for region {region_id}"
                )
                logger.debug(f"Geometry type matches for region {region_id}")
            except AssertionError as e:
                logger.error(f"Geometry type mismatch for region {region_id}")
                logger.error(f"Original: {original['type']}")
                logger.error(f"Combined: {combined['type']}")
                raise

            # Compare arcs
            try:
                self.assertEqual(
                    original['arcs'],
                    combined['arcs'],
                    f"Arcs mismatch for region {region_id}"
                )
                logger.debug(f"Arcs match for region {region_id}")
            except AssertionError as e:
                logger.error(f"Arcs mismatch for region {region_id}")
                logger.error(f"Original: {original['arcs']}")
                logger.error(f"Combined: {combined['arcs']}")
                raise

        logger.info("All regions compared successfully")
        logger.info("Topology transformation test completed successfully")

    def test_individual_province_data(self):
        """Test that individual province data is correctly stored and retrieved"""
        logger.info("Starting individual province data test")

        # Test each province individually
        logger.info("Verifying individual province records")
        for region_id, original_geometry in self.original_by_id.items():
            logger.debug(f"Checking province: {region_id}")
            
            # Get the stored record
            stored_record = Topology.objects.get(region_id=region_id)
            
            # Verify basic properties
            try:
                self.assertEqual(stored_record.name, original_geometry['properties']['name'])
                self.assertEqual(stored_record.properties, original_geometry['properties'])
                self.assertEqual(stored_record.geometry_type, original_geometry['type'])
                self.assertEqual(stored_record.arcs, original_geometry['arcs'])
                logger.debug(f"Province {region_id} verified successfully")
            except AssertionError as e:
                logger.error(f"Verification failed for province {region_id}")
                logger.error(str(e))
                raise

        logger.info("Individual province data test completed successfully")
