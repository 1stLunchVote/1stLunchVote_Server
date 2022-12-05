import { Router } from 'express';
import GroupContoller from '../controllers/GroupController';
import auth from '../middleware/auth';

const router: Router = Router();

router.post('/', auth, GroupContoller.postGroup);
router.patch('/:groupId/invite', auth, GroupContoller.inviteMember);
router.patch('/:groupId/join', auth, GroupContoller.inviteMember);

export default router;
