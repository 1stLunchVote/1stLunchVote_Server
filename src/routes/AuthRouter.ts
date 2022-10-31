import { Router } from 'express';
import AuthContoller from '../controllers/AuthController';

const router: Router = Router();

router.patch('/login/:social', AuthContoller.socialLogin);

export default router;
