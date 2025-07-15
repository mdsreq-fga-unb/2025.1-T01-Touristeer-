# US07: Consultar Pontos Turísticos

## 📋 Critérios de Aceitação

**COMO** turista  
**QUERO** visualizar os pontos turísticos disponíveis  
**PARA** escolher quais incluir no meu roteiro

### Cenários de Teste:

1. **Listar pontos turísticos**
   - Deve exibir todos os pontos disponíveis
   - Deve mostrar informações básicas (nome, tipo, localização)
   - Deve permitir filtrar por categoria

2. **Visualizar detalhes**
   - Deve mostrar informações detalhadas do ponto
   - Deve exibir localização no mapa
   - Deve mostrar horários de funcionamento

3. **Buscar pontos turísticos**
   - Deve permitir busca por nome
   - Deve permitir busca por localização
   - Deve retornar resultados relevantes

## 🧪 Testes Implementados

### 📊 Modelo (Backend)
- `test_tourist_spot_model.py` - Testes do modelo TouristSpot
- `test_tourist_spots_crud.py` - Operações CRUD dos pontos turísticos

### 🌐 API (Backend) 
- `test_tourist_spots_api.py` - Endpoints da API de pontos turísticos

### 🖼️ Componentes (Frontend)
- `test_tourist_spots.test.jsx` - Componente de listagem
- `test_tourist_spot_selector.test.jsx` - Seletor de pontos

## ▶️ Executar Testes

```bash
# Todos os testes desta funcionalidade
python tests/run_tests.py --feature us07_consultar_pontos_turisticos

# Apenas testes de modelo
pytest tests/us07_consultar_pontos_turisticos/test_*model*.py -v

# Apenas testes de API  
pytest tests/us07_consultar_pontos_turisticos/test_*api*.py -v

# Apenas testes de componentes
npm test -- tests/us07_consultar_pontos_turisticos/
```

## 📝 Status dos Testes

| Tipo | Arquivo | Status |
|------|---------|--------|
| Modelo | `test_tourist_spot_model.py` | ✅ |
| CRUD | `test_tourist_spots_crud.py` | ✅ |
| API | `test_tourist_spots_api.py` | ✅ |
| Componente | `test_tourist_spots.test.jsx` | ✅ |
| Seletor | `test_tourist_spot_selector.test.jsx` | ✅ |
