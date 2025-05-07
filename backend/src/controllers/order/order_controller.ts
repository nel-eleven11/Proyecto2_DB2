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

export const createMultipleOrdenes: RequestHandler = async (req, res) => {
  try {
    const ordenesData = req.body;
    if (!Array.isArray(ordenesData)) {
      res.status(400).json({ error: "Se esperaba un array de órdenes" });
    }
    
    const ordenes = await Orden.insertMany(ordenesData, { ordered: false });
    res.status(201).json(ordenes);
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

export const updateMultipleOrdenes: RequestHandler = async (req, res) => {
  try {
    const { filter, update } = req.body;
    if (!filter || !update) {
      res.status(400).json({ error: "Se requiere filter y update en el body" });
    }

    const result = await Orden.updateMany(filter, update, {
      runValidators: true
    });
    
    res.json({
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });
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

export const deleteMultipleOrdenes: RequestHandler = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter) {
      res.status(400).json({ error: "Se requiere un filter en el body" });
    }

    const result = await Orden.deleteMany(filter);
    
    res.json({
      deletedCount: result.deletedCount,
      message: "Órdenes eliminadas exitosamente"
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getOrdenesByEstado: RequestHandler = async (req, res) => {
  try {
    const { estado } = req.query;
    if (!estado) {
      res.status(400).json({ error: "El parámetro 'estado' es requerido" });
      return;
    }
    const ordenes = await Orden
      .find({ estado: estado as string })
      .populate("usuario_id restaurante_id articulos.articulo_id");
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getOrdenesByRestaurant: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Formato de ID inválido" });
      return;
    }
    const ordenes = await Orden
      .find({ restaurante_id: id })
      .populate("usuario_id restaurante_id articulos.articulo_id");
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const sortOrdenesByDate: RequestHandler = async (req, res) => {
  try {
    const { order = "desc" } = req.query;
    const sortOrder: 1 | -1 = order === "asc" ? 1 : -1;
    const ordenes = await Orden
      .find()
      .sort({ fecha_pedido: sortOrder })
      .populate("usuario_id restaurante_id articulos.articulo_id");
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const sortOrdenesByTotal: RequestHandler = async (req, res) => {
  try {
    const { order = "asc" } = req.query;
    const sortOrder: 1 | -1 = order === "asc" ? 1 : -1;
    const ordenes = await Orden
      .find()
      .sort({ total: sortOrder })
      .populate("usuario_id restaurante_id articulos.articulo_id");
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const queryOrdenes: RequestHandler = async (req, res) => {
  try {
    const { sortField, sortOrder, skip, limit, fields, ...filters } = req.query;
    const filterObj: Record<string, any> = {};
    Object.entries(filters).forEach(([k, v]) => { filterObj[k] = v; });

    let projection: Record<string, 1> = {};
    if (fields) {
      (fields as string).split(",").map(f => f.trim()).forEach(f => { projection[f] = 1; });
    }

    const q = Orden.find(filterObj)
      .select(projection)
      .populate("usuario_id restaurante_id articulos.articulo_id");

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
