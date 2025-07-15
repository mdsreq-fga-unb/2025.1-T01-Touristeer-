/**
 * Testes para o componente RouteList
 * Funcionalidades testadas: US03, US04 (Consultar e excluir rotas turísticas)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RouteList from '../../components/RouteList';
import { LanguageProvider } from '../../contexts/LanguageContext';
import * as api from '../../services/api';

// Mock dos serviços da API
jest.mock('../../services/api');
const mockRouteService = api.routeService;

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Componente wrapper para testes
const RouteListWrapper = () => (
    <BrowserRouter>
        <LanguageProvider>
            <RouteList setCurrentView={jest.fn()} />
        </LanguageProvider>
    </BrowserRouter>
);

describe('RouteList - Consultar Rotas (US03)', () => {
    const mockRoutes = [
        {
            id: 1,
            nome: 'Rota Rio de Janeiro',
            data_inicio: '2025-08-15T09:00:00',
            pontos_turisticos: [
                { id: 1, nome: 'Cristo Redentor' },
                { id: 2, nome: 'Pão de Açúcar' }
            ],
            created_at: '2025-07-14T10:00:00'
        },
        {
            id: 2,
            nome: 'Rota São Paulo',
            data_inicio: '2025-08-20T14:00:00',
            pontos_turisticos: [
                { id: 3, nome: 'Museu do Ipiranga' }
            ],
            created_at: '2025-07-13T15:30:00'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockRouteService.getRoutes.mockResolvedValue(mockRoutes);
    });

    test('deve carregar e exibir lista de rotas', async () => {
        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(mockRouteService.getRoutes).toHaveBeenCalledWith(1);
        });

        await waitFor(() => {
            expect(screen.getByText('Rota Rio de Janeiro')).toBeInTheDocument();
            expect(screen.getByText('Rota São Paulo')).toBeInTheDocument();
        });
    });

    test('deve exibir informações detalhadas das rotas', async () => {
        render(<RouteListWrapper />);

        await waitFor(() => {
            // Verificar nome das rotas
            expect(screen.getByText('Rota Rio de Janeiro')).toBeInTheDocument();
            expect(screen.getByText('Rota São Paulo')).toBeInTheDocument();

            // Verificar datas formatadas
            expect(screen.getByText(/15\/08\/2025/)).toBeInTheDocument();
            expect(screen.getByText(/20\/08\/2025/)).toBeInTheDocument();

            // Verificar pontos turísticos
            expect(screen.getByText('Cristo Redentor')).toBeInTheDocument();
            expect(screen.getByText('Pão de Açúcar')).toBeInTheDocument();
            expect(screen.getByText('Museu do Ipiranga')).toBeInTheDocument();
        });
    });

    test('deve exibir contagem de pontos turísticos', async () => {
        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('2 pontos')).toBeInTheDocument(); // Rota Rio
            expect(screen.getByText('1 ponto')).toBeInTheDocument(); // Rota São Paulo
        });
    });

    test('deve exibir loading durante carregamento', () => {
        mockRouteService.getRoutes.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<RouteListWrapper />);

        expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    test('deve exibir mensagem quando não há rotas', async () => {
        mockRouteService.getRoutes.mockResolvedValue([]);

        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText(/nenhuma rota encontrada/i)).toBeInTheDocument();
        });
    });

    test('deve navegar para visualização de rota específica', async () => {
        const user = userEvent.setup();
        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Rota Rio de Janeiro')).toBeInTheDocument();
        });

        const visualizarButton = screen.getAllByText(/visualizar/i)[0];
        await user.click(visualizarButton);

        expect(mockNavigate).toHaveBeenCalledWith('/route/1');
    });

    test('deve navegar para edição de rota', async () => {
        const user = userEvent.setup();
        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Rota Rio de Janeiro')).toBeInTheDocument();
        });

        const editarButton = screen.getAllByText(/editar/i)[0];
        await user.click(editarButton);

        expect(mockNavigate).toHaveBeenCalledWith('/create-route?edit=1');
    });

    test('deve filtrar rotas por nome', async () => {
        const user = userEvent.setup();
        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Rota Rio de Janeiro')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/buscar rotas/i);
        await user.type(searchInput, 'Rio');

        // Verificar que apenas a rota do Rio aparece
        expect(screen.getByText('Rota Rio de Janeiro')).toBeInTheDocument();
        expect(screen.queryByText('Rota São Paulo')).not.toBeInTheDocument();
    });

    test('deve filtrar rotas por data', async () => {
        const user = userEvent.setup();
        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Rota Rio de Janeiro')).toBeInTheDocument();
        });

        // Filtrar por data específica
        const dateFilter = screen.getByLabelText(/filtrar por data/i);
        await user.type(dateFilter, '2025-08-15');

        // Verificar que apenas a rota da data selecionada aparece
        expect(screen.getByText('Rota Rio de Janeiro')).toBeInTheDocument();
        expect(screen.queryByText('Rota São Paulo')).not.toBeInTheDocument();
    });

    test('deve exibir erro ao falhar carregamento', async () => {
        mockRouteService.getRoutes.mockRejectedValue(new Error('Erro de rede'));

        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText(/erro ao carregar rotas/i)).toBeInTheDocument();
        });
    });
});

describe('RouteList - Excluir Rotas (US04)', () => {
    const mockRoutes = [
        {
            id: 1,
            nome: 'Rota para Deletar',
            data_inicio: '2025-08-15T09:00:00',
            pontos_turisticos: [{ id: 1, nome: 'Cristo Redentor' }],
            created_at: '2025-07-14T10:00:00'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockRouteService.getRoutes.mockResolvedValue(mockRoutes);
        mockRouteService.deleteRoute.mockResolvedValue({ message: 'Rota deletada com sucesso' });
    });

    test('deve confirmar antes de deletar rota', async () => {
        const user = userEvent.setup();
        // Mock do window.confirm
        window.confirm = jest.fn(() => false);

        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Rota para Deletar')).toBeInTheDocument();
        });

        const deleteButton = screen.getByText(/excluir/i);
        await user.click(deleteButton);

        expect(window.confirm).toHaveBeenCalledWith(
            expect.stringContaining('deletar')
        );
        expect(mockRouteService.deleteRoute).not.toHaveBeenCalled();
    });

    test('deve deletar rota após confirmação', async () => {
        const user = userEvent.setup();
        window.confirm = jest.fn(() => true);

        // Mock para atualizar lista após deleção
        mockRouteService.getRoutes
            .mockResolvedValueOnce(mockRoutes)
            .mockResolvedValueOnce([]); // Lista vazia após deleção

        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Rota para Deletar')).toBeInTheDocument();
        });

        const deleteButton = screen.getByText(/excluir/i);
        await user.click(deleteButton);

        await waitFor(() => {
            expect(mockRouteService.deleteRoute).toHaveBeenCalledWith(1);
        });

        // Verificar que a lista foi recarregada
        await waitFor(() => {
            expect(mockRouteService.getRoutes).toHaveBeenCalledTimes(2);
        });
    });

    test('deve exibir erro ao falhar deleção', async () => {
        const user = userEvent.setup();
        window.confirm = jest.fn(() => true);
        mockRouteService.deleteRoute.mockRejectedValue(new Error('Erro ao deletar'));

        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Rota para Deletar')).toBeInTheDocument();
        });

        const deleteButton = screen.getByText(/excluir/i);
        await user.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText(/erro ao deletar/i)).toBeInTheDocument();
        });
    });

    test('deve recarregar lista após deleção bem-sucedida', async () => {
        const user = userEvent.setup();
        window.confirm = jest.fn(() => true);

        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Rota para Deletar')).toBeInTheDocument();
        });

        const deleteButton = screen.getByText(/excluir/i);
        await user.click(deleteButton);

        await waitFor(() => {
            expect(mockRouteService.getRoutes).toHaveBeenCalledTimes(2); // Carregamento inicial + reload
        });
    });
});

describe('RouteList - Funcionalidades de Exportação (US18)', () => {
    const mockRoutes = [
        {
            id: 1,
            nome: 'Rota para PDF',
            data_inicio: '2025-08-15T09:00:00',
            pontos_turisticos: [{ id: 1, nome: 'Cristo Redentor' }]
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockRouteService.getRoutes.mockResolvedValue(mockRoutes);
        mockRouteService.exportRouteToPDF.mockResolvedValue(new Blob(['PDF content']));
    });

    test('deve permitir exportar rota para PDF', async () => {
        const user = userEvent.setup();

        // Mock da API de download
        const mockCreateObjectURL = jest.fn(() => 'blob:url');
        const mockRevokeObjectURL = jest.fn();
        global.URL.createObjectURL = mockCreateObjectURL;
        global.URL.revokeObjectURL = mockRevokeObjectURL;

        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Rota para PDF')).toBeInTheDocument();
        });

        const exportButton = screen.getByText(/exportar pdf/i);
        await user.click(exportButton);

        await waitFor(() => {
            expect(mockRouteService.exportRouteToPDF).toHaveBeenCalledWith(1);
        });
    });

    test('deve exibir erro ao falhar exportação PDF', async () => {
        const user = userEvent.setup();
        mockRouteService.exportRouteToPDF.mockRejectedValue(new Error('Erro na exportação'));

        render(<RouteListWrapper />);

        await waitFor(() => {
            expect(screen.getByText('Rota para PDF')).toBeInTheDocument();
        });

        const exportButton = screen.getByText(/exportar pdf/i);
        await user.click(exportButton);

        await waitFor(() => {
            expect(screen.getByText(/erro ao exportar/i)).toBeInTheDocument();
        });
    });
});
