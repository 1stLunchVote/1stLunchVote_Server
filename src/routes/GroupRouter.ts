import { Router } from 'express';
import GroupContoller from '../controllers/GroupController';
import auth from '../middleware/auth';

const router: Router = Router();

router.post('/', auth, GroupContoller.postGroup);
router.get('/:groupId', auth, GroupContoller.getGroup);
router.patch('/:groupId/invite', auth, GroupContoller.inviteMember);
router.patch('/:groupId/join', auth, GroupContoller.joinGroup);
router.patch('/:groupId/vote/first', auth, GroupContoller.firstVote);
router.get('/:groupId/vote/first/status', auth, GroupContoller.getFirstVoteStatus);
router.get('/:groupId/vote/first/result', auth, GroupContoller.getFirstVoteResult);
router.patch('/:groupId/vote/second', auth, GroupContoller.secondVote);
router.get('/:groupId/vote/second/status', auth, GroupContoller.getSecondVoteStatus);
router.get('/:groupId/vote/second/result', auth, GroupContoller.getSecondVoteResult);

export default router;
