/**
 * Testes para o componente RouteCreator
 * Funcionalidades testadas: US01, US02 (Criar e atualizar rotas turísticas)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RouteCreator from '../../components/RouteCreator';
import { LanguageProvider } from '../../contexts/LanguageContext';
import * as api from '../../services/api';

// Mock dos serviços da API
jest.mock('../../services/api');
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
const RouteCreatorWrapper = ({ searchParams = '' }) => {
    // Mock URLSearchParams se necessário
    if (searchParams) {
        jest.doMock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useSearchParams: () => [new URLSearchParams(searchParams)],
        }));
    }

    return (
        <BrowserRouter>
            <LanguageProvider>
                <RouteCreator setCurrentView={jest.fn()} />
            </LanguageProvider>
        </BrowserRouter>
    );
};

describe('RouteCreator - Criar Rotas (US01)', () => {
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

        expect(screen.getByText('Nova Rota')).toBeInTheDocument();
        expect(screen.getByLabelText(/nome da rota/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/data de início/i)).toBeInTheDocument();
        expect(screen.getByText(/adicionar pontos turísticos/i)).toBeInTheDocument();
    });

    test('deve validar campos obrigatórios ao criar rota', async () => {
        const user = userEvent.setup();
        render(<RouteCreatorWrapper />);

        const submitButton = screen.getByRole('button', { name: /salvar rota/i });
        await user.click(submitButton);

        // Verificar se mensagens de validação aparecem
        await waitFor(() => {
            expect(screen.getByText(/nome da rota é obrigatório/i)).toBeInTheDocument();
        });
    });

    test('deve permitir preencher nome da rota', async () => {
        const user = userEvent.setup();
        render(<RouteCreatorWrapper />);

        const nomeInput = screen.getByLabelText(/nome da rota/i);
        await user.type(nomeInput, 'Rota Teste Rio de Janeiro');

        expect(nomeInput).toHaveValue('Rota Teste Rio de Janeiro');
    });

    test('deve permitir selecionar data e hora de início', async () => {
        const user = userEvent.setup();
        render(<RouteCreatorWrapper />);

        const dataInput = screen.getByLabelText(/data de início/i);
        await user.type(dataInput, '2025-08-15T09:00');

        expect(dataInput).toHaveValue('2025-08-15T09:00');
    });

    test('deve permitir adicionar pontos turísticos', async () => {
        const user = userEvent.setup();
        render(<RouteCreatorWrapper />);

        // Abrir seletor de pontos turísticos
        const addPointButton = screen.getByText(/adicionar ponto turístico/i);
        await user.click(addPointButton);

        await waitFor(() => {
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
        });

        // Selecionar um ponto
        const cristoOption = screen.getByText('Cristo Redentor');
        await user.click(cristoOption);

        // Verificar se foi adicionado
        expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
    });

    test('deve limitar máximo de 5 pontos turísticos', async () => {
        const user = userEvent.setup();
        render(<RouteCreatorWrapper />);

        // Mock para muitos pontos turísticos
        const muitosPontos = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            nome: `Ponto ${i + 1}`,
            localizacao: { latitude: -22.9, longitude: -43.2 }
        }));

        mockTouristSpotService.getTouristSpots.mockResolvedValue(muitosPontos);

        // Tentar adicionar 6 pontos (deve falhar)
        const addButton = screen.getByText(/adicionar ponto turístico/i);

        for (let i = 0; i < 6; i++) {
            await user.click(addButton);
            if (i < 5) {
                await waitFor(() => {
                    const pontoOption = screen.getByText(`Ponto ${i + 1}`);
                    fireEvent.click(pontoOption);
                });
            }
        }

        // Verificar mensagem de limite
        await waitFor(() => {
            expect(screen.getByText(/máximo de 5 pontos/i)).toBeInTheDocument();
        });
    });

    test('deve criar rota com sucesso', async () => {
        const user = userEvent.setup();
        mockRouteService.createRoute.mockResolvedValue({
            id: 1,
            nome: 'Rota Teste',
            data_inicio: '2025-08-15T09:00:00',
            pontos_turisticos: []
        });

        render(<RouteCreatorWrapper />);

        // Preencher formulário
        const nomeInput = screen.getByLabelText(/nome da rota/i);
        const dataInput = screen.getByLabelText(/data de início/i);

        await user.type(nomeInput, 'Rota Teste');
        await user.type(dataInput, '2025-08-15T09:00');

        // Adicionar pelo menos um ponto
        const addButton = screen.getByText(/adicionar ponto turístico/i);
        await user.click(addButton);

        await waitFor(() => {
            const cristoOption = screen.getByText('Cristo Redentor');
            fireEvent.click(cristoOption);
        });

        // Submeter formulário
        const submitButton = screen.getByRole('button', { name: /salvar rota/i });
        await user.click(submitButton);

        // Verificar se API foi chamada
        await waitFor(() => {
            expect(mockRouteService.createRoute).toHaveBeenCalledWith({
                nome: 'Rota Teste',
                data_inicio: expect.any(String),
                pontos_turisticos: expect.any(Array),
                user_id: 1
            });
        });

        // Verificar navegação
        expect(mockNavigate).toHaveBeenCalledWith('/routes');
    });

    test('deve exibir erro ao falhar criação da rota', async () => {
        const user = userEvent.setup();
        mockRouteService.createRoute.mockRejectedValue(new Error('Erro de servidor'));

        render(<RouteCreatorWrapper />);

        // Preencher formulário mínimo
        const nomeInput = screen.getByLabelText(/nome da rota/i);
        await user.type(nomeInput, 'Rota Erro');

        const dataInput = screen.getByLabelText(/data de início/i);
        await user.type(dataInput, '2025-08-15T09:00');

        // Submeter
        const submitButton = screen.getByRole('button', { name: /salvar rota/i });
        await user.click(submitButton);

        // Verificar mensagem de erro
        await waitFor(() => {
            expect(screen.getByText(/erro/i)).toBeInTheDocument();
        });
    });
});

describe('RouteCreator - Editar Rotas (US02)', () => {
    const mockRouteData = {
        id: 1,
        nome: 'Rota Existente',
        data_inicio: '2025-08-15T09:00:00',
        pontos_turisticos: [
            {
                id: 1,
                nome: 'Cristo Redentor',
                localizacao: { latitude: -22.951916, longitude: -43.210487 }
            }
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockRouteService.getRoute.mockResolvedValue(mockRouteData);
        mockTouristSpotService.getTouristSpots.mockResolvedValue([]);
    });

    test('deve carregar dados da rota para edição', async () => {
        // Mock para modo de edição
        jest.doMock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useSearchParams: () => [new URLSearchParams('edit=1')],
        }));

        render(<RouteCreatorWrapper searchParams="edit=1" />);

        await waitFor(() => {
            expect(mockRouteService.getRoute).toHaveBeenCalledWith('1');
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Rota Existente')).toBeInTheDocument();
        });
    });

    test('deve atualizar rota existente', async () => {
        const user = userEvent.setup();
        mockRouteService.updateRoute.mockResolvedValue(mockRouteData);

        render(<RouteCreatorWrapper searchParams="edit=1" />);

        // Aguardar carregamento
        await waitFor(() => {
            expect(screen.getByDisplayValue('Rota Existente')).toBeInTheDocument();
        });

        // Modificar nome
        const nomeInput = screen.getByDisplayValue('Rota Existente');
        await user.clear(nomeInput);
        await user.type(nomeInput, 'Rota Atualizada');

        // Submeter
        const submitButton = screen.getByRole('button', { name: /salvar rota/i });
        await user.click(submitButton);

        // Verificar chamada de atualização
        await waitFor(() => {
            expect(mockRouteService.updateRoute).toHaveBeenCalledWith('1', {
                nome: 'Rota Atualizada',
                data_inicio: expect.any(String),
                pontos_turisticos: expect.any(Array),
                user_id: 1
            });
        });
    });

    test('deve exibir loading durante carregamento da rota', () => {
        mockRouteService.getRoute.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<RouteCreatorWrapper searchParams="edit=1" />);

        expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });
});

describe('RouteCreator - Interações Gerais', () => {
    test('deve permitir cancelar e voltar para lista', async () => {
        const user = userEvent.setup();
        render(<RouteCreatorWrapper />);

        const backButton = screen.getByRole('button', { name: /voltar/i });
        await user.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/routes');
    });

    test('deve remover ponto turístico selecionado', async () => {
        const user = userEvent.setup();
        render(<RouteCreatorWrapper />);

        // Adicionar ponto
        const addButton = screen.getByText(/adicionar ponto turístico/i);
        await user.click(addButton);

        await waitFor(() => {
            const cristoOption = screen.getByText('Cristo Redentor');
            fireEvent.click(cristoOption);
        });

        // Remover ponto
        const removeButton = screen.getByRole('button', { name: /remover/i });
        await user.click(removeButton);

        expect(screen.queryByText('Cristo Redentor')).not.toBeInTheDocument();
    });
});
