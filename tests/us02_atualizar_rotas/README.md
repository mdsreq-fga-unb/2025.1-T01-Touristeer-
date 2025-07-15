# 🎯 US02 - Atualizar Rotas Turísticas

## 📋 Funcionalidade
Permite aos usuários modificar rotas turísticas existentes, alterando nome, data de início e pontos turísticos selecionados.

## 🎯 Critérios de Aceitação
- [x] Usuário deve poder editar nome da rota
- [x] Usuário deve poder alterar data de início
- [x] Usuário deve poder adicionar/remover pontos turísticos
- [x] Apenas o dono da rota pode editá-la
- [x] Alterações devem ser persistidas no banco
- [x] Sistema deve validar dados antes de salvar

## 🧪 Testes Implementados

### Testes Unitários (test_route_update_model.py)
- ✅ `test_atualizar_nome_rota` - Alteração de nome
- ✅ `test_atualizar_data_inicio` - Alteração de data
- ✅ `test_atualizar_pontos_turisticos` - Modificação de pontos
- ✅ `test_validacao_dados_atualizacao` - Validação de entrada

### Testes de API (test_route_update_api.py)
- ✅ `test_atualizar_rota_via_api` - Endpoint PUT /api/routes/{id}
- ✅ `test_atualizar_rota_inexistente` - Erro 404
- ✅ `test_atualizar_rota_sem_permissao` - Erro 403

### Testes de Componente (test_route_editor.jsx)
- ✅ `test_carregar_dados_edicao` - Pré-população do formulário
- ✅ `test_salvar_alteracoes` - Envio de modificações
- ✅ `test_cancelar_edicao` - Descartar alterações

## 🚀 Como Executar

```bash
# Todos os testes da US02
pytest tests/us02_atualizar_rotas/ -v

# Componentes React
npm test -- tests/us02_atualizar_rotas/test_route_editor.jsx
```

## 🔗 Relacionamentos
- **Depende de**: US01 (Criar rotas), US03 (Consultar rotas)
- **Integra com**: US07 (Consultar pontos turísticos)
- **Relaciona com**: Autenticação e autorização
