from models import GeneralInfo, InformasiKolam, Peraturan, SewaBarang, User
import json
from app import db


def seed_data():
    if not User.query.first():
        default_user = User(username="admin")
        default_user.set_password("admin")
        db.session.add(default_user)

    if not GeneralInfo.query.first():
        default_info = GeneralInfo(
            nama="Refena Water Park",
            alamat="Jl. Nelayan Ujung No.1 Sri Meranti - Rumbai",
            kontak="082284988998",
            sosialMedia="@revena fb:revena",
            jadwalDanHarga=json.dumps(
                [
                    {"waktu": "Senin - Jum'at", "harga": "25000"},
                    {"waktu": "Weekend", "harga": "35000"},
                ]
            ),
            jamOperasional="08:00 - 18:00",
            tinggiAnak=60,
            tinggiDewasa=160,
        )
        db.session.add(default_info)

    db.session.commit()
