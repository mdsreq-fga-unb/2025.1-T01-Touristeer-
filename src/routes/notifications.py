from flask import Blueprint, request, jsonify
from datetime import datetime
from src.models.user import User

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.route("/notifications/send", methods=["POST"])
def send_notification():
    """Enviar uma notificação (e-mail) para o usuário"""
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        message = data.get("message")

        if not user_id or not message:
            return jsonify({"error": "User ID e mensagem são obrigatórios"}), 400

        # Simulação de envio de e-mail
        user = User.query.get(user_id)
        if user:
            print(f"Simulando envio de e-mail para {user.email}: {message}")
            return jsonify({"message": "Notificação enviada com sucesso (simulado)"}), 200
        else:
            return jsonify({"error": "Usuário não encontrado"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


