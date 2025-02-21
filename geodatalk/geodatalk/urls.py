"""
URL configuration for geodatalk project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from graphene_django.views import GraphQLView
from graphql_playground.views import GraphQLPlaygroundView
from django.views.decorators.csrf import csrf_exempt
from geo_app.views import GeoPolygonViewSet, api_root

schema_view = get_schema_view(
    openapi.Info(
        title="GeoData API",
        default_version='v1',
        description="API for geographic data visualization",
        terms_of_service="https://www.yourapp.com/terms/",
        contact=openapi.Contact(email="contact@yourapp.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api-root'),
    path('api/v1/regions/', GeoPolygonViewSet.as_view({
        'get': 'list',
        'post': 'create'
    }), name='region-list'),
    path('api/v1/regions/<str:region_id>/', GeoPolygonViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='region-detail'),
    
    # Authentication URLs
    path('api-auth/', include('rest_framework.urls')),
    
    # GraphQL URLs
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    path('playground/', GraphQLPlaygroundView.as_view(endpoint='/graphql/')),
    
    # API documentation URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
