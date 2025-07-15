# 🎯 US17 - Obter Localização Atual

## 📋 Funcionalidade
Permite ao sistema obter a localização atual do usuário para sugerir pontos turísticos próximos e facilitar a criação de rotas.

## 🎯 Critérios de Aceitação
- [x] Sistema deve solicitar permissão de geolocalização
- [x] Sistema deve obter coordenadas precisas
- [x] Deve funcionar em diferentes dispositivos/navegadores
- [x] Deve tratar erros de permissão negada
- [x] Deve ter fallback para localização manual

## 🧪 Testes Implementados

### Testes Unitários (test_geolocation_service.py)
- ✅ `test_obter_localizacao_sucesso` - Geolocalização bem-sucedida
- ✅ `test_erro_permissao_negada` - Tratamento de erro
- ✅ `test_timeout_localizacao` - Timeout da API

### Testes de Integração (test_geolocation_api.py)
- ✅ `test_api_geolocalizacao` - Integração com navegador
- ✅ `test_precisao_coordenadas` - Validação de precisão
- ✅ `test_fallback_manual` - Entrada manual de localização

### Testes de Componente (test_map_component.jsx)
- ✅ `test_solicitar_permissao` - Interface de permissão
- ✅ `test_exibir_localizacao_mapa` - Visualização no mapa
- ✅ `test_erro_localizacao` - Tratamento de erros

## 🚀 Como Executar

```bash
# Todos os testes da US17
pytest tests/us17_obter_localizacao/ -v
```

## 📊 Cobertura
- **Serviço**: 100%
- **API**: 90%
- **Componente**: 95%
