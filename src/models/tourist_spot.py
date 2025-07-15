from src.models.user import db

class TouristSpot(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    imagem_url = db.Column(db.String(500))
    descricao = db.Column(db.Text)

    def __repr__(self):
        return f'<TouristSpot {self.nome}>'

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'localizacao': {
                'latitude': self.latitude,
                'longitude': self.longitude
            },
            'imagem_url': self.imagem_url,
            'descricao': self.descricao
        }

