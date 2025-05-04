import mongoose from "mongoose";

const restauranteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  direccion: {
    type: String,
    required: true,
    trim: true,
  },
  ubicacion: {
    type: String,
    required: true,
    trim: true,
  },
  calificacion_promedio: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  categorias: [{
    type: String,
    trim: true,
  }],
}, {
  timestamps: false,
});

export default mongoose.model("Restaurante", restauranteSchema);
