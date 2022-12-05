import { Router } from 'express';
import GroupContoller from '../controllers/GroupController';
import auth from '../middleware/auth';

const router: Router = Router();

router.post('/', auth, GroupContoller.postGroup);
router.get('/:groupId', auth, GroupContoller.getGroup);
router.patch('/:groupId/invite', auth, GroupContoller.inviteMember);
router.patch('/:groupId/join', auth, GroupContoller.joinGroup);

export default router;
