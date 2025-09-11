import { Router } from 'express';
import {
  getFamilyMembers,
  getFamilyMember,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember
} from '../controllers/family.controller';
import { validateFamilyMember } from '../middleware/familymiddleware';
import { checkFamilyMemberExists } from '../middleware/familymiddleware';

const router = Router();

// Get all family members
router.get('/', getFamilyMembers);

// Get single family member
router.get('/:id', getFamilyMember);

// Create new family member
router.post('/', validateFamilyMember, createFamilyMember);

// Update family member
router.put('/:id', validateFamilyMember, checkFamilyMemberExists, updateFamilyMember);

// Delete family member
router.delete('/:id', checkFamilyMemberExists, deleteFamilyMember);

export default router;