import mongoose from "mongoose";

const articuloMenuSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion: {
    type: String,
    required: true,
    trim: true,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  restaurante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurante",
    required: true,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: false,
});

export default mongoose.model("ArticuloMenu", articuloMenuSchema, "ArticuloMenu");
