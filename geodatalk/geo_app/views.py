from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from django.shortcuts import get_object_or_404
from .models import GeoPolygon
from .serializers import GeoPolygonSerializer

# Create your views here.

@api_view(['GET'])
def api_root(request, format=None):
    """
    API root showing all available endpoints
    """
    return Response({
        'regions_list': reverse('region-list', request=request, format=format),
        'region_by_id': reverse('region-detail', args=['LK-1'], request=request, format=format),
        'regions_by_type': reverse('region-list', request=request, format=format) + '?type=provincial',
    })

class GeoPolygonViewSet(viewsets.ViewSet):
    def list(self, request):
        """Get all regions or filter by type"""
        region_type = request.query_params.get('type', None)
        if region_type:
            queryset = GeoPolygon.objects.filter(type=region_type)
        else:
            queryset = GeoPolygon.objects.all()
        serializer = GeoPolygonSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Get a specific region by ID"""
        queryset = GeoPolygon.objects.all()
        region = get_object_or_404(queryset, region_id=pk)
        serializer = GeoPolygonSerializer(region)
        return Response(serializer.data)
