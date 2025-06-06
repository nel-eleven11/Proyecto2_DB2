import mongoose from "mongoose";
import Usuario from "../../interfaces/Usuario";
import Orden from "../../interfaces/Orden";
import type { Request, RequestHandler, Response } from "express";

export const createUsuario: RequestHandler = async (req: Request, res: Response) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const createMultipleUsuarios: RequestHandler = async (req: Request, res: Response) => {
  try {
    const usuariosData = req.body;
    if (!Array.isArray(usuariosData)) {
      res.status(400).json({ error: "Se esperaba un array de usuarios" });
    }
    
    const usuarios = await Usuario.insertMany(usuariosData, { ordered: false });
    res.status(201).json(usuarios);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUsuarios: RequestHandler = async (req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUsuarioById: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      res.status(404).json({ error: "Usuario not found" });
      return;
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateUsuario: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!usuario) {
      res.status(404).json({ error: "Usuario not found" });
      return;
    }
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateMultipleUsuarios: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { filter, update } = req.body;
    if (!filter || !update) {
      res.status(400).json({ error: "Se requiere filter y update en el body" });
    }

    const result = await Usuario.updateMany(filter, update, {
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

export const deleteUsuario: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      res.status(404).json({ error: "Usuario not found" });
      return;
    }
    res.json({ message: "Usuario deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteMultipleUsuarios: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { filter } = req.body;
    if (!filter) {
      res.status(400).json({ error: "Se requiere un filter en el body" });
    }

    const result = await Usuario.deleteMany(filter);
    
    res.json({
      deletedCount: result.deletedCount,
      message: "Usuarios eliminados exitosamente"
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUsuarioOrdenes: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const ordenes = await Orden.find({ usuario_id: req.params.id });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createUsuarioOrden: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400).json({ error: "Invalid ID format" });
      return;
    }
    const ordenData = {
      ...req.body,
      usuario_id: req.params.id,
    };
    const orden = new Orden(ordenData);
    await orden.save();
    res.status(201).json(orden);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUsuariosByNameOrApellido: RequestHandler = async (req, res) => {
  try {
    const { nombre, apellido } = req.query;
    if (!nombre && !apellido) {
      res.status(400).json({ error: "Debe proporcionar 'nombre' o 'apellido'" });
      return;
    }
    const filters: Record<string, any>[] = [];
    if (nombre)   filters.push({ nombre:   new RegExp(nombre as string,   "i") });
    if (apellido) filters.push({ apellido: new RegExp(apellido as string, "i") });
    const usuarios = await Usuario.find({ $or: filters });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const sortUsuariosByFechaRegistro: RequestHandler = async (req, res) => {
  try {
    const { order = "desc" } = req.query;
    const sortOrder: 1 | -1 = order === "asc" ? 1 : -1;
    const usuarios = await Usuario.find().sort({ fecha_registro: sortOrder });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const queryUsuarios: RequestHandler = async (req, res) => {
  try {
    const { sortField, sortOrder, skip, limit, fields, ...filters } = req.query;
    const filterObj: Record<string, any> = {};
    Object.entries(filters).forEach(([k, v]) => { filterObj[k] = v; });

    let projection: Record<string, 1> = {};
    if (fields) {
      (fields as string).split(",").map(f => f.trim()).forEach(f => { projection[f] = 1; });
    }

    const q = Usuario.find(filterObj).select(projection);
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
