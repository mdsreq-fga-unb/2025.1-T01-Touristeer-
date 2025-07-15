"""
Configuração de testes para o projeto Turistieer
Este arquivo define fixtures e configurações globais para todos os testes
"""
import pytest
import tempfile
import os
import json
from datetime import datetime

# Import da aplicação Flask
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app
from src.models.user import db
from src.models.route import Route
from src.models.tourist_spot import TouristSpot


@pytest.fixture
def client():
    """Fixture que retorna um cliente de teste para a aplicação Flask"""
    # Criar banco de dados temporário
    db_fd, app.config['DATABASE'] = tempfile.mkstemp()
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + app.config['DATABASE']
    app.config['TESTING'] = True
    app.config['WTF_CSRF_ENABLED'] = False
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            
    # Limpar após o teste
    os.close(db_fd)
    os.unlink(app.config['DATABASE'])


@pytest.fixture
def app_context():
    """Fixture que fornece contexto da aplicação"""
    with app.app_context():
        yield app


@pytest.fixture
def sample_route_data():
    """Dados de exemplo para criação de rotas"""
    return {
        "nome": "Rota Teste Rio de Janeiro",
        "data_inicio": "2025-08-15T09:00:00",
        "pontos_turisticos": [
            {
                "id": 1,
                "nome": "Cristo Redentor",
                "localizacao": {
                    "latitude": -22.951916,
                    "longitude": -43.210487
                },
                "descricao": "Estátua icônica no Corcovado"
            },
            {
                "id": 2,
                "nome": "Pão de Açúcar",
                "localizacao": {
                    "latitude": -22.948658,
                    "longitude": -43.157444
                },
                "descricao": "Famoso morro na Urca"
            }
        ],
        "user_id": 1
    }


@pytest.fixture
def sample_tourist_spot():
    """Ponto turístico de exemplo"""
    return {
        "id": 1,
        "nome": "Cristo Redentor",
        "localizacao": {
            "latitude": -22.951916,
            "longitude": -43.210487
        },
        "imagem_url": "https://example.com/cristo.jpg",
        "descricao": "Estátua icônica do Cristo Redentor no topo do Corcovado"
    }


@pytest.fixture
def create_sample_route(client):
    """Fixture que cria uma rota de exemplo no banco de dados"""
    def _create_route(route_data=None):
        if route_data is None:
            route_data = {
                "nome": "Rota Teste",
                "data_inicio": "2025-08-15T09:00:00",
                "pontos_turisticos": [{"id": 1, "nome": "Cristo Redentor"}],
                "user_id": 1
            }
        
        response = client.post('/api/routes', 
                             data=json.dumps(route_data),
                             content_type='application/json')
        return response
    
    return _create_route


@pytest.fixture
def mock_geolocation_data():
    """Dados de exemplo para geolocalização"""
    return {
        "latitude": -22.908333,
        "longitude": -43.196388,
        "accuracy": 10,
        "timestamp": datetime.now().isoformat()
    }


# Fixture para limpar banco de dados após cada teste
@pytest.fixture(autouse=True)
def cleanup_database():
    """Auto-executa após cada teste para limpar o banco"""
    yield
    # Código de limpeza executado após cada teste
    with app.app_context():
        try:
            db.session.rollback()
            db.session.remove()
        except:
            pass
