from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_jwt_extended import jwt_required
import os
import json
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config.from_prefixed_env()
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    hours=int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES"))
)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")
layout = 0


with app.app_context():
    from seed import seed_data

    db.create_all()  # Create database if it doesn't exist
    seed_data()  # Seed the database with default data


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        from models import User

        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token), 200

        return jsonify({"msg": "Invalid username or password"}), 401
    else:
        return "Halaman login"


@app.route("/admin", methods=["GET", "PUT"])
@jwt_required()
def admin():
    if request.method == "PUT":
        from models import GeneralInfo

        data = request.json
        data["jadwalDanHarga"] = json.dumps(data["jadwalDanHarga"])
        general_info = GeneralInfo.query.first()
        if not general_info:
            general_info = GeneralInfo(**data)
            db.session.add(general_info)
        else:
            for key, value in data.items():
                setattr(general_info, key, value)
        db.session.commit()
        data["jadwalDanHarga"] = json.loads(data["jadwalDanHarga"])
        socketio.emit("general_info_updated", data)
        return jsonify({"message": "General info saved successfully"})
    else:
        pass


@app.route("/admin/kolam", methods=["GET", "POST"])
@jwt_required()
def kolam():
    if request.method == "GET":
        from models import InformasiKolam

        data = InformasiKolam.query.all()
        data_dicts = [item.to_dict() for item in data]
        return jsonify(data_dicts)
    elif request.method == "POST":
        data = request.get_json()
        from models import InformasiKolam

        new_item = InformasiKolam(nama=data["nama"], tinggi=data["tinggi"])
        db.session.add(new_item)
        db.session.commit()
        socketio.emit("kolam_updated", new_item.to_dict())
        return jsonify(new_item.to_dict()), 201


@app.route("/admin/kolam/<int:id>", methods=["PUT", "DELETE"])
@jwt_required()
def kolam_detail(id):
    from models import InformasiKolam

    item = InformasiKolam.query.get_or_404(id)
    if request.method == "PUT":
        data = request.get_json()
        item.nama = data["nama"]
        item.tinggi = data["tinggi"]
        db.session.commit()
        socketio.emit("kolam_updated", item.to_dict())
        return jsonify(item.to_dict()), 200
    elif request.method == "DELETE":
        db.session.delete(item)
        db.session.commit()
        socketio.emit("kolam_deleted", id)
        return jsonify({"message": "Item deleted"}), 204


@app.route("/admin/peraturan", methods=["GET", "POST"])
@jwt_required()
def peraturan():
    if request.method == "GET":
        from models import Peraturan

        data = Peraturan.query.all()
        data_dicts = [item.to_dict() for item in data]
        return jsonify(data_dicts)
    elif request.method == "POST":
        data = request.get_json()
        from models import Peraturan

        new_item = Peraturan(content=data["content"])
        db.session.add(new_item)
        db.session.commit()
        socketio.emit("peraturan_updated", new_item.to_dict())
        return jsonify(new_item.to_dict()), 201


@app.route("/admin/peraturan/<int:id>", methods=["PUT", "DELETE"])
@jwt_required()
def peraturan_detail(id):
    from models import Peraturan

    item = Peraturan.query.get_or_404(id)
    if request.method == "PUT":
        data = request.get_json()
        item.content = data["content"]
        db.session.commit()
        socketio.emit("peraturan_updated", item.to_dict())
        return jsonify(item.to_dict()), 200
    elif request.method == "DELETE":
        db.session.delete(item)
        db.session.commit()
        socketio.emit("peraturan_deleted", id)
        return jsonify({"message": "Item deleted"}), 204


@app.route("/admin/sewa-barang", methods=["GET", "POST"])
@jwt_required()
def sewa_barang():
    if request.method == "GET":
        from models import SewaBarang

        data = SewaBarang.query.all()
        data_dicts = [item.to_dict() for item in data]
        return jsonify(data_dicts)
    elif request.method == "POST":
        data = request.get_json()
        from models import SewaBarang
        data['harga'] = int(''.join(c for c in data['harga'] if c.isdigit()))
        new_item = SewaBarang(nama=data["nama"], harga=data["harga"])
        db.session.add(new_item)
        db.session.commit()
        socketio.emit("sewa_barang_updated", new_item.to_dict())
        return jsonify(new_item.to_dict()), 201


@app.route("/admin/sewa-barang/<int:id>", methods=["PUT", "DELETE"])
@jwt_required()
def sewa_barang_detail(id):
    from models import SewaBarang

    item = SewaBarang.query.get_or_404(id)
    if request.method == "PUT":
        data = request.get_json()
        item.nama = data["nama"]
        item.harga = int(''.join(c for c in data['harga'] if c.isdigit()))
        db.session.commit()
        socketio.emit("sewa_barang_updated", item.to_dict())
        return jsonify(item.to_dict()), 200
    elif request.method == "DELETE":
        db.session.delete(item)
        db.session.commit()
        socketio.emit("sewa_barang_deleted", id)
        return jsonify({"message": "Item deleted"}), 204


@app.route("/admin/change-layout/<int:num>", methods=["GET"])
@jwt_required()
def change_layout(num):
    socketio.emit("change_layout", {"layoutIndex": num})
    return jsonify({"message": "Layout change emitted", "layout_number": num})


# @app.route("/admin/reset-password", methods=["GET", "PUT"])
# @jwt_required
# def resetPassword():
#     pass


@app.route("/api/v1/data/umum", methods=["GET"])
def fetch_umum():
    from models import GeneralInfo

    data = GeneralInfo.query.all()
    data_dicts = [item.to_dict() for item in data]
    return jsonify(data_dicts)


@app.route("/api/v1/data/peraturan", methods=["GET"])
def fetch_peraturan():
    from models import Peraturan

    data = Peraturan.query.all()
    data_dicts = [item.to_dict() for item in data]
    return jsonify(data_dicts)


@app.route("/api/v1/data/kolam", methods=["GET"])
def fetch_kolam():
    from models import InformasiKolam

    data = InformasiKolam.query.all()
    data_dicts = [item.to_dict() for item in data]
    return jsonify(data_dicts)


@app.route("/api/v1/data/sewa-barang", methods=["GET"])
def fetch_sewa():
    from models import SewaBarang

    data = SewaBarang.query.all()
    data_dicts = [item.to_dict() for item in data]
    return jsonify(data_dicts)


if __name__ == "__main__":
    socketio.run(app)
