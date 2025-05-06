import mongoose from "mongoose";

const ubicacionSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

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
    type: ubicacionSchema,
    required: true
  },
  fecha_registro: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false,
});

export default mongoose.model(
  "Usuario",
  usuarioSchema,
  "Usuario"
);
