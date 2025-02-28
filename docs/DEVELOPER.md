# Developer Notes

## Setting Up Development Environment


## Insert Topology Data

```bash
python manage.py insert_topology --type PROVINCE --data-file submodules/gig-data/mylocal-data/geo/topo-geo_json/province.topojson
```

## Running Tests

First we need to dump the topology data from the database into a JSON file.


### Insert Topology Data

```bash
python manage.py insert_topology --type PROVINCE --data-file submodules/gig-data/mylocal-data/geo/topo-geo_json/province.topojson
```

### Dump Topology Data

```bash
python manage.py dump_topology --type PROVINCE --output geo_app/fixtures/province_topology.json
```

### Run Tests

```bash
python manage.py test geo_app.tests.TopologyTests.test_topology_transformation -v 2
```

### Troubleshooting

If you encounter an error like this:

```bash
Destroying test database for alias 'default' ('test_neondb')...
Traceback (most recent call last):
  File "/Users/ldf/miniforge3/envs/geolk_env/lib/python3.9/site-packages/django/db/backends/utils.py", line 87, in _execute
    return self.cursor.execute(sql)
psycopg2.errors.ObjectInUse: database "test_neondb" is being accessed by other users
DETAIL:  There is 1 other session using the database.
```

Go to the service or location where your database is hosted and try the following. 


```sql
SELECT pid, usename, application_name, state, query 
FROM pg_stat_activity 
WHERE datname = 'test_neondb';

SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'test_neondb';
```