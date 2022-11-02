import { Router } from 'express';
import GroupContoller from '../controllers/\bGroupController';
import auth from '../middleware/auth';

const router: Router = Router();

router.post('/', auth, GroupContoller.postGroup);

export default router;
