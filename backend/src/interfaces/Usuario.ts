import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
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
  fecha_registro: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
});

export default mongoose.model("Usuario", usuarioSchema);
