# 🎯 US01 - Criar Rotas Turísticas

## 📋 Funcionalidade
Permite aos usuários criar novas rotas turísticas personalizadas, definindo nome, data de início e selecionando pontos turísticos de interesse.

## 🎯 Critérios de Aceitação
- [x] Usuário deve poder inserir nome da rota
- [x] Usuário deve poder definir data de início
- [x] Usuário deve poder selecionar pontos turísticos
- [x] Sistema deve gerar ID único automaticamente
- [x] Rota deve ser associada ao usuário logado
- [x] Dados devem ser persistidos no banco

## 🧪 Testes Implementados

### Testes Unitários (test_route_model.py)
- ✅ `test_criar_rota_valida` - Criação com dados válidos
- ✅ `test_criar_rota_sem_nome` - Validação de nome obrigatório
- ✅ `test_criar_rota_com_pontos_vazios` - Rota vazia inicialmente
- ✅ `test_criar_multiplas_rotas_mesmo_usuario` - Múltiplas rotas por usuário

### Testes de API (test_routes_api.py)
- ✅ `test_criar_rota_via_api` - Endpoint POST /api/routes
- ✅ `test_criar_rota_dados_invalidos` - Validação de entrada
- ✅ `test_criar_rota_sem_autenticacao` - Segurança

### Testes de Componente (test_route_creator.jsx)
- ✅ `test_renderizar_formulario` - Interface do usuário
- ✅ `test_validacao_campos` - Validação frontend
- ✅ `test_submissao_formulario` - Envio de dados

## 🚀 Como Executar

```bash
# Todos os testes da US01
pytest tests/us01_criar_rotas/ -v

# Apenas testes unitários
pytest tests/us01_criar_rotas/test_route_model.py -v

# Apenas testes de API
pytest tests/us01_criar_rotas/test_routes_api.py -v

# Componentes React
npm test -- tests/us01_criar_rotas/test_route_creator.jsx
```

## 🔗 Relacionamentos
- **Integra com**: US07 (Consultar pontos turísticos)
- **Relaciona com**: US03 (Consultar rotas), US02 (Atualizar rotas)

