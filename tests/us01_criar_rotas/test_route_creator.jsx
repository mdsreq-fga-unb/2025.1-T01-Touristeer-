/**
 * Testes para o componente RouteCreator - US01: Criar rotas turísticas
 * Valida a interface de criação de rotas turísticas
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RouteCreator from '../../../src/components/RouteCreator';
import { LanguageProvider } from '../../../src/contexts/LanguageContext';
import * as api from '../../../src/services/api';

// Mock dos serviços da API
jest.mock('../../../src/services/api');
const mockRouteService = api.routeService;
const mockTouristSpotService = api.touristSpotService;

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams()],
}));

// Componente wrapper para testes
const RouteCreatorWrapper = () => (
  <BrowserRouter>
    <LanguageProvider>
      <RouteCreator setCurrentView={jest.fn()} />
    </LanguageProvider>
  </BrowserRouter>
);

describe('US01 - Criar Rotas Turísticas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTouristSpotService.getTouristSpots.mockResolvedValue([
      {
        id: 1,
        nome: 'Cristo Redentor',
        localizacao: { latitude: -22.951916, longitude: -43.210487 },
        descricao: 'Estátua icônica'
      },
      {
        id: 2,
        nome: 'Pão de Açúcar',
        localizacao: { latitude: -22.948658, longitude: -43.157444 },
        descricao: 'Famoso morro'
      }
    ]);
  });

  test('deve renderizar formulário de criação de rota', () => {
    render(<RouteCreatorWrapper />);

    // Verificar elementos do formulário
    expect(screen.getByText('Nova Rota')).toBeInTheDocument();
    expect(screen.getByLabelText(/nome da rota/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de início/i)).toBeInTheDocument();
    expect(screen.getByText(/adicionar pontos turísticos/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar rota/i })).toBeInTheDocument();
  });

  test('deve validar campo nome obrigatório', async () => {
    const user = userEvent.setup();
    render(<RouteCreatorWrapper />);

    const submitButton = screen.getByRole('button', { name: /salvar rota/i });
    await user.click(submitButton);

    // Verificar mensagem de validação
    await waitFor(() => {
      expect(screen.getByText(/nome da rota é obrigatório/i)).toBeInTheDocument();
    });
  });

  test('deve validar campo data de início obrigatório', async () => {
    const user = userEvent.setup();
    render(<RouteCreatorWrapper />);

    // Preencher apenas o nome
    const nomeInput = screen.getByLabelText(/nome da rota/i);
    await user.type(nomeInput, 'Rota Teste');

    const submitButton = screen.getByRole('button', { name: /salvar rota/i });
    await user.click(submitButton);

    // Verificar mensagem de validação
    await waitFor(() => {
      expect(screen.getByText(/data de início é obrigatória/i)).toBeInTheDocument();
    });
  });

  test('deve permitir adicionar pontos turísticos', async () => {
    const user = userEvent.setup();
    render(<RouteCreatorWrapper />);

    // Esperar carregar pontos turísticos
    await waitFor(() => {
      expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
    });

    // Clicar no primeiro ponto turístico
    const cristoRedentor = screen.getByText('Cristo Redentor');
    await user.click(cristoRedentor);

    // Verificar se foi adicionado à rota
    expect(screen.getByText('Cristo Redentor')).toHaveClass('selected');
  });

  test('deve criar rota com dados válidos', async () => {
    const user = userEvent.setup();
    mockRouteService.createRoute.mockResolvedValue({
      id: 1,
      nome: 'Rota Rio Clássica',
      data_inicio: '2025-08-15T09:00:00',
      pontos_turisticos: [1, 2]
    });

    render(<RouteCreatorWrapper />);

    // Preencher formulário
    const nomeInput = screen.getByLabelText(/nome da rota/i);
    await user.type(nomeInput, 'Rota Rio Clássica');

    const dataInput = screen.getByLabelText(/data de início/i);
    await user.type(dataInput, '2025-08-15T09:00');

    // Esperar carregar e selecionar pontos
    await waitFor(() => {
      expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
    });

    const cristoRedentor = screen.getByText('Cristo Redentor');
    await user.click(cristoRedentor);

    // Submeter formulário
    const submitButton = screen.getByRole('button', { name: /salvar rota/i });
    await user.click(submitButton);

    // Verificar chamada da API
    await waitFor(() => {
      expect(mockRouteService.createRoute).toHaveBeenCalledWith({
        nome: 'Rota Rio Clássica',
        data_inicio: '2025-08-15T09:00',
        pontos_turisticos: [1]
      });
    });

    // Verificar redirecionamento
    expect(mockNavigate).toHaveBeenCalledWith('/routes');
  });

  test('deve exibir erro ao falhar na criação', async () => {
    const user = userEvent.setup();
    mockRouteService.createRoute.mockRejectedValue(new Error('Erro do servidor'));

    render(<RouteCreatorWrapper />);

    // Preencher dados mínimos
    const nomeInput = screen.getByLabelText(/nome da rota/i);
    await user.type(nomeInput, 'Rota Teste');

    const dataInput = screen.getByLabelText(/data de início/i);
    await user.type(dataInput, '2025-08-15T09:00');

    // Submeter formulário
    const submitButton = screen.getByRole('button', { name: /salvar rota/i });
    await user.click(submitButton);

    // Verificar mensagem de erro
    await waitFor(() => {
      expect(screen.getByText(/erro ao criar rota/i)).toBeInTheDocument();
    });
  });

  test('deve limpar formulário após criação bem-sucedida', async () => {
    const user = userEvent.setup();
    mockRouteService.createRoute.mockResolvedValue({ id: 1 });

    render(<RouteCreatorWrapper />);

    // Preencher e submeter
    const nomeInput = screen.getByLabelText(/nome da rota/i);
    await user.type(nomeInput, 'Rota Teste');

    const dataInput = screen.getByLabelText(/data de início/i);
    await user.type(dataInput, '2025-08-15T09:00');

    const submitButton = screen.getByRole('button', { name: /salvar rota/i });
    await user.click(submitButton);

    // Aguardar limpeza do formulário
    await waitFor(() => {
      expect(nomeInput.value).toBe('');
      expect(dataInput.value).toBe('');
    });
  });

  test('deve desabilitar botão durante envio', async () => {
    const user = userEvent.setup();
    // Simular resposta lenta
    mockRouteService.createRoute.mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<RouteCreatorWrapper />);

    // Preencher dados mínimos
    const nomeInput = screen.getByLabelText(/nome da rota/i);
    await user.type(nomeInput, 'Rota Teste');

    const dataInput = screen.getByLabelText(/data de início/i);
    await user.type(dataInput, '2025-08-15T09:00');

    const submitButton = screen.getByRole('button', { name: /salvar rota/i });
    await user.click(submitButton);

    // Verificar botão desabilitado
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/criando.../i)).toBeInTheDocument();
  });
});
