import type { RequestHandler } from "express";
import mongoose from "mongoose";
import Orden from "../../interfaces/Orden";

export const createOrden: RequestHandler = async (req, res) => {
  try {
    const orden = new Orden(req.body);
    await orden.save();
    res.status(201).json(orden);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getOrdenes: RequestHandler = async (req, res) => {
  try {
    const ordenes = await Orden.find().populate("usuario_id restaurante_id articulos.articulo_id");
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getOrdenById: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const orden = await Orden.findById(req.params.id).populate("usuario_id restaurante_id articulos.articulo_id");
    if (!orden) {
      res.status(404).json({ error: "Orden not found" });
      return;
    }
    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateOrden: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const orden = await Orden.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!orden) {
      res.status(404).json({ error: "Orden not found" });
      return;
    }
    res.json(orden);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteOrden: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const orden = await Orden.findByIdAndDelete(req.params.id);
    if (!orden) {
      res.status(404).json({ error: "Orden not found" });
      return;
    }
    res.json({ message: "Orden deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
