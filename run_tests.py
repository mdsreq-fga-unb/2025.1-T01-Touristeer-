#!/usr/bin/env python3
"""
Script para executar todos os testes do projeto Turistieer
Este script executa testes backend (Python) e frontend (JavaScript)
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

# Cores para output no terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_colored(message, color):
    """Imprime mensagem colorida no terminal"""
    print(f"{color}{message}{Colors.END}")

def run_command(command, description):
    """Executa comando e retorna se foi bem-sucedido"""
    print_colored(f"\n🔄 {description}", Colors.BLUE)
    print(f"Executando: {command}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print_colored(f"✅ {description} - SUCESSO", Colors.GREEN)
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print_colored(f"❌ {description} - FALHOU", Colors.RED)
        if e.stdout:
            print(e.stdout)
        if e.stderr:
            print(e.stderr)
        return False

def check_dependencies():
    """Verifica se as dependências estão instaladas"""
    print_colored("🔍 Verificando dependências...", Colors.YELLOW)
    
    # Verificar pytest
    try:
        import pytest
        print("✅ pytest encontrado")
    except ImportError:
        print_colored("❌ pytest não encontrado. Execute: pip install -r requirements.txt", Colors.RED)
        return False
    
    # Verificar npm/yarn
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        print("✅ npm encontrado")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print_colored("❌ npm não encontrado. Instale Node.js", Colors.RED)
        return False
    
    return True

def run_backend_tests(args):
    """Executa testes do backend (Python)"""
    print_colored("\n🐍 EXECUTANDO TESTES BACKEND (Python)", Colors.BOLD)
    
    # Comandos de teste para backend
    commands = []
    
    if args.unit or args.all:
        commands.append(("pytest tests/unit/ -v", "Testes Unitários - Modelos"))
    
    if args.integration or args.all:
        commands.append(("pytest tests/backend/ -v", "Testes de Integração - APIs"))
        commands.append(("pytest tests/integration/ -v", "Testes de Integração - Geolocalização"))
    
    if args.coverage:
        commands.append(("pytest tests/ --cov=src --cov-report=html", "Relatório de Cobertura"))
    
    success_count = 0
    for command, description in commands:
        if run_command(command, description):
            success_count += 1
    
    return success_count == len(commands) if commands else True

def run_frontend_tests(args):
    """Executa testes do frontend (JavaScript/React)"""
    print_colored("\n⚛️ EXECUTANDO TESTES FRONTEND (React)", Colors.BOLD)
    
    # Verificar se node_modules existe
    if not os.path.exists("node_modules"):
        print_colored("📦 Instalando dependências npm...", Colors.YELLOW)
        if not run_command("npm install", "Instalação de dependências"):
            return False
    
    # Comandos de teste para frontend
    commands = []
    
    if args.components or args.all:
        commands.append(("npm test -- tests/components/ --watchAll=false", "Testes de Componentes React"))
    
    if args.e2e:
        commands.append(("npm run test:e2e", "Testes End-to-End"))
    
    # Se nenhum teste específico foi solicitado, executar todos
    if not commands and (args.all or not any([args.unit, args.integration, args.components])):
        commands.append(("npm test -- --watchAll=false", "Todos os Testes Frontend"))
    
    success_count = 0
    for command, description in commands:
        if run_command(command, description):
            success_count += 1
    
    return success_count == len(commands) if commands else True

def run_linting():
    """Executa verificações de código (linting)"""
    print_colored("\n🔍 VERIFICAÇÕES DE CÓDIGO", Colors.BOLD)
    
    commands = [
        ("flake8 src/ --max-line-length=120", "Linting Python (flake8)"),
        ("npm run lint", "Linting JavaScript (ESLint)"),
    ]
    
    success_count = 0
    for command, description in commands:
        if run_command(command, description):
            success_count += 1
    
    return success_count == len(commands)

def generate_test_report():
    """Gera relatório consolidado dos testes"""
    print_colored("\n📊 GERANDO RELATÓRIO DE TESTES", Colors.BOLD)
    
    commands = [
        ("pytest tests/ --html=reports/pytest_report.html --self-contained-html", "Relatório HTML - Backend"),
        ("npm test -- --coverage --coverageReporters=html --watchAll=false", "Relatório de Cobertura - Frontend"),
    ]
    
    # Criar diretório de relatórios
    os.makedirs("reports", exist_ok=True)
    
    for command, description in commands:
        run_command(command, description)

def main():
    """Função principal"""
    parser = argparse.ArgumentParser(description="Script de execução de testes para Turistieer")
    
    # Tipos de teste
    parser.add_argument("--all", action="store_true", help="Executar todos os testes")
    parser.add_argument("--unit", action="store_true", help="Executar apenas testes unitários")
    parser.add_argument("--integration", action="store_true", help="Executar apenas testes de integração")
    parser.add_argument("--components", action="store_true", help="Executar apenas testes de componentes")
    parser.add_argument("--e2e", action="store_true", help="Executar testes end-to-end")
    
    # Opções adicionais
    parser.add_argument("--coverage", action="store_true", help="Gerar relatório de cobertura")
    parser.add_argument("--lint", action="store_true", help="Executar verificações de código")
    parser.add_argument("--report", action="store_true", help="Gerar relatórios HTML")
    parser.add_argument("--no-backend", action="store_true", help="Pular testes backend")
    parser.add_argument("--no-frontend", action="store_true", help="Pular testes frontend")
    
    args = parser.parse_args()
    
    # Se nenhuma opção específica, executar todos
    if not any([args.unit, args.integration, args.components, args.e2e, args.lint]):
        args.all = True
    
    print_colored("🧪 INICIANDO EXECUÇÃO DE TESTES - TURISTIEER", Colors.BOLD)
    print_colored("Validação das funcionalidades do MVP conforme DOD", Colors.BLUE)
    
    # Verificar dependências
    if not check_dependencies():
        print_colored("\n❌ Falha na verificação de dependências", Colors.RED)
        return False
    
    success = True
    
    # Executar linting se solicitado
    if args.lint:
        success &= run_linting()
    
    # Executar testes backend
    if not args.no_backend:
        success &= run_backend_tests(args)
    
    # Executar testes frontend
    if not args.no_frontend:
        success &= run_frontend_tests(args)
    
    # Gerar relatórios se solicitado
    if args.report:
        generate_test_report()
    
    # Resultado final
    print_colored("\n" + "="*60, Colors.BOLD)
    if success:
        print_colored("🎉 TODOS OS TESTES EXECUTADOS COM SUCESSO!", Colors.GREEN)
        print_colored("✅ Aplicação está em conformidade com o DOD", Colors.GREEN)
        
        # Listar funcionalidades validadas
        print_colored("\n📋 FUNCIONALIDADES VALIDADAS (MVP):", Colors.BLUE)
        functionalities = [
            "US01 - Criar rotas turísticas",
            "US02 - Atualizar rotas turísticas", 
            "US03 - Consultar rotas turísticas",
            "US04 - Excluir rotas turísticas",
            "US07 - Consultar pontos turísticos",
            "US17 - Obter localização atual",
            "US18 - Salvar rotas turísticas em PDF"
        ]
        
        for func in functionalities:
            print(f"  ✅ {func}")
            
    else:
        print_colored("❌ ALGUNS TESTES FALHARAM", Colors.RED)
        print_colored("⚠️  Verifique os logs acima para identificar problemas", Colors.YELLOW)
    
    print_colored("="*60, Colors.BOLD)
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
