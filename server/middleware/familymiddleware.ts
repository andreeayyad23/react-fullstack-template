import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import FamilyMember from '../models/family.model';

// Validation middleware
export const validateFamilyMember = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { username, fatherName, motherName, familyName, date } = req.body;
  const errors: string[] = [];

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.push('Username is required and must be a non-empty string');
  }
  if (!fatherName || typeof fatherName !== 'string' || fatherName.trim().length === 0) {
    errors.push('Father name is required and must be a non-empty string');
  }
  if (!motherName || typeof motherName !== 'string' || motherName.trim().length === 0) {
    errors.push('Mother name is required and must be a non-empty string');
  }
  if (!familyName || typeof familyName !== 'string' || familyName.trim().length === 0) {
    errors.push('Family name is required and must be a non-empty string');
  }
  if (!date || isNaN(new Date(date).getTime())) {
    errors.push('Date is required and must be a valid date');
  }

  if (errors.length > 0) {
    res.status(400).json({ success: false, error: 'Validation failed', messages: errors });
    return;
  }

  next();
};

// Check if family member exists
export const checkFamilyMemberExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // ✅ Prevent CastError
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, error: 'Invalid family member ID format' });
      return;
    }

    const familyMember = await FamilyMember.findById(id);

    if (!familyMember) {
      res.status(404).json({ success: false, error: 'Family member not found' });
      return;
    }

    (req as any).familyMember = familyMember;
    next();
  } catch (error) {
    console.error('❌ Middleware error:', error);
    res.status(500).json({ success: false, error: 'Server error while checking family member' });
  }
};
