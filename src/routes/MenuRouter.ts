import { Router } from 'express';
import MenuContoller from '../controllers/MenuController';
import auth from '../middleware/auth';

const router: Router = Router();

router.get('/', auth, MenuContoller.getAllMenu);

export default router;
