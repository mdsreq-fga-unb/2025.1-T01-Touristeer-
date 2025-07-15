"""
Testes específicos para pontos turísticos de Brasília
Valida os novos pontos adicionados ao sistema
"""
import pytest
import json


class TestBrasiliaTouristSpots:
    """Testes específicos para pontos turísticos de Brasília"""
    
    def test_consultar_pontos_brasilia_no_json(self, client):
        """
        Teste US07: Verificar se pontos turísticos de Brasília estão no arquivo JSON
        
        Critério: Deve ter pelo menos 5 pontos de Brasília no arquivo de dados
        """
        # Act - Ler o arquivo JSON diretamente
        import os
        json_path = os.path.join(os.path.dirname(__file__), '..', '..', 'tourist_spots.json')
        
        with open(json_path, 'r', encoding='utf-8') as f:
            pontos = json.load(f)
        
        # Assert
        pontos_brasilia = [
            ponto for ponto in pontos 
            if any(nome in ponto['nome'] for nome in [
                'Congresso Nacional', 'Catedral de Brasília', 
                'Palácio da Alvorada', 'Esplanada dos Ministérios', 
                'Ponte JK'
            ])
        ]
        
        assert len(pontos_brasilia) >= 5, f"Deve ter pelo menos 5 pontos de Brasília. Encontrados: {len(pontos_brasilia)}"
        
        # Verifica estrutura dos pontos de Brasília
        for ponto in pontos_brasilia:
            assert 'id' in ponto
            assert 'nome' in ponto
            assert 'localizacao' in ponto
            assert 'latitude' in ponto['localizacao']
            assert 'longitude' in ponto['localizacao']
            assert 'imagem_url' in ponto
            assert 'descricao' in ponto
            
            # Verifica se as coordenadas são de Brasília (aproximadamente)
            lat = ponto['localizacao']['latitude']
            lng = ponto['localizacao']['longitude']
            
            # Brasília fica aproximadamente entre:
            # Latitude: -15.7 a -15.9
            # Longitude: -47.8 a -48.0
            if ponto['nome'] in ['Congresso Nacional', 'Catedral de Brasília', 
                               'Palácio da Alvorada', 'Esplanada dos Ministérios', 
                               'Ponte JK']:
                assert -16.0 <= lat <= -15.6, f"Latitude inválida para {ponto['nome']}: {lat}"
                assert -48.1 <= lng <= -47.7, f"Longitude inválida para {ponto['nome']}: {lng}"
    
    def test_validar_urls_imagens_brasilia(self, client):
        """
        Teste US07: Validar se as URLs das imagens dos pontos de Brasília são válidas
        
        Critério: URLs devem estar no formato esperado
        """
        # Act - Ler o arquivo JSON diretamente
        import os
        json_path = os.path.join(os.path.dirname(__file__), '..', '..', 'tourist_spots.json')
        
        with open(json_path, 'r', encoding='utf-8') as f:
            pontos = json.load(f)
        
        pontos_brasilia = [
            ponto for ponto in pontos 
            if any(nome in ponto['nome'] for nome in [
                'Congresso Nacional', 'Catedral de Brasília', 
                'Palácio da Alvorada', 'Esplanada dos Ministérios', 
                'Ponte JK'
            ])
        ]
        
        # Assert
        for ponto in pontos_brasilia:
            url_imagem = ponto['imagem_url']
            
            # Verifica formato básico da URL
            assert url_imagem.startswith('http'), f"URL inválida para {ponto['nome']}: {url_imagem}"
            assert any(ext in url_imagem.lower() for ext in ['.jpg', '.jpeg', '.png']), \
                f"URL sem extensão de imagem válida para {ponto['nome']}: {url_imagem}"
            
            # Verifica se é uma URL do Wikimedia (como as outras)
            assert 'wikimedia' in url_imagem.lower() or 'wikipedia' in url_imagem.lower(), \
                f"URL não é do Wikimedia para {ponto['nome']}: {url_imagem}"
