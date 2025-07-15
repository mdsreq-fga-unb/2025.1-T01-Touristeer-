"""
Testes de integração para funcionalidades de geolocalização
Funcionalidade testada: US17 (Obter localização atual)
"""
import pytest
import json
from unittest.mock import patch, MagicMock


class TestGeolocationIntegration:
    """Testes para integração com APIs de geolocalização"""
    
    def test_obter_localizacao_atual_sucesso(self, client, mock_geolocation_data):
        """
        Teste US17: Obter localização atual com sucesso
        """
        # Arrange
        with patch('src.services.geolocation.get_current_location') as mock_geo:
            mock_geo.return_value = mock_geolocation_data
            
            # Act
            response = client.get('/api/geolocation/current')
            
            # Assert
            assert response.status_code == 200
            
            data = json.loads(response.data)
            assert 'latitude' in data
            assert 'longitude' in data
            assert 'accuracy' in data
            assert data['latitude'] == mock_geolocation_data['latitude']
            assert data['longitude'] == mock_geolocation_data['longitude']
    
    def test_calcular_distancia_entre_pontos(self, client):
        """
        Teste US17: Calcular distância entre dois pontos geográficos
        """
        # Arrange
        ponto_origem = {
            "latitude": -22.951916,  # Cristo Redentor
            "longitude": -43.210487
        }
        ponto_destino = {
            "latitude": -22.948658,  # Pão de Açúcar
            "longitude": -43.157444
        }
        
        dados_requisicao = {
            "origem": ponto_origem,
            "destino": ponto_destino
        }
        
        # Act
        response = client.post('/api/geolocation/distance',
                             data=json.dumps(dados_requisicao),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert 'distance_km' in data
        assert 'distance_m' in data
        assert isinstance(data['distance_km'], (int, float))
        assert data['distance_km'] > 0
        assert data['distance_m'] == data['distance_km'] * 1000
    
    def test_buscar_pontos_por_proximidade(self, client):
        """
        Teste US17 + US07: Buscar pontos turísticos próximos à localização atual
        """
        # Arrange
        localizacao_atual = {
            "latitude": -22.908333,  # Centro do Rio
            "longitude": -43.196388
        }
        raio_busca = 10  # 10km
        
        # Act
        response = client.get(f'/api/tourist-spots?lat={localizacao_atual["latitude"]}&lng={localizacao_atual["longitude"]}&radius={raio_busca}')
        
        # Assert
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert isinstance(data, list)
        
        # Verificar se todos os pontos retornados estão dentro do raio
        for ponto in data:
            if 'distance' in ponto:
                assert ponto['distance'] <= raio_busca
    
    def test_validar_coordenadas_invalidas(self, client):
        """
        Teste US17: Validação de coordenadas inválidas
        """
        # Arrange - Coordenadas inválidas
        coordenadas_invalidas = [
            {"latitude": 91, "longitude": 0},      # Latitude > 90
            {"latitude": -91, "longitude": 0},     # Latitude < -90
            {"latitude": 0, "longitude": 181},     # Longitude > 180
            {"latitude": 0, "longitude": -181},    # Longitude < -180
        ]
        
        for coordenada in coordenadas_invalidas:
            # Act
            response = client.post('/api/geolocation/validate',
                                 data=json.dumps(coordenada),
                                 content_type='application/json')
            
            # Assert
            assert response.status_code == 400
            data = json.loads(response.data)
            assert 'error' in data
    
    def test_obter_endereco_por_coordenadas(self, client):
        """
        Teste US17: Geocodificação reversa - obter endereço por coordenadas
        """
        # Arrange
        coordenadas = {
            "latitude": -22.951916,  # Cristo Redentor
            "longitude": -43.210487
        }
        
        with patch('requests.get') as mock_request:
            mock_response = MagicMock()
            mock_response.json.return_value = {
                "display_name": "Corcovado, Rio de Janeiro, RJ, Brasil",
                "address": {
                    "city": "Rio de Janeiro",
                    "state": "Rio de Janeiro",
                    "country": "Brasil"
                }
            }
            mock_response.status_code = 200
            mock_request.return_value = mock_response
            
            # Act
            response = client.post('/api/geolocation/reverse-geocode',
                                 data=json.dumps(coordenadas),
                                 content_type='application/json')
            
            # Assert
            assert response.status_code == 200
            
            data = json.loads(response.data)
            assert 'address' in data
            assert 'city' in data['address']
    
    def test_calcular_tempo_viagem_entre_pontos(self, client):
        """
        Teste US17: Calcular tempo estimado de viagem entre pontos
        """
        # Arrange
        pontos_rota = [
            {"latitude": -22.951916, "longitude": -43.210487},  # Cristo Redentor
            {"latitude": -22.948658, "longitude": -43.157444},  # Pão de Açúcar
            {"latitude": -22.971177, "longitude": -43.182543}   # Copacabana
        ]
        
        dados_requisicao = {
            "pontos": pontos_rota,
            "meio_transporte": "driving"  # driving, walking, cycling
        }
        
        # Act
        response = client.post('/api/geolocation/travel-time',
                             data=json.dumps(dados_requisicao),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert 'total_time_minutes' in data
        assert 'segments' in data
        assert isinstance(data['segments'], list)
        assert len(data['segments']) == len(pontos_rota) - 1
    
    def test_deteccao_localizacao_usuario_navegador(self, client):
        """
        Teste US17: Simular detecção de localização via navegador
        """
        # Este teste simula o que aconteceria no frontend
        # quando o usuário permite acesso à localização
        
        # Arrange
        localizacao_simulada = {
            "coords": {
                "latitude": -22.908333,
                "longitude": -43.196388,
                "accuracy": 10,
                "altitude": None,
                "altitudeAccuracy": None,
                "heading": None,
                "speed": None
            },
            "timestamp": 1626789600000
        }
        
        # Act
        response = client.post('/api/geolocation/browser-location',
                             data=json.dumps(localizacao_simulada),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert 'received' in data
        assert data['received'] == True
    
    def test_tratamento_erro_localizacao_negada(self, client):
        """
        Teste US17: Tratamento quando usuário nega acesso à localização
        """
        # Arrange
        erro_localizacao = {
            "error": {
                "code": 1,  # PERMISSION_DENIED
                "message": "User denied Geolocation"
            }
        }
        
        # Act
        response = client.post('/api/geolocation/location-error',
                             data=json.dumps(erro_localizacao),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 403
        
        data = json.loads(response.data)
        assert 'error' in data
        assert 'permission' in data['error'].lower()
    
    def test_cache_localizacao_recente(self, client):
        """
        Teste US17: Cache de localização recente para evitar múltiplas solicitações
        """
        # Arrange
        localizacao = {
            "latitude": -22.908333,
            "longitude": -43.196388,
            "timestamp": "2025-07-14T10:00:00Z"
        }
        
        # Act - Primeira solicitação
        response1 = client.post('/api/geolocation/cache-location',
                              data=json.dumps(localizacao),
                              content_type='application/json')
        
        # Act - Segunda solicitação (deve usar cache)
        response2 = client.get('/api/geolocation/cached-location')
        
        # Assert
        assert response1.status_code == 200
        assert response2.status_code == 200
        
        cached_data = json.loads(response2.data)
        assert cached_data['latitude'] == localizacao['latitude']
        assert cached_data['longitude'] == localizacao['longitude']
        assert 'cached' in cached_data
        assert cached_data['cached'] == True
    
    def test_precisao_localizacao_adequada(self, client):
        """
        Teste US17: Verificar se a precisão da localização é adequada
        """
        # Arrange
        localizacoes_precisao = [
            {"latitude": -22.908333, "longitude": -43.196388, "accuracy": 5},    # Boa precisão
            {"latitude": -22.908333, "longitude": -43.196388, "accuracy": 50},   # Precisão média
            {"latitude": -22.908333, "longitude": -43.196388, "accuracy": 1000}, # Baixa precisão
        ]
        
        for loc in localizacoes_precisao:
            # Act
            response = client.post('/api/geolocation/check-accuracy',
                                 data=json.dumps(loc),
                                 content_type='application/json')
            
            # Assert
            assert response.status_code == 200
            
            data = json.loads(response.data)
            assert 'accuracy_level' in data
            
            if loc['accuracy'] <= 10:
                assert data['accuracy_level'] == 'high'
            elif loc['accuracy'] <= 100:
                assert data['accuracy_level'] == 'medium'
            else:
                assert data['accuracy_level'] == 'low'
