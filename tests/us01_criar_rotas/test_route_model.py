"""
Testes unitários para US01 - Criar rotas turísticas
Valida a criação de novas rotas através do modelo Route
"""
import pytest
import json
from datetime import datetime
from src.models.route import Route
from src.models.user import db


class TestUS01CriarRotas:
    """Testes para US01 - Criar rotas turísticas"""
    
    def test_criar_rota_valida(self, app_context):
        """
        Teste US01: Criar rota turística com dados válidos
        
        Critérios de aceitação:
        - Deve aceitar nome da rota
        - Deve aceitar data de início
        - Deve aceitar lista de pontos turísticos
        - Deve associar a um usuário
        - Deve gerar ID automaticamente
        """
        # Arrange - Preparar dados
        pontos_turisticos = [
            {"id": 1, "nome": "Cristo Redentor", "latitude": -22.951916, "longitude": -43.210487},
            {"id": 2, "nome": "Pão de Açúcar", "latitude": -22.948658, "longitude": -43.157444}
        ]
        
        # Act - Executar ação
        rota = Route(
            nome="Rota Teste Rio",
            data_inicio=datetime(2025, 8, 15, 9, 0),
            pontos_turisticos=json.dumps(pontos_turisticos),
            user_id=1
        )
        
        db.session.add(rota)
        db.session.commit()
        
        # Assert - Verificar resultados
        assert rota.id is not None
        assert rota.nome == "Rota Teste Rio"
        assert rota.data_inicio == datetime(2025, 8, 15, 9, 0)
        assert rota.user_id == 1
        assert json.loads(rota.pontos_turisticos) == pontos_turisticos
        
    def test_criar_rota_sem_nome(self, app_context):
        """
        Teste US01: Tentar criar rota sem nome (deve falhar)
        
        Critério: Nome é obrigatório
        """
        # Arrange
        pontos = [{"id": 1, "nome": "Cristo Redentor"}]
        
        # Act & Assert
        with pytest.raises((ValueError, Exception)):
            rota = Route(
                nome="",  # Nome vazio
                data_inicio=datetime.now(),
                pontos_turisticos=json.dumps(pontos),
                user_id=1
            )
            db.session.add(rota)
            db.session.commit()
    
    def test_criar_rota_com_pontos_vazios(self, app_context):
        """
        Teste US01: Criar rota com lista de pontos vazia
        
        Critério: Deve permitir rota vazia inicialmente
        """
        # Arrange & Act
        rota = Route(
            nome="Rota Vazia",
            data_inicio=datetime.now(),
            pontos_turisticos=json.dumps([]),
            user_id=1
        )
        
        db.session.add(rota)
        db.session.commit()
        
        # Assert
        assert rota.id is not None
        assert json.loads(rota.pontos_turisticos) == []
        
    def test_criar_multiplas_rotas_mesmo_usuario(self, app_context):
        """
        Teste US01: Usuário pode criar múltiplas rotas
        
        Critério: Não há limite de rotas por usuário
        """
        # Arrange & Act
        rota1 = Route(
            nome="Rota 1",
            data_inicio=datetime.now(),
            pontos_turisticos=json.dumps([]),
            user_id=1
        )
        
        rota2 = Route(
            nome="Rota 2", 
            data_inicio=datetime.now(),
            pontos_turisticos=json.dumps([]),
            user_id=1
        )
        
        db.session.add_all([rota1, rota2])
        db.session.commit()
        
        # Assert
        assert rota1.id != rota2.id
        assert rota1.user_id == rota2.user_id == 1
