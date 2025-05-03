import { Router } from 'express';
import { healthcheck } from '../controllers/healthcheck/healthcheck';

const healthcheck_router = Router();

healthcheck_router.get('/', healthcheck);

export default healthcheck_router;
