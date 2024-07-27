from werkzeug.security import generate_password_hash, check_password_hash
from app import db
import json


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class SewaBarang(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(255), nullable=False)
    harga = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nama": self.nama,
            "harga": self.harga,
        }


class Peraturan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
        }


class InformasiKolam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(255), nullable=False)
    tinggi = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nama": self.nama,
            "tinggi": self.tinggi,
        }


class GeneralInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(255), nullable=False)
    alamat = db.Column(db.String(255), nullable=False)
    kontak = db.Column(db.String(12), nullable=False)
    sosialMedia = db.Column(db.String(255), nullable=False)
    jadwalDanHarga = db.Column(db.Text, nullable=False)  # Stored as JSON string
    jamOperasional = db.Column(db.String(50), nullable=False)
    tinggiAnak = db.Column(db.Integer, nullable=False)
    tinggiDewasa = db.Column(db.Integer, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nama": self.nama,
            "alamat": self.alamat,
            "kontak": self.kontak,
            "sosialMedia": self.sosialMedia,
            "jadwalDanHarga": json.loads(self.jadwalDanHarga),
            "jamOperasional": self.jamOperasional,
            "tinggiAnak": self.tinggiAnak,
            "tinggiDewasa": self.tinggiDewasa,
        }

    @property
    def jadwal_dan_harga(self):
        return json.loads(self.jadwalDanHarga)

    @jadwal_dan_harga.setter
    def jadwal_dan_harga(self, value):
        self.jadwalDanHarga = json.dumps(value)


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tanggal = db.Column(db.Date, nullable=False)
    deskripsi = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "tanggal": self.tanggal.strftime("%Y-%m-%d"),
            "deskripsi": self.deskripsi,
        }
