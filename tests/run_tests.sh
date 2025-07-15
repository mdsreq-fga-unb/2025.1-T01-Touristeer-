#!/bin/bash

# Script para executar testes do projeto Turistieer
# Deve ser executado a partir da pasta tests/
# Estrutura reorganizada por funcionalidades do MVP

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

# Verificar se estamos na pasta tests
if [ ! -f "pytest.ini" ]; then
    print_colored "$RED" "❌ Execute este script a partir da pasta tests/"
    print_colored "$BLUE" "💡 cd tests && ./run_tests.sh"
    exit 1
fi

# Processar argumentos
FEATURE=""
COVERAGE=false
ALL=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --feature)
            FEATURE="$2"
            ALL=false
            shift 2
            ;;
        --coverage|-c)
            COVERAGE=true
            shift
            ;;
        --help|-h)
            echo "Uso: $0 [--feature FUNCIONALIDADE] [--coverage]"
            echo ""
            echo "Opções:"
            echo "  --feature us01_criar_rotas    Executar testes de funcionalidade específica"
            echo "  --coverage, -c                Gerar relatórios de cobertura"
            echo ""
            echo "Funcionalidades disponíveis:"
            echo "  us01_criar_rotas              US01 - Criar rotas turísticas"
            echo "  us02_atualizar_rotas          US02 - Atualizar rotas turísticas"
            echo "  us03_consultar_rotas          US03 - Consultar rotas turísticas"
            echo "  us04_excluir_rotas            US04 - Excluir rotas turísticas"
            echo "  us07_consultar_pontos_turisticos US07 - Consultar pontos turísticos"
            echo "  us17_obter_localizacao        US17 - Obter localização atual"
            echo "  us18_salvar_pdf               US18 - Salvar rotas em PDF"
            exit 0
            ;;
        *)
            shift
            ;;
    esac
done

print_colored "$BOLD" "🧪 EXECUTANDO TESTES - TURISTIEER"
if [ -n "$FEATURE" ]; then
    print_colored "$BLUE" "🎯 Funcionalidade: $FEATURE"
else
    print_colored "$BLUE" "🎯 Todas as funcionalidades do MVP"
fi

# Contador de sucessos
success_count=0
total_tests=0

# Função para executar testes backend
run_backend_tests() {
    print_colored "$BOLD" "\n🐍 TESTES BACKEND (Python)"
    
    # Verificar se pytest está instalado
    if ! python3 -c "import pytest" 2>/dev/null; then
        print_colored "$YELLOW" "📦 Instalando dependências Python..."
        pip install -r ../requirements.txt || {
            print_colored "$RED" "❌ Falha ao instalar dependências Python"
            return 1
        }
    fi
    
    # Criar diretório de relatórios
    mkdir -p ../reports
    
    local backend_success=0
    
    if [ -n "$FEATURE" ]; then
        # Executar testes de funcionalidade específica
        if [ -d "$FEATURE" ]; then
            ((total_tests++))
            if run_command "python3 -m pytest $FEATURE/ -v" "Testes da $FEATURE"; then
                ((success_count++))
                ((backend_success++))
            fi
        else
            print_colored "$RED" "❌ Funcionalidade $FEATURE não encontrada"
            return 1
        fi
    else
        # Testes unitários - Modelos
        ((total_tests++))
        if run_command "python3 -m pytest us*/test_*_model.py -v" "Testes Unitários - Modelos"; then
            ((success_count++))
            ((backend_success++))
        fi
        
        # Testes de integração - APIs
        ((total_tests++))
        if run_command "python3 -m pytest us*/test_*_api.py -v" "Testes de Integração - APIs"; then
            ((success_count++))
            ((backend_success++))
        fi
        
        # Todos os testes backend
        ((total_tests++))
        if run_command "python3 -m pytest us*/ -v" "Todos os Testes Backend"; then
            ((success_count++))
            ((backend_success++))
        fi
    fi
    
    if [ "$ALL" = true ]; then
        print_colored "$BLUE" "\n📊 Backend: $backend_success/3 grupos de testes passaram"
    else
        print_colored "$BLUE" "\n📊 Backend: $backend_success/1 funcionalidade testada"
    fi
    
    return $backend_success
}

# Função para executar testes frontend
run_frontend_tests() {
    print_colored "$BOLD" "\n⚛️ TESTES FRONTEND (React)"
    
    # Voltar para raiz para executar npm
    cd ..
    
    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
        print_colored "$YELLOW" "📦 Instalando dependências npm..."
        npm install || {
            print_colored "$RED" "❌ Falha ao instalar dependências npm"
            cd tests  # Voltar para tests
            return 1
        }
    fi
    
    local frontend_success=0
    
    # Testes de componentes React
    ((total_tests++))
    if run_command "npm run test -- tests/components/" "Testes de Componentes React"; then
        ((success_count++))
        ((frontend_success++))
    fi
    
    # Voltar para pasta tests
    cd tests
    
    print_colored "$BLUE" "\n📊 Frontend: $frontend_success/1 grupos de testes passaram"
    return $frontend_success
}

# Função para gerar relatório de cobertura
generate_coverage() {
    print_colored "$BOLD" "\n📊 GERANDO RELATÓRIO DE COBERTURA"
    
    # Criar diretório de relatórios
    mkdir -p ../reports
    
    # Cobertura backend
    if run_command "python3 -m pytest . --cov=../src --cov-report=html:../reports/backend_coverage --cov-report=term" "Cobertura Backend"; then
        print_colored "$GREEN" "📁 Relatório backend salvo em: ../reports/backend_coverage/index.html"
    fi
    
    # Cobertura frontend - mudar para raiz
    cd ..
    if run_command "npm run test:coverage" "Cobertura Frontend"; then
        print_colored "$GREEN" "📁 Relatório frontend salvo em: reports/frontend_coverage/index.html"
    fi
    cd tests  # Voltar para tests
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
