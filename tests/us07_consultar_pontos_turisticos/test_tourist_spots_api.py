"""
Testes de API para US07 - Consultar pontos turísticos
Valida os endpoints de pontos turísticos
"""
import pytest
import json


class TestUS07ConsultarPontosTuristicos:
    """Testes para consulta de pontos turísticos"""
    
    def test_listar_pontos_turisticos(self, client):
        """
        Teste US07: Listar todos os pontos turísticos
        
        Endpoint: GET /api/tourist-spots
        Critérios:
        - Deve retornar lista de pontos
        - Cada ponto deve ter estrutura correta
        - Deve incluir coordenadas geográficas
        """
        # Act
        response = client.get('/api/tourist-spots')
        
        # Assert
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert isinstance(data, list)
        
        # Verificar estrutura dos pontos (se houver)
        if len(data) > 0:
            ponto = data[0]
            assert 'id' in ponto
            assert 'nome' in ponto
            assert 'localizacao' in ponto
            assert 'latitude' in ponto['localizacao']
            assert 'longitude' in ponto['localizacao']
            
    def test_buscar_ponto_turistico_especifico(self, client):
        """
        Teste US07: Consultar ponto turístico por ID
        
        Endpoint: GET /api/tourist-spots/{id}
        Critério: Deve retornar dados detalhados do ponto
        """
        # Arrange - Primeiro listar para pegar um ID válido
        response_lista = client.get('/api/tourist-spots')
        lista_pontos = json.loads(response_lista.data)
        
        if len(lista_pontos) > 0:
            # Act
            ponto_id = lista_pontos[0]['id']
            response = client.get(f'/api/tourist-spots/{ponto_id}')
            
            # Assert
            assert response.status_code == 200
            
            data = json.loads(response.data)
            assert data['id'] == ponto_id
            assert 'nome' in data
            assert 'localizacao' in data
        else:
            pytest.skip("Nenhum ponto turístico disponível para teste")
            
    def test_buscar_ponto_inexistente(self, client):
        """
        Teste US07: Buscar ponto turístico inexistente
        
        Critério: Deve retornar erro 404
        """
        # Act
        response = client.get('/api/tourist-spots/999999')
        
        # Assert
        assert response.status_code == 404
        
        data = json.loads(response.data)
        assert 'error' in data
        
    def test_filtrar_pontos_por_nome(self, client):
        """
        Teste US07: Filtrar pontos turísticos por nome
        
        Endpoint: GET /api/tourist-spots?search=termo
        Critério: Deve retornar apenas pontos que contenham o termo
        """
        # Act
        response = client.get('/api/tourist-spots?search=cristo')
        
        # Assert
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert isinstance(data, list)
        
        # Verificar se os resultados contêm o termo buscado
        for ponto in data:
            assert 'cristo' in ponto['nome'].lower()
            
    def test_filtrar_pontos_por_proximidade(self, client):
        """
        Teste US07: Filtrar pontos por proximidade geográfica
        
        Endpoint: GET /api/tourist-spots?lat={lat}&lng={lng}&radius={km}
        Critério: Deve retornar pontos dentro do raio especificado
        """
        # Arrange - Coordenadas do Rio de Janeiro
        lat_rio = -22.9068
        lng_rio = -43.1729
        raio = 50  # 50 km
        
        # Act
        response = client.get(f'/api/tourist-spots?lat={lat_rio}&lng={lng_rio}&radius={raio}')
        
        # Assert
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert isinstance(data, list)
        
        # Verificar se pontos têm campo distance quando filtrados por proximidade
        for ponto in data:
            if 'distance' in ponto:
                assert ponto['distance'] <= raio
                
    def test_buscar_lugares_externos(self, client):
        """
        Teste US07: Buscar pontos turísticos via API externa
        
        Endpoint: GET /api/search-places?q=termo
        Critério: Deve retornar resultados de API externa + locais
        """
        # Act
        response = client.get('/api/search-places?q=museu')
        
        # Assert
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert isinstance(data, list)
        
        # Verificar estrutura dos resultados
        for lugar in data:
            assert 'nome' in lugar
            assert 'localizacao' in lugar
            # Pode ser local ou externo
            assert 'latitude' in lugar['localizacao']
            assert 'longitude' in lugar['localizacao']
            
    def test_buscar_lugares_sem_termo(self, client):
        """
        Teste US07: Buscar lugares sem termo de busca
        
        Critério: Deve retornar erro 400
        """
        # Act
        response = client.get('/api/search-places')
        
        # Assert
        assert response.status_code == 400
        
        data = json.loads(response.data)
        assert 'error' in data
        assert 'obrigatório' in data['error'].lower()
        
    def test_formato_resposta_pontos_turisticos(self, client):
        """
        Teste US07: Verificar formato padronizado das respostas
        
        Critério: Todas as respostas devem seguir o mesmo formato
        """
        # Act
        response = client.get('/api/tourist-spots')
        
        # Assert
        assert response.status_code == 200
        assert response.content_type == 'application/json'
        
        data = json.loads(response.data)
        
        # Verificar campos obrigatórios
        for ponto in data:
            campos_obrigatorios = ['id', 'nome', 'localizacao']
            for campo in campos_obrigatorios:
                assert campo in ponto, f"Campo {campo} não encontrado"
                
            # Verificar tipos de dados
            assert isinstance(ponto['id'], (int, str))
            assert isinstance(ponto['nome'], str)
            assert isinstance(ponto['localizacao'], dict)
            assert isinstance(ponto['localizacao']['latitude'], (int, float))
            assert isinstance(ponto['localizacao']['longitude'], (int, float))
