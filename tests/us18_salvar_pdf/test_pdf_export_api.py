"""
Testes de API para US18 - Salvar rotas em PDF
Valida a exportação de rotas para formato PDF
"""
import pytest
import json
import tempfile
import os


class TestUS18SalvarRotasPDF:
    """Testes para exportação de rotas em PDF"""
    
    def test_exportar_rota_para_pdf(self, client, create_sample_route):
        """
        Teste US18: Exportar rota turística para PDF
        
        Endpoint: GET /api/routes/{id}/export-pdf
        Critérios:
        - Deve retornar arquivo PDF válido
        - Deve incluir dados da rota
        - Deve ter headers de download corretos
        """
        # Arrange - Criar rota com pontos turísticos
        dados_rota = {
            "nome": "Rota para PDF",
            "data_inicio": "2025-08-15T09:00:00",
            "pontos_turisticos": [
                {
                    "id": 1,
                    "nome": "Cristo Redentor",
                    "descricao": "Estátua icônica no Corcovado"
                },
                {
                    "id": 2,
                    "nome": "Pão de Açúcar", 
                    "descricao": "Famoso morro na Urca"
                }
            ],
            "user_id": 1
        }
        
        response_criacao = create_sample_route(dados_rota)
        rota_criada = json.loads(response_criacao.data)
        rota_id = rota_criada['id']
        
        # Act
        response = client.get(f'/api/routes/{rota_id}/export-pdf')
        
        # Assert
        assert response.status_code == 200
        assert response.content_type == 'application/pdf'
        
        # Verificar cabeçalhos de download
        assert 'attachment' in response.headers.get('Content-Disposition', '')
        assert 'filename=' in response.headers.get('Content-Disposition', '')
        
        # Verificar se é um PDF válido (verifica assinatura)
        pdf_content = response.data
        assert pdf_content.startswith(b'%PDF-'), "Conteúdo não é um PDF válido"
        
    def test_exportar_rota_inexistente(self, client):
        """
        Teste US18: Tentar exportar rota inexistente
        
        Critério: Deve retornar erro 404
        """
        # Act
        response = client.get('/api/routes/999999/export-pdf')
        
        # Assert
        assert response.status_code == 404
        
        data = json.loads(response.data)
        assert 'error' in data
        assert 'não encontrada' in data['error'].lower()
        
    def test_nome_arquivo_pdf_correto(self, client, create_sample_route):
        """
        Teste US18: Verificar nome do arquivo PDF gerado
        
        Critério: Nome deve incluir nome da rota e data
        """
        # Arrange
        dados_rota = {
            "nome": "Rota Especial",
            "data_inicio": "2025-08-15T09:00:00",
            "pontos_turisticos": [],
            "user_id": 1
        }
        
        response_criacao = create_sample_route(dados_rota)
        rota_criada = json.loads(response_criacao.data)
        rota_id = rota_criada['id']
        
        # Act
        response = client.get(f'/api/routes/{rota_id}/export-pdf')
        
        # Assert
        assert response.status_code == 200
        
        content_disposition = response.headers.get('Content-Disposition', '')
        assert 'Rota-Especial' in content_disposition or 'rota-especial' in content_disposition
        assert '.pdf' in content_disposition
        
    def test_pdf_contem_dados_rota(self, client, create_sample_route):
        """
        Teste US18: PDF deve conter dados da rota
        
        Critério: PDF deve incluir nome, data e pontos turísticos
        Nota: Este é um teste básico - idealmente usaríamos uma lib para ler PDF
        """
        # Arrange
        dados_rota = {
            "nome": "Rota Teste PDF",
            "data_inicio": "2025-08-15T09:00:00",
            "pontos_turisticos": [
                {"id": 1, "nome": "Cristo Redentor"}
            ],
            "user_id": 1
        }
        
        response_criacao = create_sample_route(dados_rota)
        rota_criada = json.loads(response_criacao.data)
        rota_id = rota_criada['id']
        
        # Act
        response = client.get(f'/api/routes/{rota_id}/export-pdf')
        
        # Assert
        assert response.status_code == 200
        assert len(response.data) > 1000  # PDF deve ter tamanho razoável
        
        # Verificação básica de conteúdo (PDFs contêm texto legível)
        pdf_content = response.data.decode('latin-1', errors='ignore')
        assert 'Rota Teste PDF' in pdf_content or 'rota' in pdf_content.lower()
        
    def test_exportar_rota_sem_pontos(self, client, create_sample_route):
        """
        Teste US18: Exportar rota sem pontos turísticos
        
        Critério: Deve gerar PDF mesmo sem pontos
        """
        # Arrange
        dados_rota = {
            "nome": "Rota Vazia",
            "data_inicio": "2025-08-15T09:00:00", 
            "pontos_turisticos": [],
            "user_id": 1
        }
        
        response_criacao = create_sample_route(dados_rota)
        rota_criada = json.loads(response_criacao.data)
        rota_id = rota_criada['id']
        
        # Act
        response = client.get(f'/api/routes/{rota_id}/export-pdf')
        
        # Assert
        assert response.status_code == 200
        assert response.content_type == 'application/pdf'
        assert len(response.data) > 500  # PDF mínimo deve ter algum tamanho
        
    def test_tamanho_arquivo_pdf_razoavel(self, client, create_sample_route):
        """
        Teste US18: PDF não deve ser excessivamente grande
        
        Critério: Arquivo deve ter tamanho otimizado
        """
        # Arrange
        dados_rota = {
            "nome": "Rota Completa",
            "data_inicio": "2025-08-15T09:00:00",
            "pontos_turisticos": [
                {"id": i, "nome": f"Ponto {i}"} for i in range(1, 6)
            ],
            "user_id": 1
        }
        
        response_criacao = create_sample_route(dados_rota)
        rota_criada = json.loads(response_criacao.data)
        rota_id = rota_criada['id']
        
        # Act
        response = client.get(f'/api/routes/{rota_id}/export-pdf')
        
        # Assert
        assert response.status_code == 200
        
        # PDF não deve ser muito grande (limite: 5MB)
        tamanho_mb = len(response.data) / (1024 * 1024)
        assert tamanho_mb < 5, f"PDF muito grande: {tamanho_mb:.2f}MB"
        
        # Mas deve ter conteúdo suficiente
        assert len(response.data) > 1000, "PDF muito pequeno"
