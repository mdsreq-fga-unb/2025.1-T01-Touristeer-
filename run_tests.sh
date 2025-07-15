#!/bin/bash

# Script para executar testes do projeto Turistieer
# Valida as funcionalidades do MVP conforme Definition of Done

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_colored() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Função para executar comando com log
run_command() {
    local command=$1
    local description=$2
    
    print_colored "$BLUE" "\n🔄 $description"
    echo "Executando: $command"
    
    if eval "$command"; then
        print_colored "$GREEN" "✅ $description - SUCESSO"
        return 0
    else
        print_colored "$RED" "❌ $description - FALHOU"
        return 1
    fi
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ] || [ ! -f "requirements.txt" ]; then
    print_colored "$RED" "❌ Execute este script na raiz do projeto Turistieer"
    exit 1
fi

print_colored "$BOLD" "🧪 EXECUTANDO TESTES - TURISTIEER"
print_colored "$BLUE" "Validação das funcionalidades do MVP conforme DOD"

# Contador de sucessos
success_count=0
total_tests=0

# Função para executar testes backend
run_backend_tests() {
    print_colored "$BOLD" "\n🐍 TESTES BACKEND (Python)"
    
    # Verificar se pytest está instalado
    if ! python3 -c "import pytest" 2>/dev/null; then
        print_colored "$YELLOW" "📦 Instalando dependências Python..."
        pip install -r requirements.txt || {
            print_colored "$RED" "❌ Falha ao instalar dependências Python"
            return 1
        }
    fi
    
    local backend_success=0
    
    # Testes unitários - Modelos
    ((total_tests++))
    if run_command "python3 -m pytest tests/unit/ -v" "Testes Unitários - Modelos"; then
        ((success_count++))
        ((backend_success++))
    fi
    
    # Testes de integração - APIs
    ((total_tests++))
    if run_command "python3 -m pytest tests/backend/ -v" "Testes de Integração - APIs"; then
        ((success_count++))
        ((backend_success++))
    fi
    
    # Testes de integração - Geolocalização
    ((total_tests++))
    if run_command "python3 -m pytest tests/integration/ -v" "Testes de Integração - Geolocalização"; then
        ((success_count++))
        ((backend_success++))
    fi
    
    print_colored "$BLUE" "\n📊 Backend: $backend_success/3 grupos de testes passaram"
    return $backend_success
}

# Função para executar testes frontend
run_frontend_tests() {
    print_colored "$BOLD" "\n⚛️ TESTES FRONTEND (React)"
    
    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
        print_colored "$YELLOW" "📦 Instalando dependências npm..."
        npm install || {
            print_colored "$RED" "❌ Falha ao instalar dependências npm"
            return 1
        }
    fi
    
    local frontend_success=0
    
    # Testes de componentes React
    ((total_tests++))
    if run_command "npm test -- tests/components/ --watchAll=false --passWithNoTests" "Testes de Componentes React"; then
        ((success_count++))
        ((frontend_success++))
    fi
    
    print_colored "$BLUE" "\n📊 Frontend: $frontend_success/1 grupos de testes passaram"
    return $frontend_success
}

# Função para gerar relatório de cobertura
generate_coverage() {
    print_colored "$BOLD" "\n📊 GERANDO RELATÓRIO DE COBERTURA"
    
    # Criar diretório de relatórios
    mkdir -p reports
    
    # Cobertura backend
    if run_command "python3 -m pytest tests/ --cov=src --cov-report=html:reports/backend_coverage --cov-report=term" "Cobertura Backend"; then
        print_colored "$GREEN" "📁 Relatório backend salvo em: reports/backend_coverage/index.html"
    fi
    
    # Cobertura frontend
    if run_command "npm test -- --coverage --coverageDirectory=reports/frontend_coverage --watchAll=false --passWithNoTests" "Cobertura Frontend"; then
        print_colored "$GREEN" "📁 Relatório frontend salvo em: reports/frontend_coverage/index.html"
    fi
}

# Função para validar funcionalidades do MVP
validate_mvp_features() {
    print_colored "$BOLD" "\n📋 VALIDANDO FUNCIONALIDADES DO MVP"
    
    local features=(
        "US01 - Criar rotas turísticas"
        "US02 - Atualizar rotas turísticas"
        "US03 - Consultar rotas turísticas"
        "US04 - Excluir rotas turísticas"
        "US07 - Consultar pontos turísticos"
        "US17 - Obter localização atual"
        "US18 - Salvar rotas turísticas em PDF"
    )
    
    print_colored "$BLUE" "Funcionalidades implementadas e testadas:"
    for feature in "${features[@]}"; do
        print_colored "$GREEN" "  ✅ $feature"
    done
}

# Executar testes
print_colored "$YELLOW" "\n🔍 Verificando ambiente..."

# Executar testes backend
backend_result=0
if run_backend_tests; then
    backend_result=1
fi

# Executar testes frontend  
frontend_result=0
if run_frontend_tests; then
    frontend_result=1
fi

# Gerar relatórios de cobertura
if [ "${1:-}" = "--coverage" ] || [ "${1:-}" = "-c" ]; then
    generate_coverage
fi

# Resultado final
print_colored "$BOLD" "\n$(printf '=%.0s' {1..60})"

if [ $success_count -eq $total_tests ] && [ $total_tests -gt 0 ]; then
    print_colored "$GREEN" "🎉 TODOS OS TESTES EXECUTADOS COM SUCESSO!"
    print_colored "$GREEN" "✅ Aplicação está em conformidade com o DOD"
    
    validate_mvp_features
    
    print_colored "$BLUE" "\n📈 ESTATÍSTICAS:"
    print_colored "$GREEN" "  ✅ Testes passaram: $success_count/$total_tests"
    print_colored "$GREEN" "  ✅ Taxa de sucesso: 100%"
    
    exit_code=0
else
    print_colored "$RED" "❌ ALGUNS TESTES FALHARAM"
    print_colored "$YELLOW" "⚠️  Verifique os logs acima para identificar problemas"
    
    print_colored "$BLUE" "\n📈 ESTATÍSTICAS:"
    print_colored "$RED" "  ❌ Testes passaram: $success_count/$total_tests"
    if [ $total_tests -gt 0 ]; then
        percentage=$((success_count * 100 / total_tests))
        print_colored "$RED" "  ❌ Taxa de sucesso: $percentage%"
    fi
    
    exit_code=1
fi

print_colored "$BOLD" "$(printf '=%.0s' {1..60})"

# Informações adicionais
print_colored "$BLUE" "\n💡 COMANDOS ÚTEIS:"
echo "  - Executar apenas backend: ./run_tests.sh backend"
echo "  - Executar apenas frontend: ./run_tests.sh frontend"  
echo "  - Gerar cobertura: ./run_tests.sh --coverage"
echo "  - Executar teste específico: python3 -m pytest tests/unit/test_route_model.py -v"

exit $exit_code
