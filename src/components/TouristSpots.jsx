import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { touristSpotService, geolocationService } from '../services/api';
import MapComponent from './MapComponent';

const TouristSpots = ({ setCurrentView }) => {
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  
  const { t } = useLanguage();

  useEffect(() => {
    const initializeComponent = async () => {
      console.log('🚀 Inicializando componente TouristSpots...');
      
      // Primeiro tenta obter a localização
      await getCurrentLocation();
      
      // Se não conseguiu a localização, carrega pontos sem filtro
      // (loadTouristSpots será chamado automaticamente em getCurrentLocation)
    };
    
    initializeComponent();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      filterSpots();
    }, 300); // Debounce de 300ms

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, spots]);

  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      setLocationError(null);
      console.log('🌍 Iniciando processo de geolocalização...');
      
      const position = await geolocationService.requestLocation();
      setUserLocation(position);
      console.log('✅ Localização obtida:', position);
      
      // Recarregar pontos turísticos com a nova localização
      loadTouristSpotsWithLocation(position);
      
    } catch (err) {
      console.error('❌ Erro ao obter localização:', err);
      setLocationError(err.message);
      
      // Carregar pontos sem filtro de localização
      loadTouristSpotsWithoutLocation();
    } finally {
      setLocationLoading(false);
      console.log('🏁 Processo de localização finalizado.');
    }
  };

  const loadTouristSpotsWithLocation = async (location) => {
    try {
      setLoading(true);
      console.log('🎯 Carregando pontos próximos à localização:', location);
      
      const data = await touristSpotService.getTouristSpots({
        lat: location.latitude,
        lng: location.longitude,
        radius: 50 // Busca pontos em um raio de 50km
      });
      
      setSpots(data);
      setFilteredSpots(data);
      console.log(`✅ ${data.length} pontos turísticos carregados com base na localização`);
    } catch (err) {
      setError(t('errorLoadingSpots'));
      console.error('❌ Erro ao carregar pontos com localização:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTouristSpotsWithoutLocation = async () => {
    try {
      setLoading(true);
      console.log('📍 Carregando todos os pontos turísticos (sem filtro de localização)');
      
      const data = await touristSpotService.getTouristSpots();
      setSpots(data);
      setFilteredSpots(data);
      console.log(`✅ ${data.length} pontos turísticos carregados`);
    } catch (err) {
      setError(t('errorLoadingSpots'));
      console.error('❌ Erro ao carregar pontos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTouristSpots = async () => {
    if (userLocation) {
      await loadTouristSpotsWithLocation(userLocation);
    } else {
      await loadTouristSpotsWithoutLocation();
    }
  };

  const filterSpots = async () => {
    if (!searchTerm.trim()) {
      setFilteredSpots(spots);
      return;
    }

    // Busca local primeiro
    const localFiltered = spots.filter(
      (spot) =>
        spot.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Se o termo tem 3+ caracteres, buscar externamente também
    if (searchTerm.length >= 3) {
      try {
        console.log('🔍 Buscando pontos externos para:', searchTerm);
        const externalResults = await touristSpotService.searchExternalSpots(searchTerm);
        
        // Filtrar resultados externos para evitar duplicatas
        const filteredExternal = externalResults.filter(extSpot => 
          !localFiltered.some(localSpot => 
            localSpot.nome.toLowerCase() === extSpot.nome.toLowerCase()
          )
        );

        const combinedResults = [...localFiltered, ...filteredExternal];
        setFilteredSpots(combinedResults);
        console.log(`🎯 Encontrados ${localFiltered.length} locais + ${filteredExternal.length} externos`);
      } catch (error) {
        console.error('❌ Erro na busca externa:', error);
        // Fallback para apenas resultados locais
        setFilteredSpots(localFiltered);
      }
    } else {
      setFilteredSpots(localFiltered);
    }
  };

  const handleSpotClick = (spot) => {
    setSelectedSpot(spot);
  };

  if (loading || locationLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            {t('allTouristSpots')}
          </h2>
          {/* Status da localização melhorado */}
          {userLocation && (
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-600">
                Mostrando pontos próximos à sua localização
              </p>
            </div>
          )}
          {locationError && (
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="h-4 w-4 text-orange-600" />
              <p className="text-sm text-orange-600">
                Localização não disponível - mostrando todos os pontos
              </p>
              <button
                onClick={getCurrentLocation}
                className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
                disabled={locationLoading}
              >
                {locationLoading ? '⏳ Obtendo...' : '🔄 Permitir localização'}
              </button>
            </div>
          )}
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {filteredSpots.length} pontos
        </Badge>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar pontos turísticos... (ex: Cristo Redentor, Pão de Açúcar)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchTerm.length >= 3 && (
          <p className="text-xs text-gray-500 max-w-md">
            🌐 Buscando também em fontes externas (OpenStreetMap)...
          </p>
        )}
        {searchTerm.length > 0 && searchTerm.length < 3 && (
          <p className="text-xs text-gray-400 max-w-md">
            💡 Digite pelo menos 3 caracteres para busca externa
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lista de Pontos */}
        <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto">
          {filteredSpots.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">{t('noSpotsFound')}</p>
            </div>
          ) : (
            filteredSpots.map((spot) => {
              const isExternal = spot.source === 'nominatim' || (spot.id && spot.id.toString().startsWith('ext_'));
              
              return (
              <Card
                key={spot.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedSpot?.id === spot.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleSpotClick(spot)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Imagem */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {spot.imagem_url ? (
                        <img
                          src={spot.imagem_url}
                          alt={spot.nome}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      {/* Indicador de ponto externo */}
                      {isExternal && (
                        <div className="absolute top-1 right-1">
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            🌐
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1 truncate flex items-center space-x-2">
                        <span>{spot.nome}</span>
                        {isExternal && (
                          <Badge variant="outline" className="text-xs">
                            Externo
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-3 mb-2">
                        {spot.descricao}
                      </p>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {spot.localizacao?.latitude?.toFixed(4)},{' '}
                          {spot.localizacao?.longitude?.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })
          )}
        </div>

        {/* Mapa */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>
                {selectedSpot
                  ? `Localização: ${selectedSpot.nome}`
                  : 'Mapa dos Pontos Turísticos'}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              {locationError ? (
                <div className="flex items-center justify-center h-full text-red-600 text-center p-4">
                  Não foi possível carregar o mapa: {locationError}. Por favor, permita o acesso à sua localização.
                </div>
              ) : (
                <MapComponent
                  spots={selectedSpot ? [selectedSpot] : filteredSpots}
                  showUserLocation={true}
                  userLocation={userLocation}
                  selectedSpot={selectedSpot}
                  className="w-full h-full rounded-lg"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detalhes do Ponto Selecionado */}
      {selectedSpot && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>{selectedSpot.nome}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Imagem */}
              {selectedSpot.imagem_url && (
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={selectedSpot.imagem_url}
                    alt={selectedSpot.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Informações */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                  <p className="text-gray-600">{selectedSpot.descricao}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Localização</h4>
                  <p className="text-gray-600">
                    Latitude: {selectedSpot.localizacao?.latitude?.toFixed(6)}
                  </p>
                  <p className="text-gray-600">
                    Longitude: {selectedSpot.localizacao?.longitude?.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TouristSpots;


