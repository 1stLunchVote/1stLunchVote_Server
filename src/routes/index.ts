import { Router } from 'express';
import AuthRouter from './AuthRouter';
import UserRouter from './UserRouter';
import MenuRouter from './MenuRouter';
import LunchTemplateRouter from './LunchTemplateRouter';

const router: Router = Router();

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/menu', MenuRouter);
router.use('/lunchTemplate', LunchTemplateRouter);

export default router;
