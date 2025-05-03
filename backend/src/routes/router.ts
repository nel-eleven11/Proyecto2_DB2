import { Router } from "express";
import v1router from "./v1/router_v1";

const router = Router(); 

router.use('/v1', v1router)

export default router;
