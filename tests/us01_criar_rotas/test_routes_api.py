"""
Testes de API para US01 - Criar rotas turísticas
Valida o endpoint POST /api/routes
"""
import pytest
import json
from datetime import datetime


class TestUS01CriarRotasAPI:
    """Testes de API para criação de rotas turísticas"""
    
    def test_criar_rota_via_api(self, client, sample_route_data):
        """
        Teste US01: Criar rota turística via API
        
        Endpoint: POST /api/routes
        Critérios:
        - Deve retornar status 201
        - Deve retornar dados da rota criada
        - Deve incluir ID gerado automaticamente
        """
        # Act
        response = client.post('/api/routes',
                             data=json.dumps(sample_route_data),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 201
        
        data = json.loads(response.data)
        assert data['nome'] == sample_route_data['nome']
        assert data['user_id'] == sample_route_data['user_id']
        assert len(data['pontos_turisticos']) == 2
        assert 'id' in data
        assert 'created_at' in data
        
    def test_criar_rota_sem_nome(self, client):
        """
        Teste US01: Validação - rota sem nome deve falhar
        
        Critério: Nome é campo obrigatório
        """
        # Arrange
        dados_invalidos = {
            "data_inicio": "2025-08-15T09:00:00",
            "pontos_turisticos": [],
            "user_id": 1
        }
        
        # Act
        response = client.post('/api/routes',
                             data=json.dumps(dados_invalidos),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'Nome da rota é obrigatório' in data['error']
        
    def test_criar_rota_sem_data_inicio(self, client):
        """
        Teste US01: Validação - rota sem data de início deve falhar
        
        Critério: Data de início é obrigatória
        """
        # Arrange
        dados_invalidos = {
            "nome": "Rota Teste",
            "pontos_turisticos": [],
            "user_id": 1
        }
        
        # Act
        response = client.post('/api/routes',
                             data=json.dumps(dados_invalidos),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'Data de início é obrigatória' in data['error']
        
    def test_criar_rota_muitos_pontos(self, client):
        """
        Teste US01: Validação - máximo de pontos turísticos
        
        Critério: Limite de pontos por rota para performance
        """
        # Arrange - Criar rota com muitos pontos
        pontos_excessivos = [
            {"id": i, "nome": f"Ponto {i}", "latitude": -22.9, "longitude": -43.2}
            for i in range(1, 21)  # 20 pontos (muito para uma rota)
        ]
        
        dados_muitos_pontos = {
            "nome": "Rota com Muitos Pontos",
            "data_inicio": "2025-08-15T09:00:00",
            "pontos_turisticos": pontos_excessivos,
            "user_id": 1
        }
        
        # Act
        response = client.post('/api/routes',
                             data=json.dumps(dados_muitos_pontos),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'máximo' in data['error'].lower()
        
    def test_criar_rota_sem_autenticacao(self, client):
        """
        Teste US01: Segurança - rota deve ser criada por usuário autenticado
        
        Critério: user_id é obrigatório
        """
        # Arrange
        dados_sem_usuario = {
            "nome": "Rota Teste",
            "data_inicio": "2025-08-15T09:00:00",
            "pontos_turisticos": []
        }
        
        # Act
        response = client.post('/api/routes',
                             data=json.dumps(dados_sem_usuario),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'usuário' in data['error'].lower()
        
    def test_criar_rota_dados_json_invalidos(self, client):
        """
        Teste US01: Validação - JSON malformado deve falhar
        
        Critério: API deve validar formato dos dados
        """
        # Act
        response = client.post('/api/routes',
                             data="json inválido",
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 400
        
    def test_criar_rota_resposta_formato_correto(self, client, sample_route_data):
        """
        Teste US01: Formato da resposta deve estar correto
        
        Critério: Resposta deve incluir todos os campos necessários
        """
        # Act
        response = client.post('/api/routes',
                             data=json.dumps(sample_route_data),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 201
        data = json.loads(response.data)
        
        # Verificar campos obrigatórios na resposta
        campos_obrigatorios = ['id', 'nome', 'data_inicio', 'pontos_turisticos', 'user_id', 'created_at']
        for campo in campos_obrigatorios:
            assert campo in data, f"Campo {campo} não encontrado na resposta"
    
    def test_criar_rota_data_passada(self, client):
        """
        Teste US01: Validação - rota com data passada deve falhar
        
        Critério: Data de início deve ser futura
        """
        # Arrange
        dados_data_passada = {
            "nome": "Rota com Data Passada",
            "descricao": "Teste de validação de data",
            "data_inicio": "2020-01-01T09:00:00",  # Data no passado
            "pontos_turisticos": [
                {
                    "id": 1,
                    "nome": "Cristo Redentor",
                    "localizacao": {"latitude": -22.951916, "longitude": -43.210487}
                }
            ],
            "user_id": 1
        }
        
        # Act
        response = client.post('/api/routes',
                             data=json.dumps(dados_data_passada),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert 'data' in data['error'].lower() or 'passad' in data['error'].lower()

    def test_criar_rota_data_fim_antes_inicio(self, client):
        """
        Teste US01: Validação - data fim antes do início deve falhar
        
        Critério: Data de fim deve ser posterior à data de início
        """
        # Arrange
        dados_datas_invertidas = {
            "nome": "Rota com Datas Invertidas",
            "descricao": "Teste de validação de sequência de datas",
            "data_inicio": "2025-12-31T18:00:00",
            "data_fim": "2025-12-31T09:00:00",  # Fim antes do início
            "pontos_turisticos": [
                {
                    "id": 1,
                    "nome": "Cristo Redentor",
                    "localizacao": {"latitude": -22.951916, "longitude": -43.210487}
                }
            ],
            "user_id": 1
        }
        
        # Act
        response = client.post('/api/routes',
                             data=json.dumps(dados_datas_invertidas),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert any(term in data['error'].lower() for term in ['fim', 'anterior', 'sequência', 'ordem'])

    def test_criar_rota_data_formato_invalido(self, client):
        """
        Teste US01: Validação - formato de data inválido deve falhar
        
        Critério: Data deve estar em formato ISO válido
        """
        # Arrange
        dados_formato_invalido = {
            "nome": "Rota com Formato Inválido",
            "descricao": "Teste de validação de formato de data",
            "data_inicio": "15/08/2025 09:00",  # Formato brasileiro inválido para API
            "pontos_turisticos": [
                {
                    "id": 1,
                    "nome": "Cristo Redentor",
                    "localizacao": {"latitude": -22.951916, "longitude": -43.210487}
                }
            ],
            "user_id": 1
        }
        
        # Act
        response = client.post('/api/routes',
                             data=json.dumps(dados_formato_invalido),
                             content_type='application/json')
        
        # Assert
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
        assert any(term in data['error'].lower() for term in ['formato', 'data', 'inválid', 'iso'])
