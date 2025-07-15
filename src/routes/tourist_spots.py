from flask import Blueprint, request, jsonify
import json
import os
import requests
from urllib.parse import quote
import math

tourist_spots_bp = Blueprint('tourist_spots', __name__)

def load_tourist_spots():
    """Carrega pontos turísticos do arquivo JSON estático"""
    try:
        # Caminho para o arquivo na raiz do projeto
        json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'tourist_spots.json')
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Se o arquivo contém uma lista diretamente, retorna ela
            if isinstance(data, list):
                return data
            # Se contém um objeto com chave "tourist_spots", extrai a lista
            elif isinstance(data, dict) and 'tourist_spots' in data:
                return data['tourist_spots']
            else:
                return data
    except Exception as e:
        print(f"Erro ao carregar pontos turísticos: {e}")
        return []

@tourist_spots_bp.route('/tourist-spots', methods=['GET'])
def get_tourist_spots():
    """Listar todos os pontos turísticos com filtros opcionais"""
    try:
        spots = load_tourist_spots()
        
        # Filtro por nome (busca parcial)
        search = request.args.get('search', '').lower()
        if search:
            spots = [spot for spot in spots if search in spot['nome'].lower()]
        
        # Filtro por proximidade (latitude, longitude, raio em km)
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', type=float, default=10.0)
        
        if lat is not None and lng is not None:
            filtered_spots = []
            for spot in spots:
                spot_lat = spot['localizacao']['latitude']
                spot_lng = spot['localizacao']['longitude']
                
                # Cálculo simples de distância (aproximado)
                distance = ((lat - spot_lat) ** 2 + (lng - spot_lng) ** 2) ** 0.5 * 111  # ~111km por grau
                
                if distance <= radius:
                    spot_with_distance = spot.copy()
                    spot_with_distance['distance'] = round(distance, 2)
                    filtered_spots.append(spot_with_distance)
            
            spots = sorted(filtered_spots, key=lambda x: x['distance'])
        
        return jsonify(spots), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tourist_spots_bp.route('/tourist-spots/<int:spot_id>', methods=['GET'])
def get_tourist_spot(spot_id):
    """Obter um ponto turístico específico"""
    try:
        spots = load_tourist_spots()
        spot = next((s for s in spots if s['id'] == spot_id), None)
        
        if not spot:
            return jsonify({'error': 'Ponto turístico não encontrado'}), 404
        
        return jsonify(spot), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@tourist_spots_bp.route('/search-places', methods=['GET'])
def search_places():
    """Buscar pontos turísticos via API externa (Nominatim/OpenStreetMap)"""
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify({'error': 'Parâmetro de busca obrigatório'}), 400
            
        # Buscar primeiro nos pontos locais
        local_spots = load_tourist_spots()
        local_results = [
            spot for spot in local_spots 
            if query.lower() in spot['nome'].lower() or 
               (spot.get('descricao', '') and query.lower() in spot['descricao'].lower())
        ]
        
        # Buscar via API externa (Nominatim)
        external_results = search_nominatim(query)
        
        # Combinar resultados
        all_results = local_results + external_results
        
        # Remover duplicatas por nome
        seen_names = set()
        unique_results = []
        for spot in all_results:
            if spot['nome'].lower() not in seen_names:
                seen_names.add(spot['nome'].lower())
                unique_results.append(spot)
        
        return jsonify(unique_results), 200
        
    except Exception as e:
        print(f"Erro na busca de lugares: {e}")
        return jsonify({'error': str(e)}), 500

def search_nominatim(query):
    """Buscar lugares usando a API do Nominatim (OpenStreetMap)"""
    try:
        # URL da API Nominatim
        base_url = "https://nominatim.openstreetmap.org/search"
        
        # Parâmetros da busca
        params = {
            'q': query,
            'format': 'json',
            'limit': 20,  # Aumentar limite
            'addressdetails': 1,
            'extratags': 1,
            'namedetails': 1,
            'accept-language': 'pt-BR,pt,en'
        }
        
        # Headers para identificar a aplicação
        headers = {
            'User-Agent': 'TouristRoutes/1.0 (contact@example.com)'
        }
        
        # Fazer requisição
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        print(f"Nominatim retornou {len(data)} resultados para '{query}'")
        
        # Converter para formato esperado
        results = []
        for item in data:
            # Ser mais inclusivo nos tipos de lugares
            place_type = item.get('type', '').lower()
            category = item.get('category', '').lower()
            class_type = item.get('class', '').lower()
            
            # Aceitar mais tipos de lugares
            accepted_types = ['tourism', 'attraction', 'monument', 'museum', 'park', 'lake', 'water', 
                             'natural', 'leisure', 'historic', 'memorial', 'viewpoint', 'beach']
            accepted_categories = ['tourism', 'amenity', 'leisure', 'natural', 'historic', 'place']
            
            is_tourist_place = (
                any(keyword in place_type for keyword in accepted_types) or
                any(keyword in category for keyword in accepted_categories) or
                any(keyword in class_type for keyword in accepted_types) or
                'tourism' in str(item.get('extratags', {})).lower() or
                item.get('importance', 0) > 0.3  # Lugares com alta importância
            )
            
            if is_tourist_place:
                # Extrair informações
                display_name = item.get('display_name', '')
                name_parts = display_name.split(',')
                name = name_parts[0].strip()  # Primeiro parte do nome
                
                # Melhorar a descrição
                description = f"📍 {display_name}"
                if place_type:
                    description = f"{place_type.title()} - {description}"
                
                spot = {
                    'id': f"ext_{item.get('place_id', '')}",  # ID externo
                    'nome': name,
                    'descricao': description,
                    'localizacao': {
                        'latitude': float(item.get('lat', 0)),
                        'longitude': float(item.get('lon', 0))
                    },
                    'endereco': display_name,
                    'categoria': place_type.title() or category.title() or 'Ponto de Interesse',
                    'source': 'nominatim',
                    'importance': item.get('importance', 0)
                }
                results.append(spot)
        
        # Ordenar por importância
        results.sort(key=lambda x: x.get('importance', 0), reverse=True)
        
        print(f"Filtrados {len(results)} pontos turísticos")
        return results[:10]  # Retornar apenas os 10 melhores
        
    except requests.RequestException as e:
        print(f"Erro na API Nominatim: {e}")
        return []
    except Exception as e:
        print(f"Erro no processamento Nominatim: {e}")
        return []

@tourist_spots_bp.route('/search-nearby-spots', methods=['POST'])
def search_nearby_spots():
    """Buscar pontos turísticos próximos usando API externa (Overpass/OpenStreetMap)"""
    try:
        data = request.get_json()
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        radius = data.get('radius', 30)  # km
        categories = data.get('categories', ['tourism', 'attraction'])
        limit = data.get('limit', 50)
        
        if not latitude or not longitude:
            return jsonify({'error': 'Latitude e longitude são obrigatórios'}), 400
            
        # Construir consulta Overpass QL
        # Converter raio de km para graus (aproximado: 1 grau ≈ 111 km)
        radius_deg = radius / 111.0
        
        # Construir filtros por categoria
        category_filters = []
        for category in categories:
            if category == 'tourism':
                category_filters.extend([
                    'tourism=attraction',
                    'tourism=museum',
                    'tourism=viewpoint',
                    'tourism=monument',
                    'tourism=artwork',
                    'tourism=gallery',
                    'tourism=information',
                    'tourism=theme_park'
                ])
            elif category == 'historic':
                category_filters.extend([
                    'historic=monument',
                    'historic=memorial',
                    'historic=castle',
                    'historic=ruins',
                    'historic=archaeological_site',
                    'historic=building'
                ])
            elif category == 'natural':
                category_filters.extend([
                    'natural=peak',
                    'natural=waterfall',
                    'natural=beach',
                    'natural=cave_entrance'
                ])
            elif category == 'park':
                category_filters.extend([
                    'leisure=park',
                    'leisure=nature_reserve',
                    'tourism=zoo'
                ])
            else:
                category_filters.append(f'{category}=*')
        
        # Construir query Overpass
        bbox = f"{latitude - radius_deg},{longitude - radius_deg},{latitude + radius_deg},{longitude + radius_deg}"
        
        # Query para nós (points)
        node_queries = []
        for filter_item in category_filters:
            node_queries.append(f'node[{filter_item}]({bbox});')
        
        # Query para ways (áreas)
        way_queries = []
        for filter_item in category_filters:
            way_queries.append(f'way[{filter_item}]({bbox});')
        
        overpass_query = f"""
        [out:json][timeout:25];
        (
          {''.join(node_queries)}
          {''.join(way_queries)}
        );
        out center meta;
        """
        
        print(f"🌐 Buscando pontos próximos: lat={latitude}, lng={longitude}, radius={radius}km")
        print(f"📋 Categorias: {categories}")
        
        # Fazer requisição para API Overpass
        overpass_url = "https://overpass-api.de/api/interpreter"
        
        try:
            response = requests.post(
                overpass_url, 
                data=overpass_query, 
                timeout=30,
                headers={'Content-Type': 'text/plain; charset=utf-8'}
            )
            
            if response.status_code == 200:
                overpass_data = response.json()
                elements = overpass_data.get('elements', [])
                
                print(f"✅ Overpass retornou {len(elements)} elementos")
                
                # Processar resultados
                spots = []
                for element in elements:
                    try:
                        # Obter coordenadas
                        if element['type'] == 'node':
                            elem_lat = element['lat']
                            elem_lng = element['lon']
                        elif element['type'] == 'way' and 'center' in element:
                            elem_lat = element['center']['lat']
                            elem_lng = element['center']['lon']
                        else:
                            continue
                        
                        # Calcular distância real
                        distance = calculate_distance(latitude, longitude, elem_lat, elem_lng)
                        
                        # Filtrar por raio real
                        if distance > radius:
                            continue
                        
                        # Extrair informações
                        tags = element.get('tags', {})
                        name = tags.get('name', tags.get('name:pt', tags.get('name:en', 'Ponto Turístico')))
                        
                        # Determinar categoria
                        category = 'Outros'
                        if 'tourism' in tags:
                            category = f"Turismo - {tags['tourism'].title()}"
                        elif 'historic' in tags:
                            category = f"Histórico - {tags['historic'].title()}"
                        elif 'natural' in tags:
                            category = f"Natural - {tags['natural'].title()}"
                        elif 'leisure' in tags:
                            category = f"Lazer - {tags['leisure'].title()}"
                        
                        # Construir descrição
                        description_parts = []
                        description_parts.append(f"{category}")
                        
                        if 'addr:city' in tags:
                            description_parts.append(f"📍 {tags['addr:city']}")
                        if 'addr:state' in tags:
                            description_parts.append(f"{tags['addr:state']}")
                        if 'website' in tags:
                            description_parts.append(f"🌐 {tags['website']}")
                        if 'opening_hours' in tags:
                            description_parts.append(f"🕒 {tags['opening_hours']}")
                        
                        spot = {
                            'id': f"ext_{element['id']}",
                            'nome': name,
                            'descricao': ' - '.join(description_parts),
                            'categoria': category,
                            'localizacao': {
                                'latitude': elem_lat,
                                'longitude': elem_lng
                            },
                            'distance': distance,
                            'source': 'overpass',
                            'relevancia': calculate_relevance(tags, distance)
                        }
                        
                        spots.append(spot)
                        
                    except Exception as e:
                        print(f"❌ Erro ao processar elemento: {e}")
                        continue
                
                # Ordenar por relevância e distância
                spots.sort(key=lambda x: (-x['relevancia'], x['distance']))
                
                # Limitar resultados
                spots = spots[:limit]
                
                print(f"🎯 Retornando {len(spots)} pontos processados")
                return jsonify(spots)
                
            else:
                print(f"❌ Erro na API Overpass: {response.status_code}")
                return jsonify({'error': 'Erro ao buscar pontos na API externa'}), 500
                
        except requests.exceptions.Timeout:
            print("⏰ Timeout na API Overpass")
            return jsonify({'error': 'Timeout na busca de pontos'}), 408
        except requests.exceptions.RequestException as e:
            print(f"🌐 Erro de rede na API Overpass: {e}")
            return jsonify({'error': 'Erro de conexão com API externa'}), 503
            
    except Exception as e:
        print(f"💥 Erro geral em search_nearby_spots: {e}")
        return jsonify({'error': str(e)}), 500

def calculate_distance(lat1, lng1, lat2, lng2):
    """Calcular distância entre duas coordenadas em km"""
    R = 6371  # Raio da Terra em km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = (math.sin(delta_lat / 2) ** 2 + 
         math.cos(lat1_rad) * math.cos(lat2_rad) * 
         math.sin(delta_lng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def calculate_relevance(tags, distance):
    """Calcular relevância de um ponto turístico"""
    relevance = 0
    
    # Pontuação base por tipo
    if 'tourism' in tags:
        if tags['tourism'] in ['attraction', 'museum', 'monument', 'viewpoint']:
            relevance += 10
        else:
            relevance += 5
    
    if 'historic' in tags:
        if tags['historic'] in ['monument', 'castle', 'archaeological_site']:
            relevance += 8
        else:
            relevance += 4
    
    # Bonus por ter nome
    if 'name' in tags and len(tags['name']) > 3:
        relevance += 3
    
    # Bonus por ter site
    if 'website' in tags:
        relevance += 2
    
    # Bonus por ter horário
    if 'opening_hours' in tags:
        relevance += 1
    
    # Penalidade por distância
    distance_penalty = distance / 10  # Reduz 1 ponto a cada 10km
    relevance = max(0, relevance - distance_penalty)
    
    return relevance

