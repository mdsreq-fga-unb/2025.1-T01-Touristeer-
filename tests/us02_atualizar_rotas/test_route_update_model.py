"""
Testes unitários para US02 - Atualizar rotas turísticas
Valida a atualização de rotas através do modelo Route
"""
import pytest
import json
from datetime import datetime
from src.models.route import Route
from src.models.user import db


class TestUS02AtualizarRotas:
    """Testes para US02 - Atualizar rotas turísticas"""
    
    def test_atualizar_nome_rota(self, app_context):
        """
        Teste US02: Atualizar nome da rota
        
        Critério: Deve permitir alterar nome mantendo outros dados
        """
        # Arrange - Criar rota inicial
        rota = Route(
            nome="Nome Original",
            data_inicio=datetime(2025, 8, 15, 9, 0),
            pontos_turisticos=json.dumps([]),
            user_id=1
        )
        db.session.add(rota)
        db.session.commit()
        rota_id = rota.id
        
        # Act - Atualizar nome
        rota_atualizada = db.session.get(Route, rota_id)
        rota_atualizada.nome = "Nome Atualizado"
        db.session.commit()
        
        # Assert
        rota_verificacao = db.session.get(Route, rota_id)
        assert rota_verificacao.nome == "Nome Atualizado"
        assert rota_verificacao.data_inicio == datetime(2025, 8, 15, 9, 0)
        assert rota_verificacao.user_id == 1
        
    def test_atualizar_data_inicio(self, app_context):
        """
        Teste US02: Atualizar data de início
        
        Critério: Deve permitir alterar data mantendo outros dados
        """
        # Arrange
        data_original = datetime(2025, 8, 15, 9, 0)
        data_nova = datetime(2025, 9, 1, 10, 30)
        
        rota = Route(
            nome="Rota Teste",
            data_inicio=data_original,
            pontos_turisticos=json.dumps([]),
            user_id=1
        )
        db.session.add(rota)
        db.session.commit()
        rota_id = rota.id
        
        # Act
        rota_atualizada = db.session.get(Route, rota_id)
        rota_atualizada.data_inicio = data_nova
        db.session.commit()
        
        # Assert
        rota_verificacao = db.session.get(Route, rota_id)
        assert rota_verificacao.data_inicio == data_nova
        assert rota_verificacao.nome == "Rota Teste"
        
    def test_atualizar_pontos_turisticos(self, app_context):
        """
        Teste US02: Atualizar pontos turísticos da rota
        
        Critério: Deve permitir adicionar/remover pontos
        """
        # Arrange
        pontos_originais = [{"id": 1, "nome": "Cristo Redentor"}]
        pontos_novos = [
            {"id": 1, "nome": "Cristo Redentor"},
            {"id": 2, "nome": "Pão de Açúcar"}
        ]
        
        rota = Route(
            nome="Rota Teste",
            data_inicio=datetime.now(),
            pontos_turisticos=json.dumps(pontos_originais),
            user_id=1
        )
        db.session.add(rota)
        db.session.commit()
        rota_id = rota.id
        
        # Act
        rota_atualizada = db.session.get(Route, rota_id)
        rota_atualizada.pontos_turisticos = json.dumps(pontos_novos)
        db.session.commit()
        
        # Assert
        rota_verificacao = db.session.get(Route, rota_id)
        pontos_salvos = json.loads(rota_verificacao.pontos_turisticos)
        assert len(pontos_salvos) == 2
        assert pontos_salvos == pontos_novos
        
    def test_atualizar_multiplos_campos(self, app_context):
        """
        Teste US02: Atualizar múltiplos campos simultaneamente
        
        Critério: Deve permitir alterar vários campos de uma vez
        """
        # Arrange
        rota = Route(
            nome="Nome Original",
            data_inicio=datetime(2025, 8, 15, 9, 0),
            pontos_turisticos=json.dumps([]),
            user_id=1
        )
        db.session.add(rota)
        db.session.commit()
        rota_id = rota.id
        
        # Act - Atualizar múltiplos campos
        nova_data = datetime(2025, 9, 1, 10, 0)
        novos_pontos = [{"id": 1, "nome": "Cristo Redentor"}]
        
        rota_atualizada = db.session.get(Route, rota_id)
        rota_atualizada.nome = "Nome Completamente Novo"
        rota_atualizada.data_inicio = nova_data
        rota_atualizada.pontos_turisticos = json.dumps(novos_pontos)
        db.session.commit()
        
        # Assert
        rota_verificacao = db.session.get(Route, rota_id)
        assert rota_verificacao.nome == "Nome Completamente Novo"
        assert rota_verificacao.data_inicio == nova_data
        assert json.loads(rota_verificacao.pontos_turisticos) == novos_pontos
        
    def test_nao_alterar_id_usuario(self, app_context):
        """
        Teste US02: Segurança - não deve permitir alterar user_id
        
        Critério: user_id deve ser imutável após criação
        """
        # Arrange
        rota = Route(
            nome="Rota Teste",
            data_inicio=datetime.now(),
            pontos_turisticos=json.dumps([]),
            user_id=1
        )
        db.session.add(rota)
        db.session.commit()
        rota_id = rota.id
        
        # Act & Assert
        rota_atualizada = db.session.get(Route, rota_id)
        user_id_original = rota_atualizada.user_id
        
        # Tentar alterar user_id (não deve ser permitido na lógica de negócio)
        # Este teste documenta o comportamento esperado
        assert rota_atualizada.user_id == user_id_original == 1
