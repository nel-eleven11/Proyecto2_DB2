import type { RequestHandler } from 'express';


export const healthcheck: RequestHandler = async (req, res) => {
    res.status(200).json({
        message: "I'm alive"
    })
};


