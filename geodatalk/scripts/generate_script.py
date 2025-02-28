#!/usr/bin/env python3

import csv
import argparse
import sys
import os


"""
Run it from the geodatalk directory

Example
-------

python scripts/generate_pd_script.py id -i ../submodules/gig-data/ents/pd.tsv -o scripts/pd_insert_script.sh -t pd

"""

def generate_insert_script(id_field, input_file, output_file, geo_type):
    try:
        # Create output directory if it doesn't exist
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        # Verify if the id_field exists in the TSV
        with open(input_file, 'r', encoding='utf-8') as tsv_file:
            header = tsv_file.readline().strip().split('\t')
            if id_field not in header:
                print(f"Error: Field '{id_field}' not found in TSV. Available fields are: {', '.join(header)}")
                sys.exit(1)
        
        # Read the TSV file
        with open(input_file, 'r', encoding='utf-8') as tsv_file:
            tsv_reader = csv.DictReader(tsv_file, delimiter='\t')
            
            # Open the output shell script file
            with open(output_file, 'w', encoding='utf-8') as shell_file:
                # Write script header
                shell_file.write("#!/bin/bash\n\n")
                shell_file.write(f"# Script to insert {geo_type} data using {id_field} as region ID\n\n")
                
                # Generate insert commands for each row
                for row in tsv_reader:
                    command = (
                        f"python manage.py insert_geo_data "
                        f"--type {geo_type} "
                        f"--name '{row['name']}' "
                        f"--region-id {row[id_field]} "
                        f"--data-file ../submodules/gig-data/geo/{geo_type}/{row[id_field]}.json\n"
                    )
                    shell_file.write(command)
                
                print(f"Script generated successfully at {output_file}")
                
    except FileNotFoundError:
        print(f"Error: Could not find the input file at {input_file}")
    except Exception as e:
        print(f"Error occurred: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description='Generate insert script for geographic data')
    parser.add_argument('id_field', help='Field name to use as region ID (e.g., pd_id, district_id)')
    parser.add_argument('--input', '-i', 
                      default='submodules/gig-data/ents/pd.tsv',
                      help='Input TSV file path (default: submodules/gig-data/ents/pd.tsv)')
    parser.add_argument('--output', '-o',
                      default='geodatalk/scripts/insert_pd_data.sh',
                      help='Output shell script path (default: geodatalk/scripts/insert_pd_data.sh)')
    parser.add_argument('--type', '-t',
                      default='pd',
                      help='Geographic type (default: pd)')
    
    args = parser.parse_args()
    generate_insert_script(args.id_field, args.input, args.output, args.type)

if __name__ == "__main__":
    main()