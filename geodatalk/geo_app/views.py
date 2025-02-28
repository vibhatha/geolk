from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.reverse import reverse
from django.shortcuts import get_object_or_404
from geo_app.models import GeoPolygon, Topology
from geo_app.serializers import GeoPolygonSerializer, TopologySerializer
from geo_app.permissions import IsAuthenticatedForWriteOnly
from rest_framework.permissions import AllowAny

# Create your views here.

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    """
    API root showing all available endpoints
    """
    return Response({
        'regions_list': reverse('region-list', request=request, format=format),
        'region_by_id': reverse('region-detail', args=['LK-1'], request=request, format=format),
        'regions_by_type': reverse('region-list', request=request, format=format) + '?type=provincial',
        'topology_list': reverse('topology-list', request=request, format=format),
        'topology_by_id': reverse('topology-detail', args=['LK-1'], request=request, format=format),
        'topology_by_type': reverse('topology-list', request=request, format=format) + '?type=provincial',
    })

class GeoPolygonViewSet(viewsets.ModelViewSet):
    queryset = GeoPolygon.objects.all()
    serializer_class = GeoPolygonSerializer
    permission_classes = [IsAuthenticatedForWriteOnly]
    lookup_field = 'region_id'

    def get_queryset(self):
        queryset = GeoPolygon.objects.all()
        region_type = self.request.query_params.get('type', None)
        if region_type is not None:
            queryset = queryset.filter(type=region_type)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, region_id=None, *args, **kwargs):
        """Get a specific region by ID"""
        queryset = GeoPolygon.objects.all()
        region = get_object_or_404(queryset, region_id=region_id)
        serializer = GeoPolygonSerializer(region)
        return Response(serializer.data)

class TopologyViewSet(viewsets.ModelViewSet):
    queryset = Topology.objects.all()
    serializer_class = TopologySerializer
    permission_classes = [IsAuthenticatedForWriteOnly]
    lookup_field = 'region_id'

    def get_queryset(self):
        queryset = Topology.objects.all()
        region_type = self.request.query_params.get('type', None)
        if region_type is not None:
            queryset = queryset.filter(type=region_type)
        return queryset

    def retrieve(self, request, region_id=None, *args, **kwargs):
        """Get a specific region's topology by ID"""
        queryset = Topology.objects.all()
        topology = get_object_or_404(queryset, region_id=region_id)
        serializer = TopologySerializer(topology)
        return Response(serializer.data)


