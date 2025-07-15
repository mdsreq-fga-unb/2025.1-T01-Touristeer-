from flask import Blueprint, request, jsonify, send_file
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, Circle, Line, String
from reportlab.graphics import renderPDF
from src.models.route import Route
import tempfile
import os
import json
from PIL import Image as PILImage
import io

pdf_export_bp = Blueprint("pdf_export", __name__)

@pdf_export_bp.route("/routes/<int:route_id>/export-pdf", methods=["GET", "POST"])
def export_route_to_pdf(route_id):
    """Exportar rota para PDF"""
    try:
        route = Route.query.get_or_404(route_id)
        
        # Inicializar variáveis para cleanup
        temp_image_path = None
        
        # Verificar se há dados de imagem do mapa enviados via POST
        map_image_data = None
        if request.method == "POST":
            if 'map_image' in request.files:
                map_file = request.files['map_image']
                if map_file.filename != '':
                    # Processar imagem do mapa
                    map_image_data = map_file.read()
                    print(f"Imagem do mapa recebida: {len(map_image_data)} bytes")
        
        # Criar arquivo temporário
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        temp_filename = temp_file.name
        temp_file.close()
        
        # Criar documento PDF
        doc = SimpleDocTemplate(temp_filename, pagesize=A4)
        styles = getSampleStyleSheet()
        story = []
        
        # Título
        title_style = ParagraphStyle(
            "CustomTitle",
            parent=styles["Heading1"],
            fontSize=24,
            spaceAfter=30,
            alignment=1  # Center
        )
        story.append(Paragraph("Rota: " + route.nome, title_style))
        story.append(Spacer(1, 20))
        
        # Adicionar mapa - priorizar imagem enviada, depois mapa simples
        pontos = route.get_pontos_turisticos()
        pontos_com_localizacao = [p for p in pontos if p.get('localizacao')]
        
        if map_image_data:
            # Usar imagem real do mapa capturada
            try:
                # Criar arquivo temporário para a imagem
                temp_img = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
                temp_img.write(map_image_data)
                temp_img.close()
                
                print(f"Arquivo temporário da imagem criado: {temp_img.name}")
                
                # Verificar se o arquivo existe e tem conteúdo
                if os.path.exists(temp_img.name) and os.path.getsize(temp_img.name) > 0:
                    # Adicionar imagem ao PDF
                    story.append(Paragraph("<b>Mapa da Rota:</b>", styles["Heading3"]))
                    story.append(Spacer(1, 10))
                    
                    # Redimensionar imagem para caber na página
                    img = Image(temp_img.name, width=6*inch, height=4*inch)
                    story.append(img)
                    story.append(Spacer(1, 20))
                    
                    print("Mapa real adicionado ao PDF com sucesso")
                    
                    # Guardar referência para deletar depois do PDF ser gerado
                    temp_image_path = temp_img.name
                else:
                    print("Arquivo de imagem não foi criado corretamente")
                    temp_image_path = None
                    # Fallback para mapa simples
                    if pontos_com_localizacao:
                        try:
                            map_drawing = create_simple_map(pontos_com_localizacao)
                            story.append(Paragraph("<b>Mapa da Rota (Simples):</b>", styles["Heading3"]))
                            story.append(Spacer(1, 10))
                            story.append(map_drawing)
                            story.append(Spacer(1, 20))
                        except Exception as simple_map_error:
                            print(f"Erro ao criar mapa simples: {simple_map_error}")
                    
            except Exception as map_error:
                print(f"Erro ao processar imagem do mapa: {map_error}")
                temp_image_path = None
                # Fallback para mapa simples
                if pontos_com_localizacao:
                    try:
                        map_drawing = create_simple_map(pontos_com_localizacao)
                        story.append(Paragraph("<b>Mapa da Rota (Simples):</b>", styles["Heading3"]))
                        story.append(Spacer(1, 10))
                        story.append(map_drawing)
                        story.append(Spacer(1, 20))
                    except Exception as simple_map_error:
                        print(f"Erro ao criar mapa simples: {simple_map_error}")
        else:
            temp_image_path = None
            # Usar mapa simples como fallback
            try:
                map_drawing = create_simple_map(pontos_com_localizacao)
                story.append(Paragraph("<b>Mapa da Rota (Simples):</b>", styles["Heading3"]))
                story.append(Spacer(1, 10))
                story.append(map_drawing)
                story.append(Spacer(1, 20))
            except Exception as map_error:
                print(f"Erro ao criar mapa simples: {map_error}")
                # Continuar sem o mapa
        
        # TODO: Adicionar mapa visual no futuro
        # Por enquanto, incluir apenas informações textuais
        
        # Informações da rota
        info_style = styles["Normal"]
        story.append(Paragraph("<b>Data de Início:</b> " + route.data_inicio.strftime("%d/%m/%Y às %H:%M"), info_style))
        story.append(Spacer(1, 10))
        
        # Pontos turísticos
        pontos = route.get_pontos_turisticos()
        if pontos:
            story.append(Paragraph("<b>Pontos Turísticos:</b>", styles["Heading2"]))
            story.append(Spacer(1, 10))
            
            # Criar tabela com pontos
            data = [["#", "Nome", "Descrição"]]
            for i, ponto in enumerate(pontos, 1):
                nome = ponto.get("nome", "N/A")
                descricao = ponto.get("descricao", "N/A")
                # Limitar descrição para caber na tabela
                if len(descricao) > 100:
                    descricao = descricao[:97] + "..."
                data.append([str(i), nome, descricao])
            
            table = Table(data, colWidths=[0.5*inch, 2*inch, 3.5*inch])
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 12),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]))
            story.append(table)
        
        # Rodapé
        story.append(Spacer(1, 30))
        footer_style = ParagraphStyle(
            "Footer",
            parent=styles["Normal"],
            fontSize=10,
            alignment=1,
            textColor=colors.grey
        )
        story.append(Paragraph("Gerado pelo Touristeer - Plataforma de Turismo Inteligente", footer_style))
        
        # Construir PDF
        doc.build(story)
        
        # Limpar arquivo temporário da imagem se existir
        if 'temp_image_path' in locals() and temp_image_path and os.path.exists(temp_image_path):
            try:
                os.unlink(temp_image_path)
                print(f"Arquivo temporário da imagem removido: {temp_image_path}")
            except Exception as cleanup_error:
                print(f"Erro ao remover arquivo temporário da imagem: {cleanup_error}")
        
        # Retornar arquivo
        response = send_file(
            temp_filename,
            as_attachment=True,
            download_name="rota_" + route.nome.replace(" ", "_") + ".pdf",
            mimetype="application/pdf"
        )
        
        # Programar limpeza do arquivo PDF temporário após o envio
        def cleanup():
            try:
                if os.path.exists(temp_filename):
                    os.unlink(temp_filename)
            except:
                pass
        
        # A limpeza será feita automaticamente pelo Flask após o envio
        return response
        
    except Exception as e:
        # Limpar arquivos temporários em caso de erro
        if "temp_filename" in locals() and os.path.exists(temp_filename):
            try:
                os.unlink(temp_filename)
            except:
                pass
        
        if 'temp_image_path' in locals() and temp_image_path and os.path.exists(temp_image_path):
            try:
                os.unlink(temp_image_path)
            except:
                pass
                
        print(f"Erro ao gerar PDF: {str(e)}")
        return jsonify({"error": str(e)}), 500


def create_simple_map(pontos):
    """Criar um mapa simples usando reportlab"""
    try:
        # Dimensões do mapa
        width = 6 * inch
        height = 4 * inch
        
        # Criar drawing
        drawing = Drawing(width, height)
        
        # Fundo do mapa
        drawing.add(Circle(0, 0, 0, fillColor=colors.lightblue, strokeColor=None))
        
        # Calcular bounds dos pontos
        lats = [p['localizacao']['latitude'] for p in pontos]
        lngs = [p['localizacao']['longitude'] for p in pontos]
        
        min_lat, max_lat = min(lats), max(lats)
        min_lng, max_lng = min(lngs), max(lngs)
        
        # Adicionar margem
        lat_range = max_lat - min_lat
        lng_range = max_lng - min_lng
        margin = 0.1
        
        min_lat -= lat_range * margin
        max_lat += lat_range * margin
        min_lng -= lng_range * margin
        max_lng += lng_range * margin
        
        # Função para converter coordenadas para pixels
        def lat_to_y(lat):
            return ((lat - min_lat) / (max_lat - min_lat)) * height
            
        def lng_to_x(lng):
            return ((lng - min_lng) / (max_lng - min_lng)) * width
        
        # Desenhar linhas conectando pontos
        if len(pontos) > 1:
            for i in range(len(pontos) - 1):
                x1 = lng_to_x(pontos[i]['localizacao']['longitude'])
                y1 = lat_to_y(pontos[i]['localizacao']['latitude'])
                x2 = lng_to_x(pontos[i + 1]['localizacao']['longitude'])
                y2 = lat_to_y(pontos[i + 1]['localizacao']['latitude'])
                
                line = Line(x1, y1, x2, y2)
                line.strokeColor = colors.blue
                line.strokeWidth = 2
                drawing.add(line)
        
        # Desenhar pontos
        for i, ponto in enumerate(pontos):
            x = lng_to_x(ponto['localizacao']['longitude'])
            y = lat_to_y(ponto['localizacao']['latitude'])
            
            # Cor do marcador
            if i == 0:
                color = colors.green
            elif i == len(pontos) - 1:
                color = colors.red
            else:
                color = colors.blue
            
            # Círculo do marcador
            circle = Circle(x, y, 8)
            circle.fillColor = color
            circle.strokeColor = colors.white
            circle.strokeWidth = 2
            drawing.add(circle)
            
            # Número do ponto
            text = String(x, y - 2, str(i + 1))
            text.fillColor = colors.white
            text.fontSize = 8
            text.textAnchor = 'middle'
            drawing.add(text)
        
        return drawing
        
    except Exception as e:
        print(f"Erro ao criar mapa simples: {e}")
        # Retornar drawing vazio em caso de erro
        return Drawing(6 * inch, 4 * inch)



