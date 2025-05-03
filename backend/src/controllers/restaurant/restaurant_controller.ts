import type { RequestHandler } from "express";
import Restaurante from "../../interfaces/Restaurante";
import ArticuloMenu from "../../interfaces/ArticuloMenu";
import Resena from "../../interfaces/Resena";
import mongoose from "mongoose";

export const createRestaurante: RequestHandler = async (req, res) => {
  try {
    const restaurante = new Restaurante(req.body);
    await restaurante.save();
    res.status(201).json(restaurante);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getRestaurantes: RequestHandler = async (req, res) => {
  try {
    const restaurantes = await Restaurante.find().populate("menu");
    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getRestauranteById: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const restaurante = await Restaurante.findById(req.params.id).populate("menu");
    if (!restaurante) {
      res.status(404).json({ error: "Restaurante not found" });
      return;
    }
    res.json(restaurante);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateRestaurante: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const restaurante = await Restaurante.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!restaurante) {
      res.status(404).json({ error: "Restaurante not found" });
      return;
    }
    res.json(restaurante);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteRestaurante: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const restaurante = await Restaurante.findByIdAndDelete(req.params.id);
    if (!restaurante) {
      res.status(404).json({ error: "Restaurante not found" });
      return;
    }
    res.json({ message: "Restaurante deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getRestauranteResenas: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const resenas = await Resena.find({ restaurante_id: req.params.id });
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createRestauranteResena: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const resenaData = {
      ...req.body,
      restaurante_id: req.params.id,
    };
    const resena = new Resena(resenaData);
    await resena.save();
    res.status(201).json(resena);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getRestauranteArticulos: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const articulos = await ArticuloMenu.find({ restaurante_id: req.params.id });
    res.json(articulos);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createRestauranteArticulo: RequestHandler = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const articuloData = {
      ...req.body,
      restaurante_id: req.params.id,
    };
    const articulo = new ArticuloMenu(articuloData);
    await articulo.save();
    await Restaurante.findByIdAndUpdate(req.params.id, {
      $push: { menu: articulo._id },
    });
    res.status(201).json(articulo);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
