import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone personalizado para localização do usuário
const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-navigation">
      <polygon points="3,11 22,2 13,21 11,13 3,11" fill="#3b82f6" stroke="#1e40af"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

// Ícone personalizado para pontos turísticos selecionados
const selectedSpotIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
      <path d="M20 10c0 6-10 12-10 12s-10-6-10-12a10 10 0 0 1 20 0Z" fill="#ef4444" stroke="#dc2626"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Componente para ajustar a visualização do mapa
const MapBounds = ({ spots, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (spots.length === 0 && !userLocation) return;

    const bounds = L.latLngBounds();
    
    // Adicionar pontos turísticos aos bounds
    spots.forEach(spot => {
      if (spot.localizacao) {
        bounds.extend([spot.localizacao.latitude, spot.localizacao.longitude]);
      }
    });

    // Adicionar localização do usuário aos bounds
    if (userLocation) {
      bounds.extend([userLocation.latitude, userLocation.longitude]);
    }

    // Ajustar visualização se houver pontos
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [spots, userLocation, map]);

  return null;
};

const MapComponent = ({
  spots = [],
  showUserLocation = false,
  selectedSpot = null,
  className = "w-full h-96",
  userLocation = null,
  locationError = null // Recebendo locationError como prop
}) => {
  // Centro padrão (Rio de Janeiro)
  const defaultCenter = [-22.9068, -43.1729];
  const defaultZoom = 11;

  // Determinar centro e zoom do mapa
  const getMapCenter = () => {
    if (selectedSpot && selectedSpot.localizacao) {
      return [selectedSpot.localizacao.latitude, selectedSpot.localizacao.longitude];
    }
    
    if (spots.length === 1 && spots[0].localizacao) {
      return [spots[0].localizacao.latitude, spots[0].localizacao.longitude];
    }
    
    if (userLocation) {
      return [userLocation.latitude, userLocation.longitude];
    }
    
    return defaultCenter;
  };

  const getMapZoom = () => {
    if (selectedSpot || spots.length === 1) {
      return 15;
    }
    
    if (userLocation && spots.length === 0) {
      return 13;
    }
    
    return defaultZoom;
  };

  // Criar linha conectando os pontos da rota
  const getRoutePolyline = () => {
    if (spots.length < 2) return null;
    
    const coordinates = spots
      .filter(spot => spot.localizacao)
      .map(spot => [spot.localizacao.latitude, spot.localizacao.longitude]);
    
    return coordinates.length >= 2 ? coordinates : null;
  };

  return (
    <div className={className}>
      <MapContainer
        center={getMapCenter()}
        zoom={getMapZoom()}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ajustar bounds automaticamente */}
        <MapBounds spots={spots} userLocation={userLocation} />

        {/* Marcadores dos pontos turísticos */}
        {spots.map((spot, index) => {
          if (!spot.localizacao) return null;
          
          const isSelected = selectedSpot && selectedSpot.id === spot.id;
          const icon = isSelected ? selectedSpotIcon : undefined;
          
          return (
            <Marker
              key={spot.id || index}
              position={[spot.localizacao.latitude, spot.localizacao.longitude]}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-medium text-gray-900 mb-1">{spot.nome}</h4>
                  {spot.descricao && (
                    <p className="text-sm text-gray-600 mb-2">{spot.descricao}</p>
                  )}
                  {spot.imagem_url && (
                    <img
                      src={spot.imagem_url}
                      alt={spot.nome}
                      className="w-32 h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Marcador da localização do usuário */}
        {showUserLocation && userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-medium text-blue-600 mb-1">Sua Localização</h4>
                <p className="text-sm text-gray-600">
                  Precisão: {userLocation.accuracy?.toFixed(0)}m
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Linha da rota */}
        {getRoutePolyline() && (
          <Polyline
            positions={getRoutePolyline()}
            color="#3b82f6"
            weight={3}
            opacity={0.7}
            dashArray="5, 10"
          />
        )}
      </MapContainer>

      {/* Erro de geolocalização */}
      {showUserLocation && locationError && (
        <div className="absolute top-2 left-2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
          Não foi possível obter sua localização: {locationError}
        </div>
      )}
    </div>
  );
};

export default MapComponent;


