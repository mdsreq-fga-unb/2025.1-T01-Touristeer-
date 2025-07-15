from flask import Blueprint, request, jsonify
from datetime import datetime
from src.models.user import db, User
from src.models.route import Route
import json
import requests
import math

routes_bp = Blueprint('routes', __name__)

@routes_bp.route('/routes', methods=['POST'])
def create_route():
    """Criar uma nova rota turística"""
    try:
        data = request.get_json()
        
        # Validações básicas
        if not data.get('nome'):
            return jsonify({'error': 'Nome da rota é obrigatório'}), 400
        
        if not data.get('data_inicio'):
            return jsonify({'error': 'Data de início é obrigatória'}), 400
        
        pontos_turisticos = data.get('pontos_turisticos', [])
        if len(pontos_turisticos) > 5:
            return jsonify({'error': 'Máximo de 5 pontos turísticos por rota'}), 400
        
        # Converter string de data para datetime e validar
        try:
            data_inicio = datetime.fromisoformat(data['data_inicio'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Formato de data inválido. Use formato ISO (YYYY-MM-DDTHH:MM:SS)'}), 400
        
        # Validar se data de início é futura
        now = datetime.now()
        if data_inicio <= now:
            return jsonify({'error': 'Data de início deve ser futura'}), 400
        
        # Validar data de fim se fornecida
        data_fim = None
        if data.get('data_fim'):
            try:
                data_fim = datetime.fromisoformat(data['data_fim'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Formato de data de fim inválido. Use formato ISO (YYYY-MM-DDTHH:MM:SS)'}), 400
            
            # Validar se data de fim é posterior à data de início
            if data_fim <= data_inicio:
                return jsonify({'error': 'Data de fim deve ser posterior à data de início'}), 400
        
        # Criar nova rota
        nova_rota = Route(
            nome=data['nome'],
            descricao=data.get('descricao'),
            data_inicio=data_inicio,
            data_fim=data_fim,
            pontos_turisticos=json.dumps(pontos_turisticos),
            user_id=data.get('user_id', 1)  # Default user para MVP
        )
        
        db.session.add(nova_rota)
        db.session.commit()
        
        return jsonify(nova_rota.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@routes_bp.route('/routes', methods=['GET'])
def get_routes():
    """Listar todas as rotas com filtros opcionais"""
    try:
        user_id = request.args.get('user_id', 1)  # Default user para MVP
        
        routes = Route.query.filter_by(user_id=user_id).all()
        
        return jsonify([route.to_dict() for route in routes]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes_bp.route('/routes/<int:route_id>', methods=['GET'])
def get_route(route_id):
    """Obter uma rota específica"""
    try:
        route = Route.query.get_or_404(route_id)
        return jsonify(route.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes_bp.route('/routes/<int:route_id>', methods=['PUT'])
def update_route(route_id):
    """Atualizar uma rota existente"""
    try:
        route = Route.query.get_or_404(route_id)
        data = request.get_json()
        
        # Atualizar campos se fornecidos
        if 'nome' in data:
            route.nome = data['nome']
        
        if 'data_inicio' in data:
            try:
                route.data_inicio = datetime.fromisoformat(data['data_inicio'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use ISO format'}), 400
        
        if 'pontos_turisticos' in data:
            pontos_turisticos = data['pontos_turisticos']
            if len(pontos_turisticos) > 5:
                return jsonify({'error': 'Máximo de 5 pontos turísticos por rota'}), 400
            route.pontos_turisticos = json.dumps(pontos_turisticos)
        
        route.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(route.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@routes_bp.route('/routes/<int:route_id>', methods=['DELETE'])
def delete_route(route_id):
    """Deletar uma rota"""
    try:
        route = Route.query.get_or_404(route_id)
        db.session.delete(route)
        db.session.commit()
        
        return jsonify({'message': 'Rota deletada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@routes_bp.route('/routes/<int:route_id>/optimize', methods=['POST'])
def optimize_route(route_id):
    """Otimizar a ordem dos pontos turísticos em uma rota"""
    try:
        route = Route.query.get_or_404(route_id)
        pontos = route.get_pontos_turisticos()
        
        if len(pontos) < 2:
            return jsonify({'error': 'Rota precisa ter pelo menos 2 pontos'}), 400
        
        # Calcular melhor sequência usando algoritmo simples (distância euclidiana)
        optimized_order = optimize_points_order(pontos)
        
        # Calcular dados da rota otimizada
        route_data = calculate_route_data(optimized_order)
        
        return jsonify({
            'optimized_order': optimized_order,
            'route_data': route_data,
            'total_distance': route_data['total_distance'],
            'estimated_time': route_data['estimated_time']
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes_bp.route('/calculate-route', methods=['POST'])
def calculate_route():
    """Calcular rota entre pontos turísticos selecionados"""
    try:
        data = request.get_json()
        points = data.get('points', [])
        
        if len(points) < 2:
            return jsonify({'error': 'Pelo menos 2 pontos são necessários'}), 400
        
        # Otimizar ordem dos pontos
        optimized_points = optimize_points_order(points)
        
        # Calcular dados da rota
        route_data = calculate_route_data(optimized_points)
        
        # Obter direções detalhadas (usando OpenRouteService ou similar)
        directions = get_route_directions(optimized_points)
        
        return jsonify({
            'optimized_points': optimized_points,
            'route_data': route_data,
            'directions': directions,
            'total_distance': route_data['total_distance'],
            'estimated_time': route_data['estimated_time'],
            'polyline': route_data.get('polyline', '')
        }), 200
        
    except Exception as e:
        print(f"Erro no cálculo da rota: {e}")
        return jsonify({'error': str(e)}), 500

# === FUNÇÕES PARA ROTAS REAIS ===

@routes_bp.route('/calculate-real-route', methods=['POST'])
def calculate_real_route():
    """Calcular rota real usando APIs de roteamento"""
    try:
        data = request.get_json()
        points = data.get('points', [])
        
        if len(points) < 2:
            return jsonify({'error': 'Pelo menos 2 pontos são necessários'}), 400
        
        # Calcular rota real usando OSRM
        real_route_data = calculate_real_route_data(points)
        
        if real_route_data:
            return jsonify(real_route_data), 200
        else:
            # Fallback para cálculo aproximado
            fallback_data = calculate_route_data(points)
            fallback_data['type'] = 'approximated'
            fallback_data['message'] = 'Rota aproximada - serviço de roteamento indisponível'
            return jsonify(fallback_data), 200
        
    except Exception as e:
        print(f"Erro no cálculo da rota real: {e}")
        return jsonify({'error': str(e)}), 500

def calculate_real_route_data(points):
    """Calcular rota real usando OSRM (Open Source Routing Machine)"""
    try:
        # Extrair coordenadas dos pontos
        coordinates = []
        for point in points:
            if isinstance(point, dict):
                if 'localizacao' in point:
                    lat = point['localizacao']['latitude']
                    lng = point['localizacao']['longitude']
                    coordinates.append([lng, lat])  # OSRM usa [lng, lat]
                elif 'lat' in point and 'lng' in point:
                    coordinates.append([point['lng'], point['lat']])
        
        if len(coordinates) < 2:
            return None
        
        # Construir URL da API OSRM
        coords_str = ';'.join([f"{coord[0]},{coord[1]}" for coord in coordinates])
        osrm_url = f"http://router.project-osrm.org/route/v1/driving/{coords_str}"
        
        params = {
            'overview': 'full',
            'geometries': 'geojson',
            'steps': 'true'
        }
        
        # Fazer requisição para OSRM
        response = requests.get(osrm_url, params=params, timeout=10)
        
        if response.status_code == 200:
            osrm_data = response.json()
            
            if osrm_data.get('code') == 'Ok' and osrm_data.get('routes'):
                route = osrm_data['routes'][0]
                
                # Extrair informações da rota
                total_distance = route['distance'] / 1000  # metros para km
                total_duration = route['duration'] / 60     # segundos para minutos
                
                # Extrair geometria da rota (polyline)
                geometry = route['geometry']
                
                # Extrair instruções detalhadas
                legs = route.get('legs', [])
                detailed_instructions = []
                
                for leg in legs:
                    steps = leg.get('steps', [])
                    for step in steps:
                        instruction = step.get('maneuver', {}).get('instruction', 'Continue')
                        step_distance = step.get('distance', 0) / 1000
                        step_duration = step.get('duration', 0) / 60
                        
                        detailed_instructions.append({
                            'instruction': instruction,
                            'distance': round(step_distance, 2),
                            'duration': round(step_duration, 1)
                        })
                
                return {
                    'type': 'real',
                    'total_distance': round(total_distance, 2),
                    'estimated_time': round(total_duration),
                    'geometry': geometry,
                    'instructions': detailed_instructions,
                    'optimized_points': points,
                    'source': 'OSRM'
                }
        
        return None
        
    except Exception as e:
        print(f"Erro ao calcular rota real: {e}")
        return None

def get_real_directions_between_points(point1, point2):
    """Obter direções reais entre dois pontos específicos"""
    try:
        # Extrair coordenadas
        if isinstance(point1, dict) and 'localizacao' in point1:
            lat1, lng1 = point1['localizacao']['latitude'], point1['localizacao']['longitude']
        else:
            return None
            
        if isinstance(point2, dict) and 'localizacao' in point2:
            lat2, lng2 = point2['localizacao']['latitude'], point2['localizacao']['longitude']
        else:
            return None
        
        # URL da API OSRM para dois pontos
        osrm_url = f"http://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2}"
        
        params = {
            'steps': 'true',
            'geometries': 'geojson'
        }
        
        response = requests.get(osrm_url, params=params, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('code') == 'Ok' and data.get('routes'):
                route = data['routes'][0]
                leg = route['legs'][0]
                
                distance = route['distance'] / 1000  # km
                duration = route['duration'] / 60     # minutos
                
                # Extrair primeira instrução
                steps = leg.get('steps', [])
                first_instruction = "Siga em frente"
                if steps and len(steps) > 0:
                    maneuver = steps[0].get('maneuver', {})
                    first_instruction = maneuver.get('instruction', 'Siga em frente')
                
                return {
                    'distance': round(distance, 2),
                    'duration': round(duration),
                    'instruction': first_instruction,
                    'geometry': route.get('geometry', {})
                }
        
        return None
        
    except Exception as e:
        print(f"Erro ao obter direções: {e}")
        return None

# === FIM DAS FUNÇÕES PARA ROTAS REAIS ===

def optimize_points_order(points):
    """Otimizar ordem dos pontos usando algoritmo do vizinho mais próximo"""
    if len(points) <= 2:
        return points
    
    # Converter pontos para formato consistente
    coords = []
    for point in points:
        if isinstance(point, dict):
            if 'localizacao' in point:
                coords.append({
                    'id': point.get('id'),
                    'nome': point.get('nome', ''),
                    'lat': point['localizacao']['latitude'],
                    'lng': point['localizacao']['longitude'],
                    'original': point
                })
            elif 'lat' in point and 'lng' in point:
                coords.append({
                    'id': point.get('id'),
                    'nome': point.get('nome', ''),
                    'lat': point['lat'],
                    'lng': point['lng'],
                    'original': point
                })
        elif isinstance(point, (int, str)):
            # Se for apenas ID, buscar dados do ponto na base de dados
            from ..models.tourist_spot import TouristSpot
            try:
                spot = TouristSpot.query.get(point)
                if spot:
                    spot_dict = spot.to_dict()
                    coords.append({
                        'id': spot_dict.get('id'),
                        'nome': spot_dict.get('nome', f'Ponto {point}'),
                        'lat': spot_dict.get('localizacao', {}).get('latitude', 0),
                        'lng': spot_dict.get('localizacao', {}).get('longitude', 0),
                        'original': spot_dict
                    })
                else:
                    # Ponto não encontrado, usar coordenadas padrão
                    coords.append({
                        'id': point,
                        'nome': f'Ponto {point}',
                        'lat': -15.7801,  # Brasília como padrão
                        'lng': -47.9292,
                        'original': {'id': point, 'nome': f'Ponto {point}'}
                    })
            except Exception as e:
                print(f"Erro ao buscar ponto {point}: {e}")
                coords.append({
                    'id': point,
                    'nome': f'Ponto {point}',
                    'lat': -15.7801,  # Brasília como padrão
                    'lng': -47.9292,
                    'original': {'id': point, 'nome': f'Ponto {point}'}
                })
        else:
            print(f"Tipo de ponto não reconhecido: {type(point)} - {point}")
            coords.append({
                'id': 'unknown',
                'nome': 'Ponto Desconhecido',
                'lat': -15.7801,
                'lng': -47.9292,
                'original': point
            })
    
    if len(coords) <= 2:
        return [coord['original'] for coord in coords]
    
    # Algoritmo do vizinho mais próximo (TSP simplificado)
    unvisited = coords[1:]  # Excluir primeiro ponto
    route = [coords[0]]     # Começar do primeiro ponto
    
    while unvisited:
        current = route[-1]
        nearest_idx = 0
        nearest_dist = float('inf')
        
        for i, point in enumerate(unvisited):
            dist = calculate_distance(current['lat'], current['lng'], point['lat'], point['lng'])
            if dist < nearest_dist:
                nearest_dist = dist
                nearest_idx = i
        
        route.append(unvisited.pop(nearest_idx))
    
    return [point['original'] for point in route]

def calculate_distance(lat1, lng1, lat2, lng2):
    """Calcular distância euclidiana simples entre dois pontos"""
    import math
    return math.sqrt((lat2 - lat1)**2 + (lng2 - lng1)**2)

def calculate_route_data(points):
    """Calcular dados da rota (distância total, tempo estimado)"""
    total_distance = 0
    route_segments = []
    
    for i in range(len(points) - 1):
        current = points[i]
        next_point = points[i + 1]
        
        # Extrair coordenadas
        if isinstance(current, dict) and 'localizacao' in current:
            lat1, lng1 = current['localizacao']['latitude'], current['localizacao']['longitude']
        else:
            lat1, lng1 = 0, 0
            
        if isinstance(next_point, dict) and 'localizacao' in next_point:
            lat2, lng2 = next_point['localizacao']['latitude'], next_point['localizacao']['longitude']
        else:
            lat2, lng2 = 0, 0
        
        # Calcular distância aproximada (fórmula de Haversine simplificada)
        segment_distance = haversine_distance(lat1, lng1, lat2, lng2)
        total_distance += segment_distance
        
        route_segments.append({
            'from': current.get('nome', 'Ponto') if isinstance(current, dict) else str(current),
            'to': next_point.get('nome', 'Ponto') if isinstance(next_point, dict) else str(next_point),
            'distance': segment_distance
        })
    
    # Tempo estimado (assumindo 50 km/h média)
    estimated_time_hours = total_distance / 50
    estimated_time_minutes = int(estimated_time_hours * 60)
    
    return {
        'total_distance': round(total_distance, 2),
        'estimated_time': estimated_time_minutes,
        'segments': route_segments
    }

def haversine_distance(lat1, lng1, lat2, lng2):
    """Calcular distância real entre dois pontos usando fórmula de Haversine"""
    import math
    
    # Converter para radianos
    lat1, lng1, lat2, lng2 = map(math.radians, [lat1, lng1, lat2, lng2])
    
    # Fórmula de Haversine
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Raio da Terra em quilômetros
    r = 6371
    
    return c * r

def get_route_directions(points):
    """Obter direções detalhadas entre pontos (placeholder para integração futura)"""
    # Aqui você pode integrar com APIs como:
    # - OpenRouteService
    # - GraphHopper
    # - Mapbox Directions
    # - Google Directions API
    
    directions = []
    for i in range(len(points) - 1):
        current = points[i]
        next_point = points[i + 1]
        
        directions.append({
            'from': current.get('nome', 'Ponto') if isinstance(current, dict) else str(current),
            'to': next_point.get('nome', 'Ponto') if isinstance(next_point, dict) else str(next_point),
            'instruction': f"Seguir de {current.get('nome', 'Ponto')} para {next_point.get('nome', 'Ponto')}",
            'distance': '-- km',
            'duration': '-- min'
        })
    
    return directions

