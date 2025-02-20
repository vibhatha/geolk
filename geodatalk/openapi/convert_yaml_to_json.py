import yaml
import json
import os

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get directory of this script
yaml_file_path = os.path.join(BASE_DIR, "openapi.yaml")
json_file_path = os.path.join(BASE_DIR, "openapi.json")

try:
    # Load YAML file
    with open(yaml_file_path, "r", encoding="utf-8") as yaml_file:
        yaml_data = yaml.safe_load(yaml_file)

    # Convert and save as JSON
    with open(json_file_path, "w", encoding="utf-8") as json_file:
        json.dump(yaml_data, json_file, indent=2)

    print(f"✅ Successfully converted '{yaml_file_path}' to '{json_file_path}'")

except FileNotFoundError:
    print(f"❌ Error: '{yaml_file_path}' not found!")
except yaml.YAMLError as e:
    print(f"❌ YAML Parsing Error: {e}")
except Exception as e:
    print(f"❌ Unexpected Error: {e}")
