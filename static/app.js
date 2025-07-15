// Configuração da API
const API_BASE_URL = window.location.origin + '/api';

// Estado da aplicação
let currentSection = 'routes';
let selectedSpots = [];
let allSpots = [];
let allRoutes = [];
let availableSpots = []; // Todos os pontos disponíveis (locais + externos)

// Elementos DOM
const sections = {
    routes: document.getElementById('routes-section'),
    spots: document.getElementById('spots-section'),
    create: document.getElementById('create-section')
};

const navButtons = {
    routes: document.getElementById('btn-routes'),
    spots: document.getElementById('btn-spots'),
    create: document.getElementById('btn-create')
};

// Variáveis para o mapa
let map = null;
let routeLayer = null;
let markersLayer = null;

// Variáveis para localização do usuário
let userLocation = null;
let isRequestingLocation = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    loadInitialData();
});

function initializeApp() {
    console.log('Inicializando aplicação...');
    showSection('routes');
}

function setupEventListeners() {
    // Navegação
    navButtons.routes.addEventListener('click', () => showSection('routes'));
    navButtons.spots.addEventListener('click', () => showSection('spots'));
    navButtons.create.addEventListener('click', () => showSection('create'));

    // Formulário de criação de rota
    const createForm = document.getElementById('create-route-form');
    createForm.addEventListener('submit', handleCreateRoute);

    // Seleção de pontos turísticos
    const btnSelectSpots = document.getElementById('btn-select-spots');
    btnSelectSpots.addEventListener('click', openSpotsModal);

    // Modal
    const modal = document.getElementById('spots-modal');
    const closeModal = document.querySelector('.close-modal');
    closeModal.addEventListener('click', closeSpotsModal);

    // Confirmar seleção de pontos
    const btnConfirmSpots = document.getElementById('btn-confirm-spots');
    btnConfirmSpots.addEventListener('click', confirmSpotSelection);

    // Busca de pontos turísticos
    const searchInput = document.getElementById('search-spots');
    const btnSearch = document.getElementById('btn-search');
    if (searchInput && btnSearch) {
        searchInput.addEventListener('input', debounce(filterSpots, 300));
        btnSearch.addEventListener('click', filterSpots);

        // Teste adicional - log quando o usuário digita
        searchInput.addEventListener('keyup', function (e) {
            console.log('Usuário digitou:', e.target.value);
        });
    } else {
        console.error('Elementos de busca não encontrados!');
    }

    // Busca no modal
    const modalSearchInput = document.getElementById('modal-search-spots');
    const modalBtnSearch = document.getElementById('modal-btn-search');
    if (modalSearchInput && modalBtnSearch) {
        modalSearchInput.addEventListener('input', debounce(filterModalSpots, 300));
        modalBtnSearch.addEventListener('click', filterModalSpots);

        // Mostrar/ocultar dicas de busca no modal
        modalSearchInput.addEventListener('input', function (e) {
            updateModalSearchHints(e.target.value.length);
        });

        console.log('Event listeners do modal configurados');
    } else {
        console.error('Elementos de busca do modal não encontrados!');
    }

    // Fechar modal clicando fora
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeSpotsModal();
        }
    });

    // Configurar validação de datas
    setupDateValidation();
}

// Função para configurar validação de datas futuras
function setupDateValidation() {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');

    // Definir data mínima como hoje
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    endDateInput.min = today;

    // Validação quando data de início muda
    startDateInput.addEventListener('change', function () {
        const startDate = this.value;

        // Data de fim não pode ser anterior à de início
        endDateInput.min = startDate;

        // Se data de fim já está definida e é anterior, limpar
        if (endDateInput.value && endDateInput.value < startDate) {
            endDateInput.value = '';
        }

        validateDateTime();
    });

    // Validação quando data de fim muda
    endDateInput.addEventListener('change', validateDateTime);
    startTimeInput.addEventListener('change', validateDateTime);
    endTimeInput.addEventListener('change', validateDateTime);
}

// Função para validar data e hora
function validateDateTime() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;

    if (!startDate || !startTime) return;

    // Criar objetos Date para comparação
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const now = new Date();

    // Verificar se data/hora de início é futura
    if (startDateTime <= now) {
        showNotification('⚠️ Data e horário de início devem ser futuros!', 'warning');
        return false;
    }

    // Se data de fim está definida, verificar ordem
    if (endDate && endTime) {
        const endDateTime = new Date(`${endDate}T${endTime}`);

        if (endDateTime <= startDateTime) {
            showNotification('⚠️ Data/horário de fim deve ser posterior ao início!', 'warning');
            return false;
        }
    }

    return true;
}

async function loadInitialData() {
    try {
        // Tentar obter localização do usuário primeiro
        await requestUserLocation();

        await Promise.all([
            loadRoutes(),
            loadTouristSpots()
        ]);
    } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        showNotification('Erro ao carregar dados iniciais', 'error');
    }
}

// Função para solicitar localização do usuário
async function requestUserLocation() {
    if (isRequestingLocation) return; // Evitar múltiplas requisições

    isRequestingLocation = true;
    console.log('🌍 Solicitando localização do usuário...');

    try {
        if (!navigator.geolocation) {
            throw new Error('Geolocalização não é suportada pelo navegador');
        }

        const position = await new Promise((resolve, reject) => {
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutos de cache
            };

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    console.log('✅ Localização obtida:', pos.coords);
                    resolve(pos);
                },
                (err) => {
                    console.error('❌ Erro de geolocalização:', err);
                    reject(err);
                },
                options
            );
        });

        userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
        };

        console.log('📍 Localização obtida e armazenada:', userLocation);
        showNotification('📍 Localização obtida! Recarregando pontos próximos...', 'success');
        updateLocationStatus(true);

        // RECARREGAR pontos turísticos com a nova localização
        if (currentSection === 'spots') {
            loadTouristSpots();
        }

    } catch (error) {
        console.error('Erro ao obter localização:', error);

        let errorMessage = 'Localização não disponível. Mostrando todos os pontos.';

        // Verificar se é problema de HTTPS (desenvolvimento local)
        if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
            errorMessage = '🔒 Geolocalização requer conexão segura (HTTPS). Para desenvolvimento local, use https://localhost ou configure SSL.';
        } else if (error.code === 1) {
            errorMessage = 'Acesso à localização negado. Para permitir: clique no ícone de localização na barra de endereços.';
        } else if (error.code === 2) {
            errorMessage = 'Localização não disponível. Verifique se GPS/Wi-Fi estão ativos.';
        } else if (error.code === 3) {
            errorMessage = 'Tempo limite esgotado para obter localização.';
        }

        showNotification(errorMessage, 'warning');
        updateLocationStatus(false, error.message);
    } finally {
        isRequestingLocation = false;
    }
}

async function loadRoutes() {
    try {
        showLoading('routes-list');
        const response = await fetch(`${API_BASE_URL}/routes`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const routes = await response.json();
        allRoutes = routes;
        displayRoutes(routes);
    } catch (error) {
        console.error('Erro ao carregar rotas:', error);
        document.getElementById('routes-list').innerHTML = `
            <div class="empty-state">
                <p>Erro ao carregar rotas. Tente novamente mais tarde.</p>
                <button class="btn btn-primary" onclick="loadRoutes()">
                    <i class="fas fa-redo"></i> Tentar Novamente
                </button>
            </div>
        `;
    }
}

async function loadTouristSpots() {
    try {
        showLoading('spots-list');
        console.log('🏃 Iniciando carregamento de pontos turísticos...');
        console.log('📍 Localização disponível:', userLocation ? 'SIM' : 'NÃO');

        let spots = [];

        // Sempre carregar pontos do arquivo local primeiro
        console.log('📁 Carregando pontos do arquivo local...');
        try {
            const response = await fetch('/tourist_spots.json');
            const data = await response.json();
            const localSpots = data.tourist_spots || data;
            console.log(`📊 Pontos locais carregados: ${localSpots.length}`);
            
            spots = localSpots;
        } catch (error) {
            console.log('❌ Erro ao carregar pontos locais:', error);
        }

        // Se temos localização, buscar também pontos próximos da API externa
        if (userLocation && spots.length < 20) {
            console.log('🌐 Buscando pontos próximos da API externa...');
            try {
                // Usar API do Nominatim diretamente para buscar pontos próximos
                const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=20&addressdetails=1&extratags=1&namedetails=1&q=tourism&bounded=1&viewbox=${userLocation.longitude-0.3},${userLocation.latitude+0.3},${userLocation.longitude+0.3},${userLocation.latitude-0.3}`;
                
                const nominatimResponse = await fetch(nominatimUrl);
                if (nominatimResponse.ok) {
                    const nominatimData = await nominatimResponse.json();
                    console.log(`🌐 Nominatim retornou: ${nominatimData.length} pontos`);
                    
                    // Processar pontos do Nominatim
                    const externalSpots = nominatimData.map(item => {
                        const lat = parseFloat(item.lat);
                        const lng = parseFloat(item.lon);
                        
                        // Calcular distância
                        const distance = calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            lat,
                            lng
                        );
                        
                        return {
                            id: `ext_${item.place_id}`,
                            nome: item.display_name.split(',')[0] || item.name || 'Ponto Turístico',
                            descricao: `${item.type} - 📍 ${item.display_name}`,
                            categoria: `Turismo - ${item.type?.charAt(0)?.toUpperCase() + item.type?.slice(1) || 'Atrativo'}`,
                            localizacao: {
                                latitude: lat,
                                longitude: lng
                            },
                            distance: distance,
                            source: 'nominatim',
                            importance: item.importance || 0
                        };
                    }).filter(spot => spot.distance <= 30); // Filtrar até 30km
                    
                    console.log(`🎯 Pontos externos próximos (≤30km): ${externalSpots.length}`);
                    
                    // Adicionar pontos externos aos locais
                    spots = [...spots, ...externalSpots];
                }
            } catch (externalError) {
                console.log('⚠️ Erro na busca externa:', externalError);
            }
        }

        // Se temos localização, calcular distâncias e filtrar/ordenar
        if (userLocation) {
            console.log('📐 Calculando distâncias e filtrando por proximidade...');
            
            spots = spots.map(spot => {
                if (spot.localizacao) {
                    const distance = calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        spot.localizacao.latitude,
                        spot.localizacao.longitude
                    );
                    return { ...spot, distance };
                }
                return { ...spot, distance: Infinity };
            })
            .filter(spot => spot.distance <= 50) // FILTRAR: apenas pontos até 50km
            .sort((a, b) => a.distance - b.distance); // ORDENAR: por proximidade

            console.log(`🎯 Pontos filtrados (≤50km): ${spots.length}`);
            
            if (spots.length > 0) {
                console.log('🏆 5 pontos mais próximos:', spots.slice(0, 5).map(s => ({ 
                    nome: s.nome, 
                    distance: s.distance?.toFixed(2) + 'km',
                    categoria: s.categoria 
                })));
                
                console.log('📊 Estatísticas dos pontos próximos:');
                console.log('- Mais próximo:', spots[0]?.distance?.toFixed(2) + 'km');
                console.log('- Mais distante:', spots[spots.length-1]?.distance?.toFixed(2) + 'km');
                console.log('- Dentro de 5km:', spots.filter(s => s.distance <= 5).length);
                console.log('- Dentro de 15km:', spots.filter(s => s.distance <= 15).length);
                console.log('- Dentro de 30km:', spots.filter(s => s.distance <= 30).length);
            }
        } else {
            console.log('❌ Sem localização - mostrando todos os pontos');
        }

        allSpots = spots;
        availableSpots = [...spots];
        console.log(`✅ Total de pontos carregados: ${allSpots.length}`);
        
        displayTouristSpots(spots);
        populateModalSpots(spots);
        
        // Mostrar mensagem sobre localização
        if (userLocation && spots.length > 0) {
            showNotification(`📍 Mostrando ${spots.length} pontos turísticos próximos (até 50km)`, 'success');
        } else if (userLocation && spots.length === 0) {
            showNotification('📍 Nenhum ponto turístico encontrado próximo à sua localização', 'warning');
        } else if (!userLocation) {
            showNotification('📍 Para ver pontos próximos, permita acesso à localização', 'info');
        }
        
    } catch (error) {
        console.error('Erro ao carregar pontos turísticos:', error);
        document.getElementById('spots-list').innerHTML = `
            <div class="empty-state">
                <p>Erro ao carregar pontos turísticos.</p>
                <button class="btn btn-primary" onclick="loadTouristSpots()">
                    <i class="fas fa-redo"></i> Tentar Novamente
                </button>
            </div>
        `;
    }
}

function displayRoutes(routes) {
    const container = document.getElementById('routes-list');

    if (!routes || routes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-route" style="font-size: 3rem; margin-bottom: 1rem; color: #ccc;"></i>
                <p>Nenhuma rota encontrada</p>
                <p style="color: #999; font-size: 0.9rem;">Crie sua primeira rota turística!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = routes.map(route => `
        <div class="route-card" data-route-id="${route.id}">
            <div class="card-header">
                <div>
                    <h3 class="card-title">${route.nome}</h3>
                    <div class="card-date">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(route.data_inicio)} ${route.data_fim ? '- ' + formatDate(route.data_fim) : ''}
                    </div>
                </div>
            </div>
            
            ${route.descricao ? `<p class="card-description">${route.descricao}</p>` : ''}
            
            <div class="card-spots">
                ${(route.pontos_turisticos || []).slice(0, 3).map(spot =>
        `<span class="spot-tag">${spot.nome || spot}</span>`
    ).join('')}
                ${(route.pontos_turisticos || []).length > 3 ?
            `<span class="spot-tag">+${(route.pontos_turisticos || []).length - 3} mais</span>` : ''}
            </div>
            
            <div class="card-actions">
                <button class="btn btn-small btn-view-route" onclick="viewRouteWithMap(${route.id})">
                    <i class="fas fa-map"></i> Ver Rota
                </button>
                <button class="btn btn-small btn-primary" onclick="editRoute(${route.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-small btn-secondary" onclick="exportRoutePDF(${route.id})">
                    <i class="fas fa-file-pdf"></i> PDF
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteRoute(${route.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function displayTouristSpots(spots) {
    const container = document.getElementById('spots-list');
    console.log('🎯 displayTouristSpots chamado com:', spots.length, 'pontos');
    console.log('🔍 Primeiros 3 pontos:', spots.slice(0, 3));

    if (!spots || spots.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt" style="font-size: 3rem; margin-bottom: 1rem; color: #ccc;"></i>
                <p>Nenhum ponto turístico encontrado</p>
                <p style="color: #999; font-size: 0.9rem;">Tente uma busca mais específica</p>
            </div>
        `;
        return;
    }

    container.innerHTML = spots.map(spot => {
        // Extrair localização
        let locationText = 'Localização não informada';
        if (spot.localizacao) {
            locationText = `Lat: ${spot.localizacao.latitude}, Lng: ${spot.localizacao.longitude}`;
        } else if (spot.cidade) {
            locationText = spot.cidade;
        }

        // Determinar se é ponto externo
        const isExternal = spot.source === 'nominatim' || (spot.id && spot.id.toString().startsWith('ext_'));

        console.log(`🖼️ Processando ponto: ${spot.nome}, imagem_url: ${spot.imagem_url ? 'SIM' : 'NÃO'}`);

        return `
            <div class="spot-card" data-spot-id="${spot.id}">
                <div class="card-header">
                    <h3 class="card-title">${spot.nome}</h3>
                    <span class="spot-tag ${isExternal ? 'external' : ''}">${spot.categoria || 'Turismo'}</span>
                    ${isExternal ? '<span class="spot-tag external-indicator">🌐 Externo</span>' : ''}
                </div>
                
                ${spot.descricao ? `<p class="card-description">${spot.descricao}</p>` : ''}
                
                <div style="margin-top: 1rem;">
                    <p style="color: #666; font-size: 0.9rem;">
                        <i class="fas fa-map-marker-alt"></i>
                        ${locationText}
                    </p>
                    ${spot.endereco && spot.endereco !== spot.descricao ?
                `<p style="color: #999; font-size: 0.8rem; margin-top: 0.5rem;"><i class="fas fa-location-arrow"></i> ${spot.endereco}</p>` : ''}
                    ${spot.categoria && spot.categoria !== 'Turismo' ?
                `<p style="color: #007bff; font-size: 0.8rem; margin-top: 0.5rem;"><i class="fas fa-tag"></i> ${spot.categoria}</p>` : ''}
                    ${isExternal && spot.importance ?
                `<p style="color: #666; font-size: 0.8rem; margin-top: 0.5rem;"><i class="fas fa-star"></i> Relevância: ${(spot.importance * 100).toFixed(1)}%</p>` : ''}
                </div>
                
                ${spot.imagem_url ? `
                    <div style="margin-top: 1rem;">
                        <img src="${spot.imagem_url}" alt="${spot.nome}" 
                             style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; cursor: pointer;"
                             onclick="openImageModal('${spot.imagem_url}', '${spot.nome}')"
                             onerror="handleImageError(this)"
                             title="Clique para ampliar">
                    </div>
                ` : `
                    <div class="image-placeholder" style="width: 100%; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; justify-content: center; align-items: center; color: white; margin-top: 1rem;">
                        <div style="text-align: center;">
                            <i class="fas fa-map-marker-alt" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                            <p style="margin: 0; font-size: 0.9rem;">Imagem não disponível</p>
                        </div>
                    </div>
                `}
            </div>
        `;
    }).join('');
}

function populateModalSpots(spots) {
    const container = document.getElementById('modal-spots-list');

    if (!spots || spots.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>Nenhum ponto encontrado</p>
                <p style="font-size: 0.9rem;">Tente termos diferentes</p>
            </div>
        `;
        return;
    }

    container.innerHTML = spots.map(spot => {
        const isExternal = spot.source === 'nominatim' || (spot.id && spot.id.toString().startsWith('ext_'));
        const isSelected = selectedSpots.some(s => s.id === spot.id);

        return `
            <div class="modal-spot-card ${isSelected ? 'selected' : ''}" 
                 data-spot-id="${spot.id}" 
                 onclick="toggleSpotSelection('${spot.id}')"
                 style="position: relative;">
                
                ${isExternal ? '<div style="position: absolute; top: 0.5rem; right: 0.5rem; background: #3b82f6; color: white; padding: 0.2rem 0.5rem; border-radius: 0.2rem; font-size: 0.7rem;">🌐 Externo</div>' : ''}
                
                <h4>${spot.nome}</h4>
                <p>${spot.descricao || spot.cidade || ''}</p>
                
                ${isExternal ? '<p style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;"><i class="fas fa-globe"></i> OpenStreetMap</p>' : ''}
                
                ${isSelected ? '<div style="position: absolute; bottom: 0.5rem; right: 0.5rem; color: #10b981;"><i class="fas fa-check-circle"></i></div>' : ''}
            </div>
        `;
    }).join('');

    // Atualizar contador após popular os pontos
    setTimeout(() => {
        updateModalSpotSelection();
    }, 100);
}

function showSection(sectionName) {
    // Atualizar navegação
    Object.values(navButtons).forEach(btn => btn.classList.remove('active'));
    navButtons[sectionName].classList.add('active');

    // Mostrar seção
    Object.values(sections).forEach(section => section.classList.remove('active'));
    sections[sectionName].classList.add('active');

    currentSection = sectionName;
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Carregando...
        </div>
    `;
}

async function handleCreateRoute(event) {
    event.preventDefault();

    // Validar data e hora antes de prosseguir
    if (!validateDateTime()) {
        return;
    }

    const startDate = document.getElementById('start-date').value;
    const startTime = document.getElementById('start-time').value;
    const endDate = document.getElementById('end-date').value;
    const endTime = document.getElementById('end-time').value;

    // Combinar data e hora
    const dataInicio = `${startDate}T${startTime}`;
    const dataFim = endDate && endTime ? `${endDate}T${endTime}` : null;

    const routeData = {
        nome: document.getElementById('route-name').value,
        descricao: document.getElementById('route-description').value,
        data_inicio: dataInicio,
        data_fim: dataFim,
        pontos_turisticos: selectedSpots.map(spot => ({
            id: spot.id,
            nome: spot.nome,
            descricao: spot.descricao,
            localizacao: spot.localizacao
        }))
    };

    try {
        // Primeiro, calcular a melhor rota
        if (selectedSpots.length >= 2) {
            showNotification('Calculando melhor rota...', 'info');
            const routeCalculation = await calculateOptimalRoute(selectedSpots);

            if (routeCalculation) {
                // Perguntar se o usuário quer usar a ordem otimizada (sem mostrar preview)
                const useOptimized = confirm(
                    `Rota otimizada calculada!\n` +
                    `Distância total: ${routeCalculation.total_distance} km\n` +
                    `Tempo estimado: ${routeCalculation.estimated_time} minutos\n\n` +
                    `Deseja usar a ordem otimizada dos pontos?`
                );

                if (useOptimized && routeCalculation.optimized_points) {
                    // Atualizar selectedSpots com a ordem otimizada
                    selectedSpots = routeCalculation.optimized_points;
                    updateSelectedSpotsDisplay();
                    routeData.pontos_turisticos = selectedSpots.map(spot => ({
                        id: spot.id,
                        nome: spot.nome,
                        descricao: spot.descricao,
                        localizacao: spot.localizacao
                    }));
                }
            }
        }

        // Criar a rota
        const response = await fetch(`${API_BASE_URL}/routes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(routeData)
        });

        if (response.ok) {
            const newRoute = await response.json();
            showNotification('Rota criada com sucesso!', 'success');

            // Limpar formulário
            event.target.reset();
            selectedSpots = [];
            updateSelectedSpotsDisplay();

            // Carregar rotas atualizadas
            loadRoutes();

            // Mostrar rota criada
            showSection('routes');

        } else {
            throw new Error('Erro ao criar rota');
        }
    } catch (error) {
        console.error('Erro ao criar rota:', error);
        showNotification('Erro ao criar rota. Tente novamente.', 'error');
    }
}

async function calculateOptimalRoute(points) {
    try {
        const response = await fetch(`${API_BASE_URL}/calculate-route`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ points: points })
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.log('Erro ao calcular rota otimizada');
            return null;
        }
    } catch (error) {
        console.error('Erro no cálculo da rota:', error);
        return null;
    }
}

function showRoutePreview(routeData) {
    // Criar modal de preview da rota
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'route-preview-modal';

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🗺️ Preview da Rota Otimizada</h3>
                <button class="close-modal" onclick="closeRoutePreview()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="route-stats">
                    <div class="stat-item">
                        <i class="fas fa-route"></i>
                        <span>Distância Total: <strong>${routeData.total_distance} km</strong></span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-clock"></i>
                        <span>Tempo Estimado: <strong>${Math.floor(routeData.estimated_time / 60)}h ${routeData.estimated_time % 60}min</strong></span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Pontos: <strong>${routeData.optimized_points?.length || 0}</strong></span>
                    </div>
                </div>
                
                <h4>Sequência Otimizada:</h4>
                <div class="route-sequence">
                    ${(routeData.optimized_points || []).map((point, index) => `
                        <div class="sequence-item">
                            <span class="sequence-number">${index + 1}</span>
                            <span class="sequence-name">${point.nome}</span>
                            ${index < (routeData.optimized_points?.length || 0) - 1 ?
            `<div class="sequence-arrow">
                                    <i class="fas fa-arrow-down"></i>
                                    <small>${routeData.route_data?.segments?.[index]?.distance?.toFixed(1) || '--'} km</small>
                                </div>` : ''
        }
                        </div>
                    `).join('')}
                </div>
                
                <div id="route-map" style="height: 300px; margin-top: 1rem; border-radius: 10px;"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeRoutePreview()">Fechar</button>
                <button class="btn btn-primary" onclick="acceptOptimizedRoute()">Usar Esta Ordem</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Inicializar mapa no modal
    setTimeout(() => initRouteMap(routeData), 100);
}

function closeRoutePreview() {
    const modal = document.getElementById('route-preview-modal');
    if (modal) {
        modal.remove();
    }
}

function acceptOptimizedRoute() {
    closeRoutePreview();
    // A ordem já foi aceita no handleCreateRoute
}

async function viewRouteWithMap(routeId) {
    try {
        console.log('Carregando rota com ID:', routeId);
        const response = await fetch(`${API_BASE_URL}/routes/${routeId}`);

        if (response.ok) {
            const route = await response.json();
            console.log('Rota carregada:', route);

            // Calcular dados da rota se tiver pontos
            let routeData = null;
            if (route.pontos_turisticos && route.pontos_turisticos.length >= 2) {
                console.log('Calculando rota REAL...');
                try {
                    // Tentar primeiro a API de rota real
                    const realRouteResponse = await fetch(`${API_BASE_URL}/calculate-real-route`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ points: route.pontos_turisticos })
                    });

                    if (realRouteResponse.ok) {
                        routeData = await realRouteResponse.json();
                        console.log('Rota REAL calculada:', routeData);
                    } else {
                        console.log('API de rota real falhou, usando aproximação...');
                        // Fallback para rota aproximada
                        const calcResponse = await fetch(`${API_BASE_URL}/calculate-route`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ points: route.pontos_turisticos })
                        });

                        if (calcResponse.ok) {
                            routeData = await calcResponse.json();
                            console.log('Dados da rota aproximados:', routeData);
                        }
                    }
                } catch (calcError) {
                    console.error('Erro no cálculo da rota:', calcError);
                }
            }

            showRouteDetailsWithMap(route, routeData);
        } else {
            console.error('Erro ao carregar rota, status:', response.status);
            showNotification('Erro ao carregar rota', 'error');
        }
    } catch (error) {
        console.error('Erro ao carregar rota:', error);
        showNotification('Erro ao carregar detalhes da rota', 'error');
    }
}

function showRouteDetailsWithMap(route, routeData) {
    console.log('Mostrando detalhes da rota:', route);
    console.log('Dados da rota:', routeData);

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'route-details-modal';
    modal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3>🗺️ ${route.nome}</h3>
                <button class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="route-info">
                    <p><strong>Descrição:</strong> ${route.descricao || 'Não informada'}</p>
                    <p><strong>Data:</strong> ${formatDateTime(route.data_inicio)} ${route.data_fim ? '- ' + formatDateTime(route.data_fim) : ''}</p>
                    <p><strong>Total de pontos:</strong> ${(route.pontos_turisticos || []).length}</p>
                    
                    ${userLocation ? `
                        <div class="user-location">
                            <p><strong>📍 Sua localização atual:</strong></p>
                            <p style="color: #666; font-size: 0.9rem;">
                                Lat: ${userLocation.latitude.toFixed(6)}, Lng: ${userLocation.longitude.toFixed(6)}
                                <span style="margin-left: 10px;">📊 Precisão: ${userLocation.accuracy?.toFixed(0)}m</span>
                            </p>
                        </div>
                    ` : `
                        <div class="user-location">
                            <p style="color: #999; font-style: italic;">📍 Localização não disponível</p>
                            <button onclick="requestUserLocationForRoute()" class="btn btn-small btn-secondary">
                                <i class="fas fa-location-arrow"></i> Obter Localização
                            </button>
                        </div>
                    `}
                    
                    ${routeData ? `
                        <div class="route-stats">
                            <div class="stat-item">
                                <i class="fas fa-route"></i>
                                <span>Distância: <strong>${routeData.total_distance} km</strong></span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-clock"></i>
                                <span>Tempo: <strong>${Math.floor(routeData.estimated_time / 60)}h ${routeData.estimated_time % 60}min</strong></span>
                            </div>
                        </div>
                    ` : '<p style="color: #999; font-style: italic;">Dados da rota não calculados</p>'}
                </div>
                
                <div id="route-detail-map" style="height: 400px; margin: 1rem 0; border-radius: 10px; border: 2px solid #ddd; background: #f0f8ff;">
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">
                        <i class="fas fa-spinner fa-spin" style="margin-right: 10px;"></i>
                        Carregando mapa...
                    </div>
                </div>
                
                <h4>Pontos da Rota:</h4>
                <div class="route-points">
                    ${(route.pontos_turisticos || []).length === 0 ?
            '<p style="color: #999; font-style: italic;">Nenhum ponto turístico adicionado a esta rota</p>' :
            (route.pontos_turisticos || []).map((spot, index) => `
                            <div class="point-item">
                                <span class="point-number">${index + 1}</span>
                                <div class="point-details">
                                    <strong>${spot.nome || spot}</strong>
                                    ${spot.descricao ? `<p>${spot.descricao}</p>` : ''}
                                    ${spot.localizacao ? `<small style="color: #666;">Lat: ${spot.localizacao.latitude}, Lng: ${spot.localizacao.longitude}</small>` : ''}
                                </div>
                            </div>
                        `).join('')
        }
                </div>
            </div>
        </div>
    `;

    // Remover modal anterior se existir
    const existingModal = document.getElementById('route-details-modal');
    if (existingModal) {
        existingModal.remove();
    }

    document.body.appendChild(modal);
    console.log('Modal criado e adicionado ao DOM');

    // Inicializar mapa com delay maior
    setTimeout(() => {
        console.log('Inicializando mapa da rota...');
        initRouteDetailMap(route, routeData);
    }, 200);
}

function initRouteMap(routeData) {
    const mapContainer = document.getElementById('route-map');
    if (!mapContainer || !routeData.optimized_points || routeData.optimized_points.length === 0) {
        return;
    }

    // Verificar se o Leaflet está disponível
    if (typeof L === 'undefined') {
        console.warn('Leaflet não disponível, usando mapa simulado');
        initSimulatedMap(mapContainer, routeData.optimized_points, routeData);
        return;
    }

    // Limpar container
    mapContainer.innerHTML = '';
    mapContainer.style.height = '300px'; // Garantir altura

    // Calcular centro do mapa baseado nos pontos
    let centerLat = 0, centerLng = 0, validPoints = 0;

    routeData.optimized_points.forEach(point => {
        if (point.localizacao) {
            centerLat += point.localizacao.latitude;
            centerLng += point.localizacao.longitude;
            validPoints++;
        }
    });

    if (validPoints === 0) {
        centerLat = -15.7801;
        centerLng = -47.9292;
    } else {
        centerLat /= validPoints;
        centerLng /= validPoints;
    }

    const leafletMap = L.map(mapContainer).setView([centerLat, centerLng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(leafletMap);

    const markers = [];
    const latLngs = [];

    routeData.optimized_points.forEach((point, index) => {
        if (point.localizacao) {
            const lat = point.localizacao.latitude;
            const lng = point.localizacao.longitude;

            const marker = L.marker([lat, lng]).addTo(leafletMap);
            const popupContent = `
                <div>
                    <h4>${point.nome}</h4>
                    <p><strong>Posição:</strong> ${index + 1}º ponto</p>
                    ${point.descricao ? `<p>${point.descricao}</p>` : ''}
                    <p><strong>Coordenadas:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                </div>
            `;
            marker.bindPopup(popupContent);

            markers.push(marker);
            latLngs.push([lat, lng]);
        }
    });

    if (latLngs.length > 0) {
        const group = new L.featureGroup(markers);
        leafletMap.fitBounds(group.getBounds().pad(0.1));
    }

    if (routeData && routeData.type === 'real' && routeData.geometry) {
        L.geoJSON(routeData.geometry, {
            style: {
                color: '#007bff',
                weight: 4,
                opacity: 0.8
            }
        }).addTo(leafletMap);
    } else if (latLngs.length > 1) {
        L.polyline(latLngs, {
            color: '#007bff',
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 10'
        }).addTo(leafletMap);
    }

    console.log('Mapa Leaflet inicializado com sucesso para preview!');
}

function initRouteDetailMap(route, routeData) {
    console.log('Iniciando mapa REAL de detalhes da rota...');
    const mapContainer = document.getElementById('route-detail-map');

    if (!mapContainer) {
        console.error('Container do mapa não encontrado!');
        return;
    }

    // Obter pontos da rota
    const points = route.pontos_turisticos || [];
    console.log('Pontos da rota:', points.length);

    if (points.length === 0) {
        mapContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666;">
                <i class="fas fa-map-marker-alt" style="font-size: 3rem; margin-bottom: 1rem; color: #ccc;"></i>
                <p>Nenhum ponto para exibir no mapa</p>
                <p style="font-size: 0.9rem;">Esta rota não possui pontos turísticos</p>
            </div>
        `;
        return;
    }

    // Verificar se o Leaflet está disponível
    if (typeof L === 'undefined') {
        console.warn('Leaflet não disponível, usando mapa simulado');
        initSimulatedMap(mapContainer, points, routeData);
        return;
    }

    // Limpar container
    mapContainer.innerHTML = '';
    mapContainer.style.height = '400px';

    // Calcular centro do mapa baseado nos pontos
    let centerLat = 0, centerLng = 0, validPoints = 0;

    points.forEach(point => {
        if (point.localizacao) {
            centerLat += point.localizacao.latitude;
            centerLng += point.localizacao.longitude;
            validPoints++;
        }
    });

    if (validPoints === 0) {
        // Usar coordenadas padrão do Brasil
        centerLat = -15.7801;
        centerLng = -47.9292;
    } else {
        centerLat /= validPoints;
        centerLng /= validPoints;
    }

    // Criar mapa Leaflet
    const leafletMap = L.map(mapContainer).setView([centerLat, centerLng], 12);

    // Adicionar camada de tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(leafletMap);

    // Adicionar marcadores para cada ponto
    const markers = [];
    const latLngs = [];

    // Adicionar localização do usuário se disponível
    if (userLocation) {
        const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
            icon: L.divIcon({
                className: 'user-location-marker',
                html: '<div style="background: #ff4757; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(leafletMap);

        userMarker.bindPopup(`
            <div>
                <h4>📍 Sua Localização</h4>
                <p><strong>Coordenadas:</strong> ${userLocation.latitude.toFixed(6)}, ${userLocation.longitude.toFixed(6)}</p>
                <p><strong>Precisão:</strong> ${userLocation.accuracy?.toFixed(0)}m</p>
                <p style="color: #666; font-size: 0.9rem;">Localização atual obtida do GPS</p>
            </div>
        `);

        markers.push(userMarker);
        latLngs.push([userLocation.latitude, userLocation.longitude]);
    }

    points.forEach((point, index) => {
        if (point.localizacao) {
            const lat = point.localizacao.latitude;
            const lng = point.localizacao.longitude;

            // Criar marcador personalizado
            const markerColor = index === 0 ? 'green' :
                index === points.length - 1 ? 'red' : 'blue';

            const marker = L.marker([lat, lng]).addTo(leafletMap);

            // Popup com informações do ponto
            const popupContent = `
                <div>
                    <h4>${point.nome}</h4>
                    <p><strong>Posição:</strong> ${index + 1}º ponto</p>
                    ${point.descricao ? `<p>${point.descricao}</p>` : ''}
                    <p><strong>Coordenadas:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
                    ${userLocation ? `<p><strong>Distância:</strong> ${calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng).toFixed(2)} km</p>` : ''}
                </div>
            `;
            marker.bindPopup(popupContent);

            markers.push(marker);
            latLngs.push([lat, lng]);
        }
    });

    // Ajustar zoom para mostrar todos os pontos
    if (latLngs.length > 0) {
        const group = new L.featureGroup(markers);
        leafletMap.fitBounds(group.getBounds().pad(0.1));
    }

    // Tentar adicionar rota real se houver dados de rota
    if (routeData && routeData.type === 'real' && routeData.geometry) {
        console.log('Adicionando rota real ao mapa...');

        // Adicionar linha da rota usando a geometria real
        const routeLine = L.geoJSON(routeData.geometry, {
            style: {
                color: '#007bff',
                weight: 4,
                opacity: 0.8
            }
        }).addTo(leafletMap);

        // Adicionar popup com informações da rota
        routeLine.bindPopup(`
            <div>
                <h4>🛣️ Rota Otimizada</h4>
                <p><strong>Distância:</strong> ${routeData.total_distance} km</p>
                <p><strong>Tempo estimado:</strong> ${Math.floor(routeData.estimated_time / 60)}h ${routeData.estimated_time % 60}min</p>
                <p><strong>Fonte:</strong> ${routeData.source}</p>
            </div>
        `);

    } else if (latLngs.length > 1) {
        console.log('Adicionando linha simples conectando os pontos...');

        // Adicionar linha simples conectando os pontos
        const polyline = L.polyline(latLngs, {
            color: '#007bff',
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 10'
        }).addTo(leafletMap);

        polyline.bindPopup(`
            <div>
                <h4>📍 Rota Aproximada</h4>
                <p><strong>Pontos:</strong> ${points.length}</p>
                <p>Conectando pontos em linha reta</p>
                <p><em>Para rota real, aguarde o cálculo...</em></p>
            </div>
        `);
    }

    // Adicionar controles de informação
    const info = L.control({ position: 'topright' });
    info.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'route-info-control');
        div.innerHTML = `
            <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                <h4 style="margin: 0 0 5px 0;">${route.nome}</h4>
                <p style="margin: 0; font-size: 12px;">📍 ${points.length} pontos</p>
                ${routeData ? `
                    <p style="margin: 0; font-size: 12px;">🛣️ ${routeData.total_distance} km</p>
                    <p style="margin: 0; font-size: 12px;">⏱️ ${Math.floor(routeData.estimated_time / 60)}h ${routeData.estimated_time % 60}min</p>
                ` : ''}
            </div>
        `;
        return div;
    };
    info.addTo(leafletMap);

    console.log('Mapa real criado com sucesso!');
}

// Função de fallback para mapa simulado caso Leaflet não esteja disponível
function initSimulatedMap(mapContainer, points, routeData) {
    // Limpar container
    mapContainer.innerHTML = '';

    // Criar mapa simples
    const mapDiv = document.createElement('div');
    mapDiv.style.cssText = `
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #e6f3ff 0%, #cce7ff 100%);
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #ddd;
    `;

    // Adicionar título do mapa
    const mapTitle = document.createElement('div');
    mapTitle.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(255,255,255,0.9);
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: bold;
        color: #333;
        z-index: 20;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    mapTitle.textContent = 'Mapa Simulado - Para mapa real, carregue as bibliotecas';
    mapDiv.appendChild(mapTitle);

    // Calcular posições dos pontos em círculo ou grid
    const centerX = 250;
    const centerY = 200;
    const radius = Math.min(150, 50 + points.length * 10);

    points.forEach((point, index) => {
        const marker = document.createElement('div');
        marker.style.cssText = `
            position: absolute;
            width: 35px;
            height: 35px;
            background: ${index === 0 ? '#28a745' : index === points.length - 1 ? '#dc3545' : '#007bff'};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 15;
            transition: transform 0.3s ease;
        `;

        // Posicionar em círculo
        const angle = (index / Math.max(points.length - 1, 1)) * Math.PI * 1.5;
        const x = centerX + Math.cos(angle) * radius - 17.5;
        const y = centerY + Math.sin(angle) * radius - 17.5;

        marker.style.left = `${x}px`;
        marker.style.top = `${y}px`;
        marker.textContent = index + 1;
        marker.title = `${index + 1}. ${point.nome || point}`;

        // Efeito hover
        marker.addEventListener('mouseenter', () => {
            marker.style.transform = 'scale(1.2)';
        });
        marker.addEventListener('mouseleave', () => {
            marker.style.transform = 'scale(1)';
        });

        mapDiv.appendChild(marker);

        // Desenhar linha para o próximo ponto
        if (index < points.length - 1) {
            const nextAngle = ((index + 1) / Math.max(points.length - 1, 1)) * Math.PI * 1.5;
            const nextX = centerX + Math.cos(nextAngle) * radius;
            const nextY = centerY + Math.sin(nextAngle) * radius;

            const length = Math.sqrt(Math.pow(nextX - (x + 17.5), 2) + Math.pow(nextY - (y + 17.5), 2));
            const lineAngle = Math.atan2(nextY - (y + 17.5), nextX - (x + 17.5)) * 180 / Math.PI;

            const line = document.createElement('div');
            line.style.cssText = `
                position: absolute;
                width: ${length}px;
                height: 3px;
                background: #007bff;
                left: ${x + 17.5}px;
                top: ${y + 15}px;
                transform-origin: 0 50%;
                transform: rotate(${lineAngle}deg);
                z-index: 5;
                opacity: 0.8;
            `;

            mapDiv.appendChild(line);

            // Adicionar seta na linha
            const arrow = document.createElement('div');
            arrow.style.cssText = `
                position: absolute;
                width: 0;
                height: 0;
                border-left: 6px solid #007bff;
                border-top: 3px solid transparent;
                border-bottom: 3px solid transparent;
                right: -6px;
                top: -1.5px;
            `;
            line.appendChild(arrow);
        }
    });

    // Adicionar informações da rota se disponível
    if (routeData) {
        const routeInfo = document.createElement('div');
        routeInfo.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(255,255,255,0.95);
            padding: 10px;
            border-radius: 10px;
            font-size: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 20;
        `;
        routeInfo.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>📍 ${points.length} pontos</strong></div>
            <div style="margin-bottom: 5px;">🛣️ ${routeData.total_distance} km</div>
            <div>⏱️ ${Math.floor(routeData.estimated_time / 60)}h ${routeData.estimated_time % 60}min</div>
        `;
        mapDiv.appendChild(routeInfo);
    }

    // Adicionar legenda
    const legend = document.createElement('div');
    legend.style.cssText = `
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: rgba(255,255,255,0.95);
        padding: 10px;
        border-radius: 10px;
        font-size: 11px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 20;
    `;
    legend.innerHTML = `
        <div style="margin-bottom: 3px;"><span style="display: inline-block; width: 12px; height: 12px; background: #28a745; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>Início</div>
        <div style="margin-bottom: 3px;"><span style="display: inline-block; width: 12px; height: 12px; background: #007bff; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>Intermediário</div>
        <div><span style="display: inline-block; width: 12px; height: 12px; background: #dc3545; border-radius: 50%; margin-right: 5px; vertical-align: middle;"></span>Final</div>
    `;

    mapDiv.appendChild(legend);
    mapContainer.appendChild(mapDiv);

    console.log('Mapa criado com sucesso!');
}

function calculateBounds(points) {
    if (!points || points.length === 0) return null;

    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;

    points.forEach(point => {
        if (point.localizacao) {
            const lat = point.localizacao.latitude;
            const lng = point.localizacao.longitude;

            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
        }
    });

    return {
        north: maxLat,
        south: minLat,
        east: maxLng,
        west: minLng
    };
}

// Função para integrar com mapas reais (Leaflet) - para implementação futura
function initLeafletMap(containerId, points) {
    // Esta função pode ser implementada quando quiser usar mapas reais
    // Requer inclusão da biblioteca Leaflet no HTML:
    // <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    // <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

    console.log('Mapa Leaflet seria inicializado aqui com pontos:', points);
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';

    notification.innerHTML = `
        <i class="${icon}"></i>
        ${message}
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para formatar data e hora
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '';

    const date = new Date(dateTimeString);
    const dateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const formattedDate = date.toLocaleDateString('pt-BR', dateOptions);
    const formattedTime = date.toLocaleTimeString('pt-BR', timeOptions);

    return `${formattedDate} às ${formattedTime}`;
}

// Função para solicitar localização na visualização de rota
async function requestUserLocationForRoute() {
    try {
        await requestUserLocation();
        // Recarregar modal com localização atualizada
        const modal = document.getElementById('route-details-modal');
        if (modal) {
            const routeId = modal.dataset.routeId;
            if (routeId) {
                modal.remove();
                viewRouteWithMap(routeId);
            }
        }
    } catch (error) {
        showNotification('Erro ao obter localização', 'error');
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função de debug para diagnóstico
function debugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('allSpots length:', allSpots.length);
    console.log('allRoutes length:', allRoutes.length);
    console.log('currentSection:', currentSection);
    console.log('selectedSpots length:', selectedSpots.length);

    // Mostrar primeiros spots
    if (allSpots.length > 0) {
        console.log('Primeiro spot:', allSpots[0]);
    }

    // Testar busca
    const searchInput = document.getElementById('search-spots');
    if (searchInput) {
        console.log('Campo de busca valor:', searchInput.value);
        console.log('Campo de busca existe:', !!searchInput);
    }

    // Mostrar notificação
    showNotification(`Debug: ${allSpots.length} pontos carregados, seção atual: ${currentSection}`, 'info');

    // Forçar recarregamento dos pontos
    if (allSpots.length === 0) {
        console.log('Forçando recarregamento dos pontos...');
        loadTouristSpots();
    }
}

async function optimizeExistingRoute(routeId) {
    try {
        showNotification('Otimizando rota...', 'info');

        const response = await fetch(`${API_BASE_URL}/routes/${routeId}/optimize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const result = await response.json();

            const modal = document.createElement('div');
            modal.className = 'modal active';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🚀 Rota Otimizada</h3>
                        <button class="close-modal" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="route-stats">
                            <div class="stat-item">
                                <i class="fas fa-route"></i>
                                <span>Distância: <strong>${result.total_distance} km</strong></span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-clock"></i>
                                <span>Tempo: <strong>${Math.floor(result.estimated_time / 60)}h ${result.estimated_time % 60}min</strong></span>
                            </div>
                        </div>
                        
                        <h4>Ordem Otimizada dos Pontos:</h4>
                        <div class="route-sequence">
                            ${result.optimized_order.map((point, index) => `
                                <div class="sequence-item">
                                    <span class="sequence-number">${index + 1}</span>
                                    <span class="sequence-name">${point.nome || point}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Fechar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            showNotification('Rota otimizada com sucesso!', 'success');
        } else {
            throw new Error('Erro ao otimizar rota');
        }
    } catch (error) {
        console.error('Erro ao otimizar rota:', error);
        showNotification('Erro ao otimizar rota', 'error');
    }
}

async function previewRoute() {
    if (selectedSpots.length < 2) {
        showNotification('Selecione pelo menos 2 pontos turísticos para visualizar a rota', 'warning');
        return;
    }

    try {
        showNotification('Calculando rota...', 'info');
        const routeData = await calculateOptimalRoute(selectedSpots);

        if (routeData) {
            showRoutePreview(routeData);
        } else {
            showNotification('Erro ao calcular rota. Usando ordem atual dos pontos.', 'warning');
            // Mostrar preview simples sem otimização
            const simpleRouteData = {
                optimized_points: selectedSpots,
                total_distance: '--',
                estimated_time: '--',
                route_data: null
            };
            showRoutePreview(simpleRouteData);
        }
    } catch (error) {
        console.error('Erro no preview da rota:', error);
        showNotification('Erro ao visualizar rota', 'error');
    }
}

// === FUNÇÕES ESSENCIAIS QUE ESTAVAM FALTANDO ===

function filterSpots() {
    const searchInput = document.getElementById('search-spots');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    console.log('Filtrando pontos com termo:', searchTerm);

    // Mostrar dicas de busca
    updateSearchHints(searchTerm.length);

    if (searchTerm.length < 2) {
        displayTouristSpots(allSpots);
        return;
    }

    // Buscar pontos locais
    const filteredSpots = allSpots.filter(spot =>
        spot.nome.toLowerCase().includes(searchTerm) ||
        (spot.descricao && spot.descricao.toLowerCase().includes(searchTerm)) ||
        (spot.cidade && spot.cidade.toLowerCase().includes(searchTerm))
    );

    // Se termo >= 3 caracteres, sempre buscar externamente
    if (searchTerm.length >= 3) {
        searchExternalSpots(searchTerm);
    } else {
        displayTouristSpots(filteredSpots);
    }
}

async function searchExternalSpots(searchTerm) {
    try {
        showLoading('spots-list');
        console.log('Buscando pontos externos para:', searchTerm);

        const response = await fetch(`${API_BASE_URL}/search-places?q=${encodeURIComponent(searchTerm)}`);

        if (response.ok) {
            const externalSpots = await response.json();
            console.log('Pontos externos encontrados:', externalSpots.length);

            // Combinar resultados locais e externos
            const localFiltered = allSpots.filter(spot =>
                spot.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (spot.descricao && spot.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            const combinedSpots = [...localFiltered, ...externalSpots];

            // Atualizar availableSpots com todos os pontos encontrados
            availableSpots = [...allSpots, ...externalSpots.filter(extSpot =>
                !allSpots.some(localSpot => localSpot.id === extSpot.id)
            )];

            displayTouristSpots(combinedSpots);
        } else {
            console.error('Erro na busca externa');
            // Mostrar apenas resultados locais
            const filteredSpots = allSpots.filter(spot =>
                spot.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
            displayTouristSpots(filteredSpots);
        }
    } catch (error) {
        console.error('Erro na busca externa:', error);
        // Fallback para busca local
        const filteredSpots = allSpots.filter(spot =>
            spot.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayTouristSpots(filteredSpots);
    }
}

function openSpotsModal() {
    const modal = document.getElementById('spots-modal');
    if (modal) {
        modal.classList.add('active');
        // Popular com pontos locais inicialmente
        populateModalSpots(allSpots);
        // Atualizar contador e seleções
        updateModalSpotSelection();
        // Limpar busca anterior
        const searchInput = document.getElementById('modal-search-spots');
        if (searchInput) {
            searchInput.value = '';
        }
    }
}

function closeSpotsModal() {
    const modal = document.getElementById('spots-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function toggleSpotSelection(spotId) {
    console.log('🎯 toggleSpotSelection chamado com ID:', spotId, 'tipo:', typeof spotId);

    // Buscar primeiro em availableSpots (que inclui externos), depois em allSpots
    let spot = availableSpots.find(s => s.id == spotId);
    if (!spot) {
        spot = allSpots.find(s => s.id == spotId);
    }

    if (!spot) {
        console.error('❌ Ponto não encontrado:', spotId);
        console.log('availableSpots:', availableSpots.map(s => s.id));
        console.log('allSpots:', allSpots.map(s => s.id));
        return;
    }

    console.log('✅ Ponto encontrado:', spot.nome);

    const index = selectedSpots.findIndex(s => s.id == spotId);

    if (index > -1) {
        // Remover da seleção
        selectedSpots.splice(index, 1);
        console.log('➖ Ponto removido da seleção:', spot.nome);
    } else {
        // Verificar limite de 5 pontos
        if (selectedSpots.length >= 5) {
            showNotification('Máximo de 5 pontos turísticos por rota', 'warning');
            return;
        }

        // Adicionar à seleção
        selectedSpots.push(spot);
        console.log('➕ Ponto adicionado à seleção:', spot.nome);
    }

    // Atualizar visual
    updateModalSpotSelection();
    updateSelectedSpotsDisplay();
}

function updateModalSpotSelection() {
    const spotCards = document.querySelectorAll('.modal-spot-card');
    spotCards.forEach(card => {
        const spotId = card.dataset.spotId;
        const isSelected = selectedSpots.some(s => s.id == spotId);

        if (isSelected) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });

    // Atualizar contador no modal
    const modalCounter = document.getElementById('modal-spots-counter');
    if (modalCounter) {
        modalCounter.textContent = `${selectedSpots.length}/5 pontos selecionados`;
    }
}

function confirmSpotSelection() {
    closeSpotsModal();
    updateSelectedSpotsDisplay();
    showNotification(`${selectedSpots.length} pontos selecionados`, 'success');
}

function updateSelectedSpotsDisplay() {
    const container = document.getElementById('selected-spots');
    if (!container) return;

    if (selectedSpots.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum ponto selecionado</p>';
        return;
    }

    const header = `<div class="spots-counter" style="margin-bottom: 1rem; font-weight: bold; color: #333;">
        ${selectedSpots.length}/5 pontos selecionados
    </div>`;

    const spotsHTML = selectedSpots.map((spot, index) => `
        <div class="selected-spot" data-spot-id="${spot.id}">
            <div class="spot-info">
                <span class="spot-order">${index + 1}</span>
                <span class="spot-name">${spot.nome}</span>
            </div>
            <div class="spot-controls">
                ${selectedSpots.length > 1 ? `
                    <button class="btn-reorder" onclick="moveSpotUp(${index})" title="Mover para cima" ${index === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="btn-reorder" onclick="moveSpotDown(${index})" title="Mover para baixo" ${index === selectedSpots.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-down"></i>
                    </button>
                ` : ''}
                <button class="btn-remove" onclick="removeSelectedSpot('${spot.id}')" title="Remover">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = header + spotsHTML;
}

function moveSpotUp(index) {
    if (index <= 0) return;

    // Trocar posições
    const temp = selectedSpots[index];
    selectedSpots[index] = selectedSpots[index - 1];
    selectedSpots[index - 1] = temp;

    updateSelectedSpotsDisplay();
    console.log('📈 Ponto movido para cima, nova ordem:', selectedSpots.map(s => s.nome));
}

// Função para mover ponto para baixo na lista
function moveSpotDown(index) {
    if (index >= selectedSpots.length - 1) return;

    // Trocar posições
    const temp = selectedSpots[index];
    selectedSpots[index] = selectedSpots[index + 1];
    selectedSpots[index + 1] = temp;

    updateSelectedSpotsDisplay();
    console.log('📉 Ponto movido para baixo, nova ordem:', selectedSpots.map(s => s.nome));
}

function removeSelectedSpot(spotId) {
    console.log('🗑️ removeSelectedSpot chamado com ID:', spotId, 'tipo:', typeof spotId);
    selectedSpots = selectedSpots.filter(s => s.id != spotId);
    updateSelectedSpotsDisplay();
    updateModalSpotSelection();
}

// Função para deletar rota
async function deleteRoute(routeId) {
    if (!confirm('Tem certeza que deseja excluir esta rota?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/routes/${routeId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Rota excluída com sucesso!', 'success');
            loadRoutes(); // Recarregar lista
        } else {
            throw new Error('Erro ao excluir rota');
        }
    } catch (error) {
        console.error('Erro ao excluir rota:', error);
        showNotification('Erro ao excluir rota', 'error');
    }
}

// Função para exportar PDF com captura do mapa real
async function exportRoutePDF(routeId) {
    try {
        showNotification('Preparando exportação PDF...', 'info');

        // Buscar dados da rota
        const routeResponse = await fetch(`${API_BASE_URL}/routes/${routeId}`);
        if (!routeResponse.ok) {
            throw new Error('Não foi possível carregar dados da rota');
        }
        const route = await routeResponse.json();

        // PRIORIDADE 1: Verificar se estamos na visualização de rota (mapa visível)
        const routeViewModal = document.getElementById('route-details-modal');
        const isMapVisible = routeViewModal && !routeViewModal.style.display === 'none' && routeViewModal.classList.contains('active');
        
        let mapImageData = null;
        
        if (isMapVisible) {
            // CAPTURAR EXATAMENTE O MAPA DA TELA
            showNotification('📸 Capturando mapa da tela...', 'info');
            try {
                const mapContainer = document.getElementById('route-detail-map');
                if (mapContainer && typeof html2canvas !== 'undefined') {
                    console.log('Capturando mapa visível da tela...');
                    
                    // Aguardar um pouco para garantir renderização
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    const canvas = await html2canvas(mapContainer, {
                        useCORS: true,
                        allowTaint: true,
                        scale: 1,
                        backgroundColor: '#ffffff',
                        logging: false,
                        height: mapContainer.offsetHeight,
                        width: mapContainer.offsetWidth,
                        foreignObjectRendering: true
                    });
                    
                    mapImageData = canvas.toDataURL('image/png', 0.9);
                    console.log('✅ Mapa da tela capturado com sucesso!');
                } else {
                    console.log('❌ Mapa da tela não disponível');
                }
            } catch (error) {
                console.log('❌ Erro ao capturar mapa da tela:', error);
            }
        }

        // PRIORIDADE 2: Se não conseguiu capturar da tela, abrir a visualização primeiro
        if (!mapImageData) {
            showNotification('⏳ Abrindo visualização para capturar mapa...', 'info');
            
            // Verificar se já temos um modal aberto, se não, abrir
            if (!routeViewModal) {
                // Abrir a visualização
                await viewRouteWithMap(routeId);
                
                // Aguardar o mapa carregar
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                // Tentar capturar novamente
                const newMapContainer = document.getElementById('route-detail-map');
                if (newMapContainer && typeof html2canvas !== 'undefined') {
                    try {
                        const canvas = await html2canvas(newMapContainer, {
                            useCORS: true,
                            allowTaint: true,
                            scale: 1,
                            backgroundColor: '#ffffff',
                            logging: false
                        });
                        
                        mapImageData = canvas.toDataURL('image/png', 0.9);
                        console.log('✅ Mapa capturado após abrir visualização!');
                        
                        // Fechar o modal após capturar
                        const modalToClose = document.getElementById('route-details-modal');
                        if (modalToClose) modalToClose.remove();
                        
                    } catch (error) {
                        console.log('❌ Erro ao capturar após abrir visualização:', error);
                    }
                }
            }
        }

        // Enviar para o backend
        showNotification('📄 Gerando PDF...', 'info');
        
        const formData = new FormData();
        formData.append('route_data', JSON.stringify(route));
        
        if (mapImageData && mapImageData.startsWith('data:image/')) {
            // Converter base64 para blob
            const response = await fetch(mapImageData);
            const blob = await response.blob();
            formData.append('map_image', blob, 'map.png');
            console.log('📸 Imagem do mapa adicionada ao PDF');
        } else {
            console.log('⚠️ Nenhuma imagem de mapa disponível, PDF será gerado sem mapa real');
        }

        const pdfResponse = await fetch(`${API_BASE_URL}/routes/${routeId}/export-pdf`, {
            method: 'POST',
            body: formData
        });

        if (pdfResponse.ok) {
            const blob = await pdfResponse.blob();

            if (blob.size === 0) {
                throw new Error('PDF vazio gerado');
            }

            // Download do arquivo
            const fileName = `rota_${route.nome ? route.nome.replace(/\s+/g, '_').toLowerCase() : routeId}.pdf`;
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            showNotification('✅ PDF gerado com sucesso!', 'success');
        } else {
            const errorData = await pdfResponse.json().catch(() => ({ error: 'Erro desconhecido' }));
            throw new Error(errorData.error || 'Erro ao gerar PDF');
        }
    } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        showNotification(`Erro ao gerar PDF: ${error.message}`, 'error');
    }
}

// Função para capturar o mapa visível na tela
async function captureVisibleMap() {
    return new Promise((resolve, reject) => {
        try {
            const mapContainer = document.getElementById('route-map');
            if (!mapContainer) {
                reject(new Error('Mapa não encontrado na tela'));
                return;
            }

            // Verificar se html2canvas está disponível
            if (typeof html2canvas === 'undefined') {
                reject(new Error('html2canvas não disponível'));
                return;
            }

            // Aguardar um pouco para garantir que o mapa esteja totalmente renderizado
            setTimeout(() => {
                // Capturar o mapa usando html2canvas
                html2canvas(mapContainer, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 1,
                    backgroundColor: '#ffffff',
                    logging: false,
                    height: mapContainer.offsetHeight,
                    width: mapContainer.offsetWidth,
                    foreignObjectRendering: true
                }).then(canvas => {
                    const imageData = canvas.toDataURL('image/png', 0.9);
                    console.log('Mapa capturado da tela com sucesso');
                    resolve(imageData);
                }).catch(error => {
                    console.error('Erro ao capturar mapa com html2canvas:', error);
                    reject(error);
                });
            }, 1000); // Aguardar 1 segundo para garantir renderização completa

        } catch (error) {
            console.error('Erro ao capturar mapa visível:', error);
            reject(error);
        }
    });
}

// Função para capturar imagem do mapa da rota
// REMOVIDA - não usar mais esta função, apenas capturar da tela
// A função captureRouteMap foi removida porque estava causando inconsistências
// Agora usamos apenas a captura direta da tela na exportRoutePDF

// Função para gerar mapa simples como SVG (fallback)
function generateSimpleMapSVG(points) {
    if (!points || points.length === 0) {
        return null;
    }

    const width = 800;
    const height = 600;
    const padding = 50;

    // Calcular bounds
    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;

    points.forEach(point => {
        const lat = point.localizacao.latitude;
        const lng = point.localizacao.longitude;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
    });

    // Adicionar margem
    const latRange = maxLat - minLat;
    const lngRange = maxLng - minLng;
    const margin = 0.1;
    minLat -= latRange * margin;
    maxLat += latRange * margin;
    minLng -= lngRange * margin;
    maxLng += lngRange * margin;

    // Função para converter coordenadas para pixels
    const latToY = (lat) => height - padding - ((lat - minLat) / (maxLat - minLat)) * (height - 2 * padding);
    const lngToX = (lng) => padding + ((lng - minLng) / (maxLng - minLng)) * (width - 2 * padding);

    // Gerar SVG
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${width}" height="${height}" fill="#e6f3ff"/>`;
    svg += `<text x="${width / 2}" y="30" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold">Mapa da Rota</text>`;

    // Desenhar linhas conectando pontos (rota)
    if (points.length > 1) {
        // Linha principal da rota
        let pathData = `M ${lngToX(points[0].localizacao.longitude)} ${latToY(points[0].localizacao.latitude)}`;
        for (let i = 1; i < points.length; i++) {
            pathData += ` L ${lngToX(points[i].localizacao.longitude)} ${latToY(points[i].localizacao.latitude)}`;
        }
        
        // Linha de fundo (mais grossa e clara)
        svg += `<path d="${pathData}" stroke="#b3d9ff" stroke-width="6" fill="none"/>`;
        // Linha principal (azul)
        svg += `<path d="${pathData}" stroke="#007bff" stroke-width="4" fill="none"/>`;
        
        // Adicionar setas indicando direção
        for (let i = 0; i < points.length - 1; i++) {
            const x1 = lngToX(points[i].localizacao.longitude);
            const y1 = latToY(points[i].localizacao.latitude);
            const x2 = lngToX(points[i + 1].localizacao.longitude);
            const y2 = latToY(points[i + 1].localizacao.latitude);
            
            // Calcular ponto médio e ângulo
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
            
            // Adicionar seta pequena
            svg += `<polygon points="${midX-5},${midY-3} ${midX+8},${midY} ${midX-5},${midY+3}" 
                    fill="#007bff" transform="rotate(${angle} ${midX} ${midY})"/>`;
        }
    }

    // Desenhar pontos
    points.forEach((point, index) => {
        const x = lngToX(point.localizacao.longitude);
        const y = latToY(point.localizacao.latitude);

        // Marcador
        const color = index === 0 ? '#28a745' : (index === points.length - 1 ? '#dc3545' : '#007bff');
        svg += `<circle cx="${x}" cy="${y}" r="12" fill="${color}" stroke="white" stroke-width="3"/>`;
        svg += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="white">${index + 1}</text>`;

        // Nome do ponto
        svg += `<text x="${x}" y="${y - 20}" text-anchor="middle" font-family="Arial" font-size="10" fill="#333">${point.nome}</text>`;
    });

    svg += `</svg>`;

    // Converter SVG para data URL
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

// === FIM DAS FUNÇÕES ESSENCIAIS ===

// Função para atualizar status da localização na interface
function updateLocationStatus(hasLocation, errorMessage = '') {
    const spotsSection = document.getElementById('spots-section');
    if (!spotsSection) return;

    // Remover status anterior se existir
    const existingStatus = spotsSection.querySelector('.location-status');
    if (existingStatus) {
        existingStatus.remove();
    }

    // Criar novo status
    const statusDiv = document.createElement('div');
    statusDiv.className = 'location-status';
    statusDiv.style.cssText = `
        margin: 1rem 0;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    `;

    if (hasLocation) {
        statusDiv.style.cssText += `
            background-color: #d1fae5;
            border: 1px solid #10b981;
            color: #065f46;
        `;
        statusDiv.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span>📍 Localização obtida! Mostrando pontos próximos à sua posição.</span>
        `;
    } else {
        statusDiv.style.cssText += `
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            color: #92400e;
        `;
        statusDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>⚠️ ${errorMessage || 'Localização não disponível'} - Mostrando todos os pontos.</span>
            <button onclick="requestUserLocation()" style="
                margin-left: auto;
                padding: 0.25rem 0.75rem;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
                font-size: 0.8rem;
            ">🔄 Permitir localização</button>
        `;
    }

    // Inserir após o h2
    const h2 = spotsSection.querySelector('h2');
    if (h2) {
        h2.insertAdjacentElement('afterend', statusDiv);
    }
}

// Função para mostrar dicas de busca
function updateSearchHints(searchLength) {
    const spotsSection = document.getElementById('spots-section');
    if (!spotsSection) return;

    // Remover dicas anteriores
    const existingHint = spotsSection.querySelector('.search-hint');
    if (existingHint) {
        existingHint.remove();
    }

    // Criar nova dica
    let hintText = '';
    let hintColor = '';

    if (searchLength === 0) {
        return; // Não mostrar dica quando campo está vazio
    } else if (searchLength < 3) {
        hintText = '💡 Digite pelo menos 3 caracteres para busca externa (ex: Cristo Redentor, Pão de Açúcar)';
        hintColor = '#6b7280';
    } else {
        hintText = '🌐 Incluindo resultados externos do OpenStreetMap...';
        hintColor = '#3b82f6';
    }

    const hintDiv = document.createElement('div');
    hintDiv.className = 'search-hint';
    hintDiv.style.cssText = `
        margin: 0.5rem 0;
        padding: 0.5rem 0.75rem;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        color: ${hintColor};
        font-size: 0.875rem;
        max-width: 32rem;
    `;
    hintDiv.textContent = hintText;

    // Inserir após a barra de busca
    const searchBar = spotsSection.querySelector('.search-bar');
    if (searchBar) {
        searchBar.insertAdjacentElement('afterend', hintDiv);
    }
}

// Função para filtrar pontos no modal
function filterModalSpots() {
    const searchInput = document.getElementById('modal-search-spots');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    console.log('🔍 Filtrando pontos no modal com termo:', searchTerm);

    if (searchTerm.length < 2) {
        populateModalSpots(allSpots);
        return;
    }

    // Buscar pontos locais
    const filteredSpots = allSpots.filter(spot =>
        spot.nome.toLowerCase().includes(searchTerm) ||
        (spot.descricao && spot.descricao.toLowerCase().includes(searchTerm)) ||
        (spot.cidade && spot.cidade.toLowerCase().includes(searchTerm))
    );

    // Se termo >= 3 caracteres, buscar externamente também
    if (searchTerm.length >= 3) {
        searchExternalSpotsForModal(searchTerm);
    } else {
        populateModalSpots(filteredSpots);
    }
}

// Função para busca externa específica do modal
async function searchExternalSpotsForModal(searchTerm) {
    try {
        const container = document.getElementById('modal-spots-list');
        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Buscando pontos...</div>';

        console.log('🌐 Buscando pontos externos para modal:', searchTerm);

        const response = await fetch(`${API_BASE_URL}/search-places?q=${encodeURIComponent(searchTerm)}`);

        if (response.ok) {
            const externalSpots = await response.json();
            console.log('✅ Pontos externos encontrados:', externalSpots.length);

            // Combinar resultados locais e externos
            const localFiltered = allSpots.filter(spot =>
                spot.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (spot.descricao && spot.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            // Filtrar externos para evitar duplicatas
            const filteredExternal = externalSpots.filter(extSpot =>
                !localFiltered.some(localSpot =>
                    localSpot.nome.toLowerCase() === extSpot.nome.toLowerCase()
                )
            );

            const combinedSpots = [...localFiltered, ...filteredExternal];

            // Atualizar availableSpots com todos os pontos encontrados (incluindo externos)
            const newExternalSpots = filteredExternal.filter(extSpot =>
                !availableSpots.some(availableSpot => availableSpot.id === extSpot.id)
            );
            availableSpots = [...availableSpots, ...newExternalSpots];

            console.log('🔄 availableSpots atualizado:');
            console.log(`  - Total: ${availableSpots.length} pontos disponíveis`);
            console.log(`  - Novos externos: ${newExternalSpots.length}`);
            console.log('  - IDs externos:', newExternalSpots.map(s => s.id));

            populateModalSpots(combinedSpots);

            console.log(`📊 Resultado: ${localFiltered.length} locais + ${filteredExternal.length} externos`);
        } else {
            console.error('❌ Erro na busca externa');
            // Fallback para resultados locais apenas
            const filteredSpots = allSpots.filter(spot =>
                spot.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
            populateModalSpots(filteredSpots);
        }
    } catch (error) {
        console.error('❌ Erro na busca externa para modal:', error);
        // Fallback para busca local
        const filteredSpots = allSpots.filter(spot =>
            spot.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
        populateModalSpots(filteredSpots);
    }
}

// Função para mostrar dicas de busca no modal
function updateModalSearchHints(searchLength) {
    const hintElement = document.getElementById('modal-search-hint');
    if (!hintElement) return;

    if (searchLength === 0) {
        hintElement.style.display = 'none';
    } else if (searchLength < 3) {
        hintElement.style.display = 'block';
        hintElement.innerHTML = '💡 Digite pelo menos 3 caracteres para busca externa (OpenStreetMap)';
        hintElement.style.color = '#6b7280';
    } else {
        hintElement.style.display = 'block';
        hintElement.innerHTML = '🌐 Incluindo resultados externos...';
        hintElement.style.color = '#3b82f6';
    }
}

// Função para tratar erro de carregamento de imagem
function handleImageError(img) {
    console.log('🖼️ Erro ao carregar imagem:', img.src);

    // Criar div de placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.style.cssText = `
        width: 100%; 
        height: 200px; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
        border-radius: 8px; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        color: white; 
        margin-top: 1rem;
        cursor: default;
    `;

    placeholder.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.7;"></i>
            <p style="margin: 0; font-size: 0.9rem;">Imagem não disponível</p>
            <p style="margin: 0; font-size: 0.7rem; opacity: 0.8;">URL: ${img.src.substring(0, 50)}...</p>
        </div>
    `;

    // Substituir a imagem pelo placeholder
    const container = img.parentNode;
    if (container) {
        container.replaceChild(placeholder, img);
        console.log('✅ Placeholder inserido com sucesso');
    }
}

// Função para abrir modal de imagem
function openImageModal(imageUrl, title) {
    const modal = document.createElement('div');
    modal.className = 'modal active';

    modal.style.zIndex = '10000';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90vw; max-height: 90vh;">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-modal" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" style="text-align: center; padding: 0;">
                <img src="${imageUrl}" alt="${title}" 
                     style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 8px;">
            </div>
        </div>
    `;

    // Fechar modal clicando fora
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    document.body.appendChild(modal);
}

// Função para editar rota
async function editRoute(routeId) {
    try {
        console.log('Editando rota ID:', routeId);
        const response = await fetch(`${API_BASE_URL}/routes/${routeId}`);

        if (response.ok) {
            const route = await response.json();
            console.log('Rota carregada para edição:', route);

            // Preencher dados da rota no formulário
            selectedSpots = route.pontos_turisticos || [];

            // Ir para a seção de criação
            showSection('create');

            // Preencher formulário
            document.getElementById('route-name').value = route.nome || '';
            document.getElementById('route-description').value = route.descricao || '';

            if (route.data_inicio) {
                const startDateTime = new Date(route.data_inicio);
                const startDate = startDateTime.toISOString().split('T')[0];
                const startTime = startDateTime.toISOString().split('T')[1].slice(0, 5);
                document.getElementById('start-date').value = startDate;
                document.getElementById('start-time').value = startTime;
            }

            if (route.data_fim) {
                const endDateTime = new Date(route.data_fim);
                const endDate = endDateTime.toISOString().split('T')[0];
                const endTime = endDateTime.toISOString().split('T')[1].slice(0, 5);
                document.getElementById('end-date').value = endDate;
                document.getElementById('end-time').value = endTime;
            }

            // Atualizar display dos pontos selecionados
            updateSelectedSpotsDisplay();

            // Adicionar pontos ao availableSpots se necessário
            selectedSpots.forEach(spot => {
                const isExternal = spot.source === 'nominatim' || (spot.id && spot.id.toString().startsWith('ext_'));
                if (isExternal && !availableSpots.some(s => s.id === spot.id)) {
                    availableSpots.push(spot);
                }
            });

            // Mudar o formulário para modo edição
            const form = document.getElementById('create-route-form');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar Rota';
            submitBtn.onclick = function (e) {
                e.preventDefault();
                updateRoute(routeId);
            };

            // Adicionar botão cancelar
            let cancelBtn = form.querySelector('.btn-cancel-edit');
            if (!cancelBtn) {
                cancelBtn = document.createElement('button');
                cancelBtn.type = 'button';
                cancelBtn.className = 'btn btn-secondary btn-cancel-edit';
                cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancelar';
                cancelBtn.onclick = cancelEdit;
                submitBtn.parentNode.insertBefore(cancelBtn, submitBtn);
            }

            showNotification('Rota carregada para edição', 'info');
        } else {
            throw new Error('Erro ao carregar rota para edição');
        }
    } catch (error) {
        console.error('Erro ao editar rota:', error);
        showNotification('Erro ao carregar rota para edição', 'error');
    }
}

// Função para atualizar rota
async function updateRoute(routeId) {
    const routeData = {
        nome: document.getElementById('route-name').value,
        descricao: document.getElementById('route-description').value,
        data_inicio: document.getElementById('start-date').value,
        data_fim: document.getElementById('end-date').value,
        pontos_turisticos: selectedSpots.map(spot => ({
            id: spot.id,
            nome: spot.nome,
            descricao: spot.descricao,
            localizacao: spot.localizacao
        }))
    };

    try {
        const response = await fetch(`${API_BASE_URL}/routes/${routeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(routeData)
        });

        if (response.ok) {
            showNotification('Rota atualizada com sucesso!', 'success');
            cancelEdit();
            loadRoutes();
            showSection('routes');
        } else {
            throw new Error('Erro ao atualizar rota');
        }
    } catch (error) {
        console.error('Erro ao atualizar rota:', error);
        showNotification('Erro ao atualizar rota', 'error');
    }
}

// Função para cancelar edição
function cancelEdit() {
    // Limpar formulário
    document.getElementById('create-route-form').reset();
    selectedSpots = [];
    updateSelectedSpotsDisplay();

    // Restaurar botão submit
    const form = document.getElementById('create-route-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Rota';
    submitBtn.onclick = null;

    // Remover botão cancelar
    const cancelBtn = form.querySelector('.btn-cancel-edit');
    if (cancelBtn) {
        cancelBtn.remove();
    }

    showNotification('Edição cancelada', 'info');
}

// Função para calcular distância entre dois pontos (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
}
