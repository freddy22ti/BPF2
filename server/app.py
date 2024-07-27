from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_jwt_extended import jwt_required
import os
import json
import uuid
from datetime import timedelta, datetime
from dotenv import load_dotenv

load_dotenv()
UPLOAD_FOLDER = "uploads"

app = Flask(__name__)
app.config.from_prefixed_env()
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("SQLALCHEMY_DATABASE_URI")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    hours=int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES"))
)

# upload image
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
app.config["CORS_HEADERS"] = "Content-Type"


# required object
db = SQLAlchemy(app)
migrate = Migrate(app, db)
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")

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

        data["harga"] = int("".join(c for c in data["harga"] if c.isdigit()))
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
        item.harga = int("".join(c for c in data["harga"] if c.isdigit()))
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


@app.route("/upload", methods=["POST"])
@jwt_required()
def upload_file():
    if "image" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    # Get the original file extension
    file_extension = os.path.splitext(file.filename)[1]
    # Generate a unique filename
    unique_filename = f"{uuid.uuid4().hex}{file_extension}"

    # Save the file with the new unique filename
    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(file_path)

    # Emit a socket event to notify the client about the new upload
    socketio.emit("image_added", {"filename": unique_filename})

    return jsonify({"filename": unique_filename}), 200


@app.route("/uploads/<filename>", methods=["GET"])
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route("/images", methods=["GET"])
def get_images():
    files = os.listdir(UPLOAD_FOLDER)
    return jsonify(files)


@app.route("/delete/<filename>", methods=["DELETE"], endpoint="delete_file")
@jwt_required()
def delete_file(filename):
    try:
        os.remove(os.path.join(UPLOAD_FOLDER, filename))
        # Emit a socket event to notify the client about the deletion
        socketio.emit("image_deleted", filename)
        return jsonify({"message": "File deleted successfully"}), 200
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/v1/data/events", methods=["GET"])
def fetch_event():
    from models import Event

    data = Event.query.all()
    data_dicts = [item.to_dict() for item in data]
    return jsonify(data_dicts), 200


@app.route("/admin/events", methods=["GET", "POST"])
@jwt_required()
def events():
    from models import Event
    if request.method == "GET":
        data = Event.query.all()
        data_dicts = [item.to_dict() for item in data]
        return jsonify(data_dicts), 200

    elif request.method == "POST":
        data = request.get_json()
        tanggal = datetime.strptime(data["tanggal"], "%Y-%m-%d").date()  # Convert string to date
        new_event = Event(tanggal=tanggal, deskripsi=data["deskripsi"])
        db.session.add(new_event)
        db.session.commit()
        socketio.emit("event_updated", new_event.to_dict())
        return jsonify(new_event.to_dict()), 201


@app.route("/admin/events/<int:id>", methods=["PUT", "DELETE"])
@jwt_required()
def event_detail(id):
    from models import Event
    event = Event.query.get_or_404(id)

    if request.method == "PUT":
        data = request.get_json()
        event.tanggal = datetime.strptime(data["tanggal"], "%Y-%m-%d").date()
        event.deskripsi = data["deskripsi"]
        db.session.commit()
        socketio.emit("event_updated", event.to_dict())
        return jsonify(event.to_dict()), 200

    elif request.method == "DELETE":
        db.session.delete(event)
        db.session.commit()
        socketio.emit("event_deleted", id)
        return jsonify({"message": "Event deleted"}), 204


if __name__ == "__main__":
    socketio.run(app)
