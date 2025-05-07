import Router from 'express';
import type { Request, Response } from 'express'
import Orden from '../../interfaces/Orden'
import Usuario from '../../interfaces/Usuario'
import Restaurante from '../../interfaces/Restaurante';
import mongoose from 'mongoose';

const router = Router();

router.get('/orders/count', async (req: Request, res: Response) => {
  const { status } = req.query as { status?: string };
  try {
    const count = await Orden.countDocuments(status ? { estado: status } : {});
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get('/orders/with-restaurant', async (req: Request, res: Response) => {
  try {
    const pipeline = [
      {
        $addFields: {
          restaurante_oid: {
            $toObjectId: '$restaurante_id',
          },
        },
      },
      {
        $lookup: {
          from: 'Restaurante',
          localField: 'restaurante_oid',
          foreignField: '_id',
          as: 'restaurante',
        },
      },
      {
        $unwind: '$restaurante',
      },
    ];

    const orders = await Orden.aggregate(pipeline);
    res.json(orders);
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Error desconocido' });
  }
});


router.patch('/users/:id/favorites', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, item } = req.body as { action: string; item: string };

  const validActions = ['push', 'addToSet', 'pull'];
  if (!validActions.includes(action)) {
    res.status(400).json({ error: 'Acción no válida' });
  }

  if (!item || typeof item !== 'string' || !item.trim()) {
    res.status(400).json({ error: 'Item debe ser un string no vacío' });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'ID no válido' });
    }

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $set: {
          favoritos: {
            $cond: {
              if: { $eq: [action, 'push'] },
              then: { $concatArrays: ['$favoritos', [item]] },
              else: {
                $cond: {
                  if: { $eq: [action, 'addToSet'] },
                  then: { $setUnion: ['$favoritos', [item]] },
                  else: { $setDifference: ['$favoritos', [item]] },
                },
              },
            },
          },
        },
      },
      {
        $merge: {
          into: 'usuarios',
          whenMatched: 'replace',
          whenNotMatched: 'discard',
        },
      },
    ];

    const result = await Usuario.aggregate(pipeline);

    const updatedDoc = await Usuario.findById(id);
    if (!updatedDoc) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ matched: 1, modified: result.length > 0 ? 1 : 0 });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Error desconocido' });
  }
});


router.patch('/restaurantes/:id/location', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { lat, lng, removeLocation } = req.body as {
    lat?: number;
    lng?: number;
    removeLocation?: boolean;
  };

  // Construir el objeto update dinámicamente
  const update: Record<string, any> = {};
  if (lat !== undefined || lng !== undefined) {
    update.$set = {};
    if (lat !== undefined) update.$set['ubicacion.lat'] = lat;
    if (lng !== undefined) update.$set['ubicacion.lng'] = lng;
  }
  if (removeLocation) {
    update.$unset = { ubicacion: '' };
  }

  if (!Object.keys(update).length) {
    res
      .status(400)
      .json({ error: 'Debes enviar al menos lat, lng, o removeLocation' });
  }

  try {
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'ID no válido' });
    }

    const result = await Restaurante.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      update
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ error: 'Restaurante no encontrado' });
    }

    res.json({
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (err: unknown) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Error desconocido' });
  }
});


export default router;
