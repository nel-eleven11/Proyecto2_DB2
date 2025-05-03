import type { RequestHandler } from "express";
import mongoose from "mongoose";
import ArticuloMenu from "../../interfaces/ArticuloMenu";
import Restaurante from "../../interfaces/Restaurante";

export const createArticulo: RequestHandler = async (req, res) => {
  try {
    const articulo = new ArticuloMenu(req.body);
    await articulo.save();
    await Restaurante.findByIdAndUpdate(req.body.restaurante_id, {
      $push: { menu: articulo._id },
    });
    res.status(201).json(articulo);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getArticulos: RequestHandler = async (req, res) => {
  try {
    const articulos = await ArticuloMenu.find().populate("restaurante_id");
    res.json(articulos);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getArticuloById: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return; 
    }
    const articulo = await ArticuloMenu.findById(req.params.id).populate("restaurante_id");
    if (!articulo) {
      res.status(404).json({ error: "Articulo not found" });
      return;
    }
    res.json(articulo);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateArticulo: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const articulo = await ArticuloMenu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!articulo) {
      res.status(404).json({ error: "Articulo not found" });
      return;
    }
    res.json(articulo);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteArticulo: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return; 
    }
    const articulo = await ArticuloMenu.findByIdAndDelete(req.params.id);
    if (!articulo) {
      res.status(404).json({ error: "Articulo not found" });
      return; 
    }
    await Restaurante.findByIdAndUpdate(articulo.restaurante_id, {
      $pull: { menu: articulo._id },
    });
    res.json({ message: "Articulo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
