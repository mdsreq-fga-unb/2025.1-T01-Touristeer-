# 🧪 Testes - Turistieer

Este diretório contém todos os testes para validar as funcionalidades do MVP conforme a **Definition of Done (DOD)** estabelecida para o projeto.

## 📋 Funcionalidades Testadas (MVP)

Os testes cobrem as seguintes User Stories do MVP:

- **US01** - Criar rotas turísticas
- **US02** - Atualizar rotas turísticas  
- **US03** - Consultar rotas turísticas
- **US04** - Excluir rotas turísticas
- **US07** - Consultar pontos turísticos
- **US17** - Obter localização atual
- **US18** - Salvar rotas turísticas em PDF

## 🏗️ Estrutura dos Testes (Organizada por Funcionalidades)

```
tests/
├── __init__.py                          # Inicialização do módulo
├── conftest.py                          # Configurações globais do pytest
├── pytest.ini                          # Configuração do pytest
├── jest.config.js                      # Configuração do Jest
├── .babelrc                            # Configuração do Babel para JSX
├── run_tests.py                        # Script Python de automação
├── run_tests.sh                        # Script Bash de automação
├── validate_structure.py               # Script de validação da estrutura
├── README.md                           # Documentação dos testes
│
├── us01_criar_rotas/                   # 🎯 US01 - Criar rotas turísticas
│   ├── __init__.py
│   ├── test_route_model.py             # ✅ Testes unitários
│   ├── test_routes_api.py              # ✅ Testes de API
│   ├── test_route_creator.jsx          # ✅ Testes de componente
│   └── README.md                       # ✅ Documentação específica
│
├── us02_atualizar_rotas/               # 🎯 US02 - Atualizar rotas
│   ├── __init__.py
│   ├── test_route_update_model.py      # ✅ Testes unitários
│   ├── test_route_update_api.py        # 🔄 Testes de API
│   ├── test_route_editor.jsx           # 🔄 Testes de componente
│   └── README.md                       # ✅ Documentação específica
│
├── us03_consultar_rotas/               # 🎯 US03 - Consultar rotas
│   ├── __init__.py
│   ├── test_route_query_model.py       # 🔄 Testes unitários
│   ├── test_route_list_api.py          # 🔄 Testes de API
│   ├── test_route_list.jsx             # 🔄 Testes de componente
│   ├── test_route_viewer.jsx           # 🔄 Testes de componente
│   └── README.md                       # ✅ Documentação específica
│
├── us04_excluir_rotas/                 # 🎯 US04 - Excluir rotas
│   ├── __init__.py
│   ├── test_route_delete_model.py      # 🔄 Testes unitários
│   ├── test_route_delete_api.py        # 🔄 Testes de API
│   ├── test_route_delete_ui.jsx        # 🔄 Testes de componente
│   └── README.md                       # ✅ Documentação específica
│
├── us07_consultar_pontos_turisticos/   # 🎯 US07 - Consultar pontos turísticos
│   ├── __init__.py
│   ├── test_tourist_spot_model.py      # 🔄 Testes unitários
│   ├── test_tourist_spots_api.py       # ✅ Testes de API
│   ├── test_tourist_spots.jsx          # 🔄 Testes de componente
│   ├── test_tourist_spot_selector.jsx  # 🔄 Testes de componente
│   └── README.md                       # ✅ Documentação específica
│
├── us17_obter_localizacao/             # 🎯 US17 - Obter localização atual
│   ├── __init__.py
│   ├── test_geolocation_service.py     # 🔄 Testes unitários
│   ├── test_geolocation_api.py         # 🔄 Testes de integração
│   ├── test_map_component.jsx          # 🔄 Testes de componente
│   └── README.md                       # ✅ Documentação específica
│
└── us18_salvar_pdf/                    # 🎯 US18 - Salvar rotas em PDF
    ├── __init__.py
    ├── test_pdf_service.py             # 🔄 Testes unitários
    ├── test_pdf_export_api.py          # ✅ Testes de API
    ├── test_pdf_export_ui.jsx          # 🔄 Testes de componente
    └── README.md                       # ✅ Documentação específica
```

### 📊 **Legenda:**
- ✅ **Implementado e funcionando**
- 🔄 **Estrutura criada, aguardando implementação**
- 🎯 **Funcionalidade do MVP**

## 🚀 Como Executar os Testes

### Opção 1: Script Automatizado (Recomendado)

```bash
# Executar todos os testes
./run_tests.sh

# Executar com relatório de cobertura
./run_tests.sh --coverage

# Executar testes de uma funcionalidade específica
./run_tests.sh --feature us01_criar_rotas

# Ou usando Python
python3 run_tests.py --all --coverage
python3 run_tests.py --feature us01_criar_rotas
```

### Opção 2: Comandos Específicos

#### Backend (Python)
```bash
# Instalar dependências (executar da raiz)
pip install -r requirements.txt

# Executar testes (da pasta tests/)
cd tests

# Todos os testes de uma funcionalidade
python3 -m pytest us01_criar_rotas/ -v

# Apenas testes unitários (modelos)
python3 -m pytest us*/test_*_model.py -v

# Apenas testes de API
python3 -m pytest us*/test_*_api.py -v

# Todos os testes backend com cobertura
python3 -m pytest us*/ --cov=../src --cov-report=html:../reports/backend_coverage
```

#### Frontend (React)
```bash
# Instalar dependências (executar da raiz)
npm install

# Testes de uma funcionalidade específica
npm run test -- tests/us01_criar_rotas/*.jsx

# Todos os testes de componentes
npm run test -- tests/us*/*.jsx

# Testes com cobertura
npm run test:coverage -- tests/us*/*.jsx
```

## 📊 Relatórios de Teste

Os relatórios são gerados automaticamente na pasta `../reports/` (na raiz do projeto):

- **Backend**: `../reports/backend_coverage/index.html`
- **Frontend**: `../reports/frontend_coverage/index.html`
- **Pytest HTML**: `../reports/pytest_report.html`

## 🎯 Critérios de Validação (DOD)

### ✅ Contempla os requisitos estabelecidos?
- [x] Todos os testes validam funcionalidades específicas do MVP
- [x] Cada teste mapeia para uma User Story do backlog
- [x] Casos de teste cobrem cenários positivos e negativos

### ✅ Entrega um incremento do produto?
- [x] Testes garantem que o código está integrado e funcional
- [x] Validação de que as funcionalidades agregam valor ao produto
- [x] Verificação de implementação completa das features

### ✅ Testes Realizados?
- [x] **Testes unitários** para modelos e funções isoladas
- [x] **Testes de integração** com APIs externas (Google Maps, APIs de geolocalização)
- [x] **Testes de componentes** React com Testing Library
- [x] **Cobertura mínima** de 80% do código

### ✅ Código e Funcionalidade Revisada?
- [x] Testes automatizados validam qualidade do código
- [x] Evidências de execução através de relatórios HTML
- [x] Validação de conformidade com DOD

## 🧪 Tipos de Teste

### 1. Testes Unitários
Validam comportamento isolado de modelos e funções:
- Modelo `Route` (criação, atualização, conversão para dict)
- Modelo `TouristSpot` (consulta, filtros, validação)

### 2. Testes de Integração - Backend
Validam APIs e endpoints:
- CRUD completo de rotas turísticas
- Consulta de pontos turísticos
- Exportação para PDF
- Integração com APIs de geolocalização

### 3. Testes de Integração - Frontend
Validam componentes React:
- Formulários de criação/edição de rotas
- Listagem e filtragem de dados
- Interações do usuário
- Integração com APIs

### 4. Testes de Geolocalização
Validam funcionalidades de localização:
- Obtenção de coordenadas atuais
- Cálculo de distâncias
- Busca por proximidade
- Tratamento de erros de permissão

## 📝 Marcadores de Teste

Os testes usam marcadores pytest para categorização:

```bash
# Executar apenas testes unitários
pytest -m unit

# Executar apenas testes de backend
pytest -m backend

# Executar apenas testes de geolocalização
pytest -m geolocation
```

## 🔧 Configuração dos Testes

### Pytest (Backend)
- Configuração em `pytest.ini`
- Fixtures em `conftest.py`
- Cobertura mínima: 80%
- Relatórios HTML automáticos

### Jest + Testing Library (Frontend)
- Configuração em `src/setupTests.js`
- Mocks para APIs do navegador
- Suporte a JSX e ES6+

## 🐛 Resolução de Problemas

### Erro: "pytest not found"
```bash
pip install -r requirements.txt
```

### Erro: "npm not found"
```bash
# Instalar Node.js
# Ubuntu/Debian:
sudo apt install nodejs npm

# macOS:
brew install node
```

### Testes falhando por timeout
```bash
# Aumentar timeout no pytest.ini
# Ou executar testes específicos:
pytest tests/unit/test_route_model.py::TestRouteModel::test_criar_rota_valida -v
```

### Problemas de cobertura
```bash
# Verificar arquivos omitidos na configuração
# coverage:omit em pytest.ini
```

## ✅ Validação da Estrutura

Para verificar se a reorganização foi aplicada corretamente:

```bash
cd tests
./validate_structure.py
```

Este script verifica:
- ✅ Arquivos de configuração estão na pasta `tests/`
- ✅ Estrutura de pastas está correta
- ✅ Arquivos de teste estão nos locais corretos
- ✅ Scripts npm estão configurados adequadamente

## 📈 Métricas de Qualidade

### Metas de Cobertura
- **Backend**: ≥ 80% de cobertura de código
- **Frontend**: ≥ 70% de cobertura de componentes
- **APIs**: 100% dos endpoints testados

### Critérios de Aprovação
- ✅ Todos os testes unitários passando
- ✅ Todos os testes de integração passando  
- ✅ Cobertura acima das metas estabelecidas
- ✅ Nenhum erro crítico nos relatórios

## 🤝 Contribuindo com Testes

### Adicionando Novos Testes

1. **Teste Unitário**:
```python
def test_nova_funcionalidade(app_context):
    # Arrange
    # Act  
    # Assert
    pass
```

2. **Teste de API**:
```python
def test_novo_endpoint(client):
    response = client.get('/api/novo-endpoint')
    assert response.status_code == 200
```

3. **Teste de Componente**:
```jsx
test('deve renderizar novo componente', () => {
    render(<NovoComponente />);
    expect(screen.getByText('Texto Esperado')).toBeInTheDocument();
});
```

### Convenções
- Nome dos arquivos: `test_*.py` ou `*.test.jsx`
- Funções de teste: `test_*`
- Usar docstrings para descrever o que está sendo testado
- Incluir referência à User Story quando aplicável

---

## 📞 Suporte

Para dúvidas sobre os testes:
1. Verificar logs de execução detalhados
2. Consultar documentação do pytest e Testing Library
3. Revisar configurações em `conftest.py` e `setupTests.js`

**Lembre-se**: Os testes são fundamentais para garantir que a aplicação atende aos critérios da Definition of Done e está pronta para entrega! 🎯
