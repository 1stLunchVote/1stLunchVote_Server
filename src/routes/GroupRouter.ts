import { Router } from 'express';
import GroupContoller from '../controllers/\bGroupController';
import auth from '../middleware/auth';

const router: Router = Router();

router.post('/', auth, GroupContoller.postGroup);
router.get('/', auth, GroupContoller.getAllGroup);

export default router;
