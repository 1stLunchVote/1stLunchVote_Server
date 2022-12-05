import { Router } from 'express';
import UserContoller from '../controllers/UserController';
import auth from '../middleware/auth';

const router: Router = Router();

router.get('', auth, UserContoller.getUserInfo);
router.patch('/nickname', auth, UserContoller.updateUserNickname);

export default router;
