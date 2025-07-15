import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Download, Bell, Calendar, MapPin, Edit } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { routeService } from '../services/api';
import MapComponent from './MapComponent';

const RouteViewer = ({ setCurrentView }) => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    loadRoute();
  }, [id]);

  const loadRoute = async () => {
    try {
      setLoading(true);
      const data = await routeService.getRoute(id);
      setRoute(data);
    } catch (err) {
      setError(t('errorLoadingRoutes'));
      console.error('Error loading route:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportingPDF(true);
      const pdfBlob = await routeService.exportPdf(id);
      
      // Criar URL para download
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rota_${route.nome.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      alert('Erro ao exportar PDF');
      console.error('Error exporting PDF:', err);
    } finally {
      setExportingPDF(false);
    }
  };

  const handleSendNotification = async () => {
    try {
      setSendingNotification(true);
      // A rota para enviar notificação deve ser ajustada para o serviço de notificação
      // await routeService.sendRouteNotification(id);
      alert(t('notificationSent'));
    } catch (err) {
      alert('Erro ao enviar notificação');
      console.error('Error sending notification:', err);
    } finally {
      setSendingNotification(false);
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

  const handleBack = () => {
    navigate('/routes');
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

  if (!route) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Rota não encontrada</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('back')}</span>
          </Button>
          <h2 className="text-3xl font-bold text-gray-800">{route.nome}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/create-route?edit=${route.id}`)}
            className="flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>{t('editRoute')}</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={exportingPDF}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{exportingPDF ? t('loading') : t('exportPDF')}</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleSendNotification}
            disabled={sendingNotification}
            className="flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>{sendingNotification ? t('loading') : t('sendNotification')}</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informações da Rota */}
        <div className="lg:col-span-1 space-y-6">
          {/* Detalhes Básicos */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Rota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Data de Início</p>
                  <p className="font-medium">{formatDate(route.data_inicio)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Pontos Turísticos</p>
                  <p className="font-medium">{route.pontos_turisticos?.length || 0} pontos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Pontos Turísticos */}
          <Card>
            <CardHeader>
              <CardTitle>Pontos Turísticos</CardTitle>
            </CardHeader>
            <CardContent>
              {route.pontos_turisticos && route.pontos_turisticos.length > 0 ? (
                <div className="space-y-3">
                  {route.pontos_turisticos.map((ponto, index) => (
                    <div key={ponto.id || index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Badge variant="outline" className="mt-1">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{ponto.nome}</h4>
                        <p className="text-sm text-gray-500 mt-1">{ponto.descricao}</p>
                        {ponto.localizacao && (
                          <p className="text-xs text-gray-400 mt-1">
                            {ponto.localizacao.latitude?.toFixed(4)}, {ponto.localizacao.longitude?.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Nenhum ponto turístico adicionado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mapa */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Mapa da Rota</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <MapComponent 
                spots={route.pontos_turisticos || []}
                showUserLocation={true}
                className="w-full h-full rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RouteViewer;


