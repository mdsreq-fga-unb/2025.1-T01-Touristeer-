import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, MapPin, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { routeService } from '../services/api';

const RouteList = ({ setCurrentView }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await routeService.getRoutes();
      setRoutes(data);
    } catch (err) {
      setError(t('errorLoadingRoutes'));
      console.error('Error loading routes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (window.confirm('Tem certeza que deseja excluir esta rota?')) {
      try {
        await routeService.deleteRoute(routeId);
        setRoutes(routes.filter(route => route.id !== routeId));
        // Aqui você pode adicionar uma notificação de sucesso
      } catch (err) {
        setError(t('errorDeletingRoute'));
        console.error('Error deleting route:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
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
        <h2 className="text-3xl font-bold text-gray-800">{t('myRoutes')}</h2>
        <Button
          onClick={() => navigate('/create-route')}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{t('createRoute')}</span>
        </Button>
      </div>

      {/* Lista de Rotas */}
      {routes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {t('noRoutes')}
            </h3>
            <p className="text-gray-500 mb-6">
              {t('createFirstRoute')}
            </p>
            <Button
              onClick={() => navigate('/create-route')}
              className="flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              <span>{t('createRoute')}</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <Card key={route.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{route.nome}</span>
                  <Badge variant="secondary">
                    {route.pontos_turisticos?.length || 0} {t('spots')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Data de Início */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(route.data_inicio)}</span>
                </div>

                {/* Pontos Turísticos */}
                {route.pontos_turisticos && route.pontos_turisticos.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Pontos incluídos:</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {route.pontos_turisticos.slice(0, 2).map((ponto, index) => (
                        <div key={index}>• {ponto.nome}</div>
                      ))}
                      {route.pontos_turisticos.length > 2 && (
                        <div>• +{route.pontos_turisticos.length - 2} mais...</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/route/${route.id}`)}
                    className="flex-1 flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>{t('viewRoute')}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/create-route?edit=${route.id}`)}
                    className="flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRoute(route.id)}
                    className="flex items-center justify-center text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RouteList;


