# create_data.py

import os
import csv
import random
from datetime import datetime, timedelta
from faker import Faker
from pymongo import MongoClient
from dotenv import load_dotenv
from bson import ObjectId

# ——— 1) configuración ———
load_dotenv()  # carga MONGO_URI y MONGO_DB de tu .env
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME   = os.getenv("DB_NAME", "mi_base_de_datos")

client = MongoClient(MONGO_URI)
db     = client[DB_NAME]
fake   = Faker()

# ——— 2) Función helper para volcar lista de ObjectId a CSV ———
def write_ids_csv(fieldname, ids, path):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow([fieldname])
        for _id in ids:
            w.writerow([str(_id)])

# ——— 3) Generadores ———

def gen_users(n):
    col = db.Usuario
    docs = []
    for _ in range(n):
        fecha_date = fake.date_between(start_date="-2y", end_date="today")  # -> datetime.date
        fecha_dt   = datetime.combine(fecha_date, datetime.min.time())
        docs.append({
            "nombre": fake.first_name(),
            "apellido": fake.last_name(),
            "correo": fake.unique.email(),
            "direccion": fake.address().replace("\n", ", "),
            "ubicacion": {
                "lat": float(fake.latitude()),
                "lng": float(fake.longitude())
            },
            "fecha_registro": fecha_dt
        })
    res = col.insert_many(docs)
    write_ids_csv("usuario_id", res.inserted_ids, "data/usuarios_ids.csv")
    return res.inserted_ids

def gen_restaurants(n):
    col = db.Restaurante
    docs = []
    for _ in range(n):
        docs.append({
            "nombre": fake.company(),
            "direccion": fake.address().replace("\n", ", "),
            "ubicacion": {
                "lat": float(fake.latitude()),
                "lng": float(fake.longitude())
            },
            "calificacion_promedio": round(random.uniform(2,5), 2),
            "categorias": random.sample(
                ["italiano","mexicano","japonés","cafetería","postres","fast food"], 
                k=random.randint(1,3)
            )
        })
    res = col.insert_many(docs)
    write_ids_csv("restaurante_id", res.inserted_ids, "data/restaurantes_ids.csv")
    return res.inserted_ids

def gen_menu_items(per_restaurant=15):
    col = db.ArticuloMenu
    docs = []
    for rid in [row[0] for row in csv.reader(open("data/restaurantes_ids.csv"))][1:]:
        for _ in range(per_restaurant):
            docs.append({
                "nombre":         fake.word().title(),
                "descripcion":    fake.sentence(nb_words=6),
                "precio":         round(random.uniform(2,30), 2),
                "restaurante_id": rid,
                "disponible":     fake.boolean(chance_of_getting_true=90)
            })
    res      = col.insert_many(docs)
    ids      = res.inserted_ids

    # Ahora volcamos un CSV completo con restaurante_id, articulo_id y precio:
    with open("data/articulos_menu.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["restaurante_id","articulo_id","precio"])
        writer.writeheader()
        for doc, art_id in zip(docs, ids):
            writer.writerow({
                "restaurante_id": doc["restaurante_id"],
                "articulo_id":    str(art_id),
                "precio":         doc["precio"]
            })

    # (Opcional) si aún quieres el CSV solo de IDs:
    write_ids_csv("articulo_id", ids, "data/articulos_menu_ids.csv")
    return ids

def gen_orders(count, per_restaurant):
    # 1) Cargo usuarios y restaurantes
    user_ids = [r[0] for r in csv.reader(open("data/usuarios_ids.csv"))][1:]
    rest_ids = [r[0] for r in csv.reader(open("data/restaurantes_ids.csv"))][1:]

    # 2) Cargo articulos_menu con precios en memoria
    menu_map = {}
    with open("data/articulos_menu.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            menu_map.setdefault(row["restaurante_id"], []).append(
                (row["articulo_id"], float(row["precio"]))
            )

    docs      = []
    orders_csv = []
    for _ in range(count):
        uid = random.choice(user_ids)
        rid = random.choice(rest_ids)

        lineas = []
        total  = 0
        for art_id, precio in random.sample(menu_map[rid], k=random.randint(1,5)):
            qty = random.randint(1,5)
            lineas.append({
                "articulo_id":     art_id,
                "cantidad":        qty,
                "precio_unitario": precio
            })
            total += precio * qty

        fecha   = fake.date_time_between(start_date="-6M", end_date="now")
        estado  = random.choice(["pendiente","en_progreso","completada","cancelada"])

        docs.append({
            "usuario_id":      uid,
            "restaurante_id":  rid,
            "articulos":       lineas,
            "estado":          estado,
            "total":           round(total,2),
            "fecha_pedido":    fecha
        })
        orders_csv.append({
            "usuario_id":     uid,
            "restaurante_id": rid,
            "fecha_pedido":   fecha.isoformat()
        })

    # 3) Inserto en bloque
    res = db.Orden.insert_many(docs)

    # 4) Genero CSV con los ObjectId reales
    with open("data/ordenes.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["orden_id","usuario_id","restaurante_id","fecha_pedido"])
        w.writeheader()
        for oid, row in zip(res.inserted_ids, orders_csv):
            w.writerow({
                "orden_id":       str(oid),
                "usuario_id":     row["usuario_id"],
                "restaurante_id": row["restaurante_id"],
                "fecha_pedido":   row["fecha_pedido"]
            })

    return res.inserted_ids


fake = Faker()

def gen_reviews():
    col = db.Resena
    docs = []

    # Leemos el CSV de órdenes que ya tiene orden_id, usuario_id, restaurante_id, fecha_pedido
    with open("data/ordenes.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 1) Convertimos la cadena ISO (con o sin microsegundos) a datetime
            try:
                start_dt = datetime.fromisoformat(row["fecha_pedido"])
            except ValueError:
                # Si acaso hay un offset que no soporta fromisoformat, lo eliminamos:
                start_dt = datetime.fromisoformat(
                    row["fecha_pedido"].split("+")[0]
                )

            # 2) Generamos la fecha de la reseña entre la fecha del pedido y ahora
            fecha = fake.date_time_between(
                start_date=start_dt,
                end_date="now"
            )

            docs.append({
                "usuario_id":     row["usuario_id"],
                "restaurante_id": row["restaurante_id"],
                "orden_id":       row["orden_id"],
                "calificacion":   random.randint(0,5),
                "comentario":     fake.sentence(nb_words=8),
                "fecha":          fecha
            })

    # Insertamos todo de una vez y volcamos IDs a CSV
    res = col.insert_many(docs)
    write_ids_csv("resena_id", res.inserted_ids, "data/resenas_ids.csv")
    return res.inserted_ids



# ——— 4) Main: orden de llamada ———
if __name__ == "__main__":
    print("Generando usuarios…");      gen_users(10000)
    print("Generando restaurantes…");  gen_restaurants(1000)
    print("Generando menú…");          gen_menu_items(15)
    print("Generando órdenes…");       gen_orders(20000, 15)
    print("Generando reseñas…");       gen_reviews()
    print("¡Listo!")
