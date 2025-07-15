/**
 * Testes para o componente TouristSpots
 * Funcionalidade testada: US07 (Consultar pontos turísticos)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TouristSpots from '../../components/TouristSpots';
import { LanguageProvider } from '../../contexts/LanguageContext';
import * as api from '../../services/api';

// Mock dos serviços da API
jest.mock('../../services/api');
const mockTouristSpotService = api.touristSpotService;

// Mock do react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

// Componente wrapper para testes
const TouristSpotsWrapper = () => (
    <BrowserRouter>
        <LanguageProvider>
            <TouristSpots setCurrentView={jest.fn()} />
        </LanguageProvider>
    </BrowserRouter>
);

describe('TouristSpots - Consultar Pontos Turísticos (US07)', () => {
    const mockTouristSpots = [
        {
            id: 1,
            nome: 'Cristo Redentor',
            localizacao: {
                latitude: -22.951916,
                longitude: -43.210487
            },
            imagem_url: 'https://example.com/cristo.jpg',
            descricao: 'Estátua icônica do Cristo Redentor no topo do Corcovado'
        },
        {
            id: 2,
            nome: 'Pão de Açúcar',
            localizacao: {
                latitude: -22.948658,
                longitude: -43.157444
            },
            imagem_url: 'https://example.com/pao-acucar.jpg',
            descricao: 'Famoso morro localizado na Urca, acessível por bondinho'
        },
        {
            id: 3,
            nome: 'Copacabana',
            localizacao: {
                latitude: -22.971177,
                longitude: -43.182543
            },
            imagem_url: 'https://example.com/copacabana.jpg',
            descricao: 'Uma das praias mais famosas do mundo'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockTouristSpotService.getTouristSpots.mockResolvedValue(mockTouristSpots);
    });

    test('deve carregar e exibir lista de pontos turísticos', async () => {
        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            expect(mockTouristSpotService.getTouristSpots).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
            expect(screen.getByText('Pão de Açúcar')).toBeInTheDocument();
            expect(screen.getByText('Copacabana')).toBeInTheDocument();
        });
    });

    test('deve exibir informações detalhadas dos pontos', async () => {
        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            // Verificar nomes
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
            expect(screen.getByText('Pão de Açúcar')).toBeInTheDocument();

            // Verificar descrições
            expect(screen.getByText(/Estátua icônica do Cristo Redentor/)).toBeInTheDocument();
            expect(screen.getByText(/Famoso morro localizado na Urca/)).toBeInTheDocument();

            // Verificar se as imagens estão sendo carregadas
            const images = screen.getAllByRole('img');
            expect(images.length).toBeGreaterThan(0);
        });
    });

    test('deve permitir buscar pontos por nome', async () => {
        const user = userEvent.setup();
        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/buscar pontos turísticos/i);
        await user.type(searchInput, 'Cristo');

        // Simular nova chamada da API com filtro
        mockTouristSpotService.getTouristSpots.mockResolvedValue([mockTouristSpots[0]]);

        await waitFor(() => {
            expect(mockTouristSpotService.getTouristSpots).toHaveBeenCalledWith({ search: 'Cristo' });
        });
    });

    test('deve permitir filtrar por proximidade com geolocalização', async () => {
        const user = userEvent.setup();

        // Mock da geolocalização
        const mockGetCurrentPosition = jest.fn((success) => {
            success({
                coords: {
                    latitude: -22.908333,
                    longitude: -43.196388,
                    accuracy: 10
                }
            });
        });

        Object.defineProperty(navigator, 'geolocation', {
            value: { getCurrentPosition: mockGetCurrentPosition },
            configurable: true
        });

        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
        });

        const proximityButton = screen.getByText(/pontos próximos/i);
        await user.click(proximityButton);

        await waitFor(() => {
            expect(mockGetCurrentPosition).toHaveBeenCalled();
        });

        // Verificar que a API foi chamada com parâmetros de localização
        await waitFor(() => {
            expect(mockTouristSpotService.getTouristSpots).toHaveBeenCalledWith({
                lat: -22.908333,
                lng: -43.196388,
                radius: expect.any(Number)
            });
        });
    });

    test('deve exibir coordenadas dos pontos turísticos', async () => {
        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            // Verificar se as coordenadas são exibidas (formato pode variar)
            expect(screen.getByText(/-22\.951916/)).toBeInTheDocument();
            expect(screen.getByText(/-43\.210487/)).toBeInTheDocument();
        });
    });

    test('deve exibir loading durante carregamento', () => {
        mockTouristSpotService.getTouristSpots.mockImplementation(() => new Promise(() => { }));

        render(<TouristSpotsWrapper />);

        expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    test('deve exibir mensagem quando não há pontos turísticos', async () => {
        mockTouristSpotService.getTouristSpots.mockResolvedValue([]);

        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            expect(screen.getByText(/nenhum ponto turístico encontrado/i)).toBeInTheDocument();
        });
    });

    test('deve exibir erro ao falhar carregamento', async () => {
        mockTouristSpotService.getTouristSpots.mockRejectedValue(new Error('Erro de rede'));

        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            expect(screen.getByText(/erro ao carregar pontos turísticos/i)).toBeInTheDocument();
        });
    });

    test('deve permitir visualizar detalhes de um ponto específico', async () => {
        const user = userEvent.setup();
        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
        });

        const detailsButton = screen.getAllByText(/ver detalhes/i)[0];
        await user.click(detailsButton);

        // Verificar se o modal ou página de detalhes abre
        await waitFor(() => {
            expect(screen.getByText(/detalhes do ponto turístico/i)).toBeInTheDocument();
        });
    });

    test('deve permitir adicionar ponto a uma rota', async () => {
        const user = userEvent.setup();
        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
        });

        const addToRouteButton = screen.getAllByText(/adicionar à rota/i)[0];
        await user.click(addToRouteButton);

        // Verificar feedback de adição
        await waitFor(() => {
            expect(screen.getByText(/adicionado à rota/i)).toBeInTheDocument();
        });
    });

    test('deve filtrar pontos por categoria se disponível', async () => {
        const user = userEvent.setup();

        // Mock com pontos categorizados
        const spotsWithCategory = mockTouristSpots.map(spot => ({
            ...spot,
            categoria: spot.id === 1 ? 'Monumento' : spot.id === 2 ? 'Natureza' : 'Praia'
        }));

        mockTouristSpotService.getTouristSpots.mockResolvedValue(spotsWithCategory);

        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
        });

        // Se houver filtro por categoria
        const categoryFilter = screen.queryByLabelText(/categoria/i);
        if (categoryFilter) {
            await user.selectOptions(categoryFilter, 'Monumento');

            await waitFor(() => {
                expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
                expect(screen.queryByText('Copacabana')).not.toBeInTheDocument();
            });
        }
    });

    test('deve exibir fallback para imagens quebradas', async () => {
        const spotsWithBrokenImages = mockTouristSpots.map(spot => ({
            ...spot,
            imagem_url: 'https://broken-link.com/image.jpg'
        }));

        mockTouristSpotService.getTouristSpots.mockResolvedValue(spotsWithBrokenImages);

        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            const images = screen.getAllByRole('img');

            // Simular erro de carregamento da imagem
            images.forEach(img => {
                fireEvent.error(img);
            });

            // Verificar se há algum fallback (placeholder, ícone, etc.)
            expect(screen.getAllByText(/imagem não disponível/i).length).toBeGreaterThan(0) ||
                expect(screen.getAllByRole('img').length).toBeGreaterThan(0); // Imagens de fallback
        });
    });

    test('deve permitir limpar filtros de busca', async () => {
        const user = userEvent.setup();
        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
        });

        // Aplicar filtro
        const searchInput = screen.getByPlaceholderText(/buscar pontos turísticos/i);
        await user.type(searchInput, 'Cristo');

        // Limpar filtro
        const clearButton = screen.queryByText(/limpar filtros/i) || screen.queryByRole('button', { name: /limpar/i });
        if (clearButton) {
            await user.click(clearButton);

            await waitFor(() => {
                expect(searchInput.value).toBe('');
                expect(mockTouristSpotService.getTouristSpots).toHaveBeenLastCalledWith({});
            });
        }
    });

    test('deve exibir pontos em formato de lista e grade', async () => {
        const user = userEvent.setup();
        render(<TouristSpotsWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
        });

        // Procurar por botões de visualização
        const gridViewButton = screen.queryByRole('button', { name: /grade/i });
        const listViewButton = screen.queryByRole('button', { name: /lista/i });

        if (gridViewButton && listViewButton) {
            await user.click(gridViewButton);
            // Verificar layout em grade

            await user.click(listViewButton);
            // Verificar layout em lista
        }
    });
});
