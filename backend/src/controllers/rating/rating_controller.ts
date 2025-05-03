import type { RequestHandler } from "express";
import mongoose from "mongoose";
import Resena from "../../interfaces/Resena";

export const createResena: RequestHandler = async (req, res) => {
  try {
    const resena = new Resena(req.body);
    await resena.save();
    res.status(201).json(resena);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getResenas: RequestHandler = async (req, res) => {
  try {
    const resenas = await Resena.find().populate("usuario_id restaurante_id orden_id");
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getResenaById: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return; 
    }
    const resena = await Resena.findById(req.params.id).populate("usuario_id restaurante_id orden_id");
    if (!resena) {
      res.status(404).json({ error: "Reseña not found" });
      return; 
    }
    res.json(resena);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateResena: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return; 
    }
    const resena = await Resena.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resena) {
      res.status(404).json({ error: "Reseña not found" });
      return; 
    }
    res.json(resena);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteResena: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return; 
    }
    const resena = await Resena.findByIdAndDelete(req.params.id);
    if (!resena) {
      res.status(404).json({ error: "Reseña not found" });
      return; 
    }
    res.json({ message: "Reseña deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
