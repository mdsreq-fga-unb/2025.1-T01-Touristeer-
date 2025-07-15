import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { X, Search, MapPin, Plus, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { touristSpotService } from '../services/api';

const TouristSpotSelector = ({ onSelectSpot, onClose, selectedSpots = [] }) => {
  const [spots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    loadTouristSpots();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      filterSpots();
    }, 300); // Debounce de 300ms para evitar muitas requisições

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, spots]);

  const loadTouristSpots = async () => {
    try {
      setLoading(true);
      const data = await touristSpotService.getTouristSpots();
      setSpots(data);
      setFilteredSpots(data);
    } catch (err) {
      setError(t('errorLoadingSpots'));
      console.error('Error loading tourist spots:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterSpots = async () => {
    if (!searchTerm.trim()) {
      setFilteredSpots(spots);
      return;
    }

    // Busca local primeiro
    const localFiltered = spots.filter(spot =>
      spot.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Se o termo de busca tem 3+ caracteres, buscar externamente também
    if (searchTerm.length >= 3) {
      try {
        console.log('Buscando pontos externos para:', searchTerm);
        const externalResults = await touristSpotService.searchExternalSpots(searchTerm);
        
        // Filtrar resultados externos para evitar duplicatas
        const filteredExternal = externalResults.filter(extSpot => 
          !localFiltered.some(localSpot => 
            localSpot.nome.toLowerCase() === extSpot.nome.toLowerCase()
          )
        );

        const combinedResults = [...localFiltered, ...filteredExternal];
        setFilteredSpots(combinedResults);
        console.log(`Encontrados ${localFiltered.length} locais + ${filteredExternal.length} externos`);
      } catch (error) {
        console.error('Erro na busca externa:', error);
        // Fallback para apenas resultados locais
        setFilteredSpots(localFiltered);
      }
    } else {
      setFilteredSpots(localFiltered);
    }
  };

  const isSpotSelected = (spotId) => {
    return selectedSpots.some(spot => spot.id === spotId);
  };

  const handleSelectSpot = (spot) => {
    if (!isSpotSelected(spot.id)) {
      onSelectSpot(spot);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold">{t('selectSpots')}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar pontos turísticos para adicionar à rota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm.length >= 3 && (
              <p className="text-xs text-gray-500">
                🌐 Incluindo resultados externos (OpenStreetMap)
              </p>
            )}
            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <p className="text-xs text-gray-400">
                💡 Digite pelo menos 3 caracteres para busca ampliada
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg text-gray-600">{t('loading')}</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg text-red-600">{error}</div>
            </div>
          ) : filteredSpots.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">{t('noSpotsFound')}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredSpots.map((spot) => {
                const isSelected = isSpotSelected(spot.id);
                const isExternal = spot.source === 'nominatim' || (spot.id && spot.id.toString().startsWith('ext_'));
                
                return (
                  <Card 
                    key={spot.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectSpot(spot)}
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
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 truncate flex items-center space-x-2">
                              <span>{spot.nome}</span>
                              {isExternal && (
                                <Badge variant="outline" className="text-xs">
                                  Externo
                                </Badge>
                              )}
                            </h4>
                            {isSelected ? (
                              <Badge variant="default" className="flex items-center space-x-1">
                                <Check className="h-3 w-3" />
                                <span>Selecionado</span>
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center space-x-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectSpot(spot);
                                }}
                              >
                                <Plus className="h-3 w-3" />
                                <span>Adicionar</span>
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {spot.descricao}
                          </p>
                          <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {spot.localizacao?.latitude?.toFixed(4)}, {spot.localizacao?.longitude?.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedSpots.length} de 5 pontos selecionados
            </div>
            <Button onClick={onClose}>
              Concluir Seleção
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristSpotSelector;

