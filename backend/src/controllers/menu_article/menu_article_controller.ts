import type { RequestHandler } from "express";
import mongoose from "mongoose";
import ArticuloMenu from "../../interfaces/ArticuloMenu";
import Restaurante from "../../interfaces/Restaurante";

export const createArticulo: RequestHandler = async (req, res) => {
  try {
    const articulo = new ArticuloMenu(req.body);
    await articulo.save();
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
    res.json({ message: "Articulo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const sortArticulosByPrice: RequestHandler = async (req, res) => {
  try {
    const { order = "asc" } = req.query;
    const sortOrder: 1 | -1 = order === "asc" ? 1 : -1;
    const articulos = await ArticuloMenu.find().sort({ precio: sortOrder });
    res.json(articulos);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAvailableArticulos: RequestHandler = async (_req, res) => {
  try {
    const articulos = await ArticuloMenu.find({ disponible: true });
    res.json(articulos);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getArticulosByPrice: RequestHandler = async (req, res) => {
  try {
    const { precio } = req.query;
    if (precio == null) {
      return res.status(400).json({ error: "El parámetro 'precio' es requerido" });
    }
    const articulos = await ArticuloMenu.find({ precio: Number(precio) });
    res.json(articulos);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const queryArticulos: RequestHandler = async (req, res) => {
  try {
    const { sortField, sortOrder, skip, limit, fields, ...filters } = req.query;
    const filterObj: Record<string, any> = {};
    Object.entries(filters).forEach(([k, v]) => { filterObj[k] = v; });

    let projection: Record<string, 1> = {};
    if (fields) {
      (fields as string).split(",").map(f => f.trim()).forEach(f => { projection[f] = 1; });
    }

    const q = ArticuloMenu.find(filterObj).select(projection);
    if (sortField && sortOrder) {
      q.sort({ [sortField as string]: (sortOrder === "asc" ? 1 : -1) });
    }
    if (skip)  q.skip(Number(skip));
    if (limit) q.limit(Number(limit));

    res.json(await q);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

