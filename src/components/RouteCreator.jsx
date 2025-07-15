import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Save, ArrowLeft, MapPin, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { routeService, touristSpotService } from '../services/api';
import TouristSpotSelector from './TouristSpotSelector';

const RouteCreator = ({ setCurrentView }) => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;
  
  const [formData, setFormData] = useState({
    nome: '',
    data_inicio: '',
    pontos_turisticos: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSpotSelector, setShowSpotSelector] = useState(false);
  
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isEditing) {
      loadRouteForEdit();
    }
  }, [editId]);

  const loadRouteForEdit = async () => {
    try {
      setLoading(true);
      const route = await routeService.getRoute(editId);
      
      // Converter data para formato datetime-local
      const dataInicio = new Date(route.data_inicio);
      const formattedDate = dataInicio.toISOString().slice(0, 16);
      
      setFormData({
        nome: route.nome,
        data_inicio: formattedDate,
        pontos_turisticos: route.pontos_turisticos || []
      });
    } catch (err) {
      setError(t('errorLoadingRoutes'));
      console.error('Error loading route for edit:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSpot = (spot) => {
    if (formData.pontos_turisticos.length >= 5) {
      alert(t('maxSpots'));
      return;
    }
    
    // Verificar se o ponto já foi adicionado
    const alreadyAdded = formData.pontos_turisticos.some(p => p.id === spot.id);
    if (alreadyAdded) {
      alert('Este ponto turístico já foi adicionado à rota');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      pontos_turisticos: [...prev.pontos_turisticos, spot]
    }));
  };

  const handleRemoveSpot = (spotId) => {
    setFormData(prev => ({
      ...prev,
      pontos_turisticos: prev.pontos_turisticos.filter(p => p.id !== spotId)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      alert('Nome da rota é obrigatório');
      return;
    }
    
    if (!formData.data_inicio) {
      alert('Data de início é obrigatória');
      return;
    }
    
    if (formData.pontos_turisticos.length === 0) {
      alert('Selecione pelo menos um ponto turístico');
      return;
    }

    try {
      setLoading(true);
      
      const routeData = {
        nome: formData.nome,
        data_inicio: new Date(formData.data_inicio).toISOString(),
        pontos_turisticos: formData.pontos_turisticos,
        user_id: 1 // Default user para MVP
      };

      if (isEditing) {
        await routeService.updateRoute(editId, routeData);
      } else {
        await routeService.createRoute(routeData);
      }
      
      navigate('/routes');
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || (isEditing ? t('errorUpdatingRoute') : t('errorCreatingRoute'));
      setError(errorMessage);
      console.error('Error saving route:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/routes');
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('back')}</span>
        </Button>
        <h2 className="text-3xl font-bold text-gray-800">
          {isEditing ? t('editingRoute') : t('newRoute')}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Rota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome">{t('routeName')}</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder={t('routeNamePlaceholder')}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="data_inicio">{t('startDateTime')}</Label>
              <Input
                id="data_inicio"
                name="data_inicio"
                type="datetime-local"
                value={formData.data_inicio}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Pontos Turísticos Selecionados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('selectedSpots')} ({formData.pontos_turisticos.length}/5)</span>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSpotSelector(true)}
                className="flex items-center space-x-2"
              >
                <MapPin className="h-4 w-4" />
                <span>{t('selectSpots')}</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.pontos_turisticos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Nenhum ponto turístico selecionado</p>
                <p className="text-sm">{t('maxSpots')}</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {formData.pontos_turisticos.map((spot, index) => (
                  <div key={spot.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div className="flex-1">
                      <h4 className="font-medium">{spot.nome}</h4>
                      <p className="text-sm text-gray-500 truncate">{spot.descricao}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSpot(spot.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex space-x-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? t('loading') : t('saveRoute')}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            {t('cancel')}
          </Button>
        </div>
      </form>

      {/* Modal de Seleção de Pontos Turísticos */}
      {showSpotSelector && (
        <TouristSpotSelector
          onSelectSpot={handleAddSpot}
          onClose={() => setShowSpotSelector(false)}
          selectedSpots={formData.pontos_turisticos}
        />
      )}
    </div>
  );
};

export default RouteCreator;


