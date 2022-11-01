import { Router } from 'express';
import LunchTemplateContoller from '../controllers/LunchTemplateController';
import auth from '../middleware/auth';

const router: Router = Router();

router.post('/', auth, LunchTemplateContoller.postLunchTemplate);
router.get('/', auth, LunchTemplateContoller.getAllLunchTemplate);

export default router;
