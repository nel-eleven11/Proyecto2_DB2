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

export const createMultipleRestaurantes: RequestHandler = async (req, res) => {
  try {
    const restaurantesData = req.body;
    if (!Array.isArray(restaurantesData)) {
      res.status(400).json({ error: "Se esperaba un array de restaurantes" });
    }
    
    const restaurantes = await Restaurante.insertMany(restaurantesData, { ordered: false });
    res.status(201).json(restaurantes);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getRestaurantes: RequestHandler = async (req, res) => {
  try {
    const restaurantes = await Restaurante.find();
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
    const restaurante = await Restaurante.findById(req.params.id);
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

export const updateMultipleRestaurantes: RequestHandler = async (req, res) => {
  try {
    const { filter, update } = req.body;
    if (!filter || !update) {
      res.status(400).json({ error: "Se requiere filter y update en el body" });
    }

    const result = await Restaurante.updateMany(filter, update, {
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

export const deleteMultipleRestaurantes: RequestHandler = async (req, res) => {
  try {
    const { filter } = req.body;
    if (!filter) {
      res.status(400).json({ error: "Se requiere un filter en el body" });
    }

    const result = await Restaurante.deleteMany(filter);
    
    res.json({
      deletedCount: result.deletedCount,
      message: "Restaurantes eliminados exitosamente"
    });
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
    res.status(201).json(articulo);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getRestaurantesByCategories: RequestHandler = async (req, res) => {
  try {
    const { categories } = req.query;
    if (!categories) {
      res.status(400).json({ error: "El parámetro 'categories' es requerido" });
      return;
    }
    const cats = (categories as string)
      .split(",")
      .map(c => c.trim());
    const restaurantes = await Restaurante.find({ categorias: { $in: cats } });
    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


export const sortRestaurantesByRating: RequestHandler = async (req, res) => {
  try {
    const { order = "desc" } = req.query;
    const sortOrder: 1 | -1 = order === "asc" ? 1 : -1;
    const restaurantes = await Restaurante.find().sort({ calificacion_promedio: sortOrder });
    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getRestaurantesByName: RequestHandler = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      res.status(400).json({ error: "El parámetro 'nombre' es requerido" });
      return;
    }
    const regex = new RegExp(nombre as string, "i");
    const restaurantes = await Restaurante.find({ nombre: regex });
    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const queryRestaurantes: RequestHandler = async (req, res) => {
  try {
    // extraemos reservados y todo lo demás van a filtros
    const {
      sortField,
      sortOrder,
      skip,
      limit,
      fields,
      ...filters
    } = req.query;

    // construimos filterObj (igualdad estricta)
    const filterObj: Record<string, any> = {};
    Object.entries(filters).forEach(([key, val]) => {
      filterObj[key] = val;
    });

    // proyección
    let projection: Record<string, 1> = {};
    if (fields) {
      (fields as string)
        .split(",")
        .map(f => f.trim())
        .forEach(f => { projection[f] = 1; });
    }

    // arranco el query
    const q = Restaurante.find(filterObj).select(projection);

    // orden
    if (sortField && sortOrder) {
      const dir = sortOrder === "asc" ? 1 : -1;
      q.sort({ [sortField as string]: dir });
    }

    // skip y limit
    if (skip)  q.skip(Number(skip));
    if (limit) q.limit(Number(limit));

    const resultados = await q;
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
