import { Router } from "express";
import userRouter from "./users_routes";  
import restaurantRouter from "./restaurant_routes"
import orderRouter from "./orders_routes";
import ratingRouter from "./rating_routes";
import manuArticluesrouter from "./menu_articles_routes";
import healthcheck_router from "./utils/healthcheck_router";
import auth_router from "./utils/auth_router";
import aggregations_router from './agregations'

const router = Router();

router.use('/usuarios', userRouter);
router.use('/restaurantes', restaurantRouter);
router.use('/ordenes', orderRouter);
router.use('/rating', ratingRouter);
router.use('/articulos', manuArticluesrouter);
router.use('/healthcheck', healthcheck_router);
router.use('/auth', auth_router);
router.use('/agregaciones', aggregations_router)

export default router;
