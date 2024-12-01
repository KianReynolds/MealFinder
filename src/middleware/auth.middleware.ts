import { Request, Response, NextFunction } from 'express';

export const authenticateKey = async (req : Request, res : Response, next : NextFunction) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({'message' : 'Unauthorized: API key is missing'});
    }
    next();
};
