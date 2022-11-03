import { Router } from 'express';
import GroupContoller from '../controllers/GroupController';
import auth from '../middleware/auth';

const router: Router = Router();

router.post('/', auth, GroupContoller.postGroup);
router.get('/', auth, GroupContoller.getAllGroup);
router.get('/:groupId', auth, GroupContoller.getGroup);
router.patch('/:groupId/invite', auth, GroupContoller.inviteMember);
router.patch('/:groupId/exile', auth, GroupContoller.exileMember);
router.patch('/:groupId/groupName', auth, GroupContoller.updateGroupName);

export default router;
