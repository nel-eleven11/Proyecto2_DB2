import mongoose from "mongoose";

const articuloSchema = new mongoose.Schema({
  articulo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ArticuloMenu",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
  precio_unitario: {
    type: Number,
    required: true,
    min: 0,
  },
});

const ordenSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  restaurante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurante",
    required: true,
  },
  articulos: [articuloSchema],
  estado: {
    type: String,
    required: true,
    enum: ["pendiente", "en_progreso", "completada", "cancelada"],
    default: "pendiente",
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  fecha_pedido: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
});

export default mongoose.model("Orden", ordenSchema);
