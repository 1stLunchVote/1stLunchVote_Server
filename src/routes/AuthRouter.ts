import { Router } from 'express';
import AuthContoller from '../controllers/AuthController';

const router: Router = Router();

router.post('/login/:social', AuthContoller.socialLogin);

export default router;
