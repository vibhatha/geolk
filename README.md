# geolk

## Enable PostGIS 

[Learn more](https://neon.tech/docs/extensions/postgis#enable-the-postgis-extension)
[Learn more on PostGIS on Django](https://aaronnotes.com/2023/10/dockerizing-django-with-postgresql-postgis-and-geodjango-for-location-search/)

## Prerequisites (macOS)

```bash
brew install gdal geos proj postgresql
```

### Find the versions of the installed packages

```bash
brew info gdal
brew info geos
brew info proj
```

### Set the environment variables

```bash
export DATABASE_URL='<your-database-url>'
export GDAL_HOME=/opt/homebrew/Cellar/gdal/3.10.2
export GDAL_LIBRARY_PATH=${GDAL_HOME}/lib/libgdal.dylib
export GEOS_HOME=/opt/homebrew/Cellar/geos/3.13.0
export GEOS_LIBRARY_PATH=${GEOS_HOME}/lib/libgeos_c.dylib
export PROJ_HOME=/opt/homebrew/Cellar/proj/9.5.1
export PROJ_LIBRARY_PATH=${PROJ_HOME}/lib/libproj.dylib
export DYLD_LIBRARY_PATH=${GDAL_HOME}/lib:$DYLD_LIBRARY_PATH
export DYLD_LIBRARY_PATH=${GEOS_HOME}/lib:$DYLD_LIBRARY_PATH
export DYLD_LIBRARY_PATH=${PROJ_HOME}/lib:$DYLD_LIBRARY_PATH
```

## Submodules

```bash
git submodule init
git submodule update
```

## Django Setup 

```bash
python manage.py makemigrations geo_app
python manage.py migrate
```

## Run the server

```bash
python manage.py runserver
```

## Data Insertion

```bash
python manage.py insert_geo_data --type province --name Western --region-id LK-1 --data-file ../submodules/gig-data/geo/province/LK-1.json
```