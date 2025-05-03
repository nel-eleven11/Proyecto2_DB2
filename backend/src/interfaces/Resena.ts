import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
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
  orden_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Orden",
    required: true,
  },
  calificacion: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  comentario: {
    type: String,
    trim: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
});

export default mongoose.model("Resena", resenaSchema);
