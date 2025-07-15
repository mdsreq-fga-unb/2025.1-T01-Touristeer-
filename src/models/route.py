from src.models.user import db
from datetime import datetime
import json

class Route(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    data_inicio = db.Column(db.DateTime, nullable=False)
    pontos_turisticos = db.Column(db.Text, nullable=False) 
    user_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Route {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'data_inicio': self.data_inicio.isoformat() if self.data_inicio else None,
            'pontos_turisticos': json.loads(self.pontos_turisticos) if self.pontos_turisticos else [],
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def set_pontos_turisticos(self, pontos_list):
        """Converte lista de pontos turísticos para JSON string"""
        self.pontos_turisticos = json.dumps(pontos_list)

    def get_pontos_turisticos(self):
        """Retorna lista de pontos turísticos a partir do JSON string"""
        return json.loads(self.pontos_turisticos) if self.pontos_turisticos else []

