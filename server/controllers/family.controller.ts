import { Request, Response } from "express";
import FamilyMember, { IFamilyMember } from "../models/family.model";

// @desc    Get all family members
// @route   GET /api/family
// @access  Public
export const getFamilyMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const familyMembers = await FamilyMember.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FamilyMember.countDocuments();

    res.status(200).json({
      success: true,
      count: familyMembers.length,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
      data: familyMembers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while fetching family members",
    });
  }
};

// @desc    Get single family member
// @route   GET /api/family/:id
// @access  Public
export const getFamilyMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const familyMember = await FamilyMember.findById(id);

    if (!familyMember) {
      res.status(404).json({
        success: false,
        error: "Family member not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: familyMember,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while fetching family member",
    });
  }
};

// @desc    Create new family member
// @route   POST /api/family
// @access  Public
export const createFamilyMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, fatherName, motherName, familyName, date } = req.body;

    const familyMember = new FamilyMember({
      username,
      fatherName,
      motherName,
      familyName,
      date: new Date(date),
    });

    const createdFamilyMember = await familyMember.save();

    res.status(201).json({
      success: true,
      data: createdFamilyMember,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Server error while creating family member",
    });
  }
};

// @desc    Update family member
// @route   PUT /api/family/:id
// @access  Public
export const updateFamilyMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, fatherName, motherName, familyName, date } = req.body;

    const updateData: Partial<IFamilyMember> = {};

    if (username) updateData.username = username;
    if (fatherName) updateData.fatherName = fatherName;
    if (motherName) updateData.motherName = motherName;
    if (familyName) updateData.familyName = familyName;
    if (date) updateData.date = new Date(date);

    const familyMember = await FamilyMember.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!familyMember) {
      res.status(404).json({
        success: false,
        error: "Family member not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: familyMember,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Server error while updating family member",
    });
  }
};

// @desc    Delete family member
// @route   DELETE /api/family/:id
// @access  Public

// Delete family member
export const deleteFamilyMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const familyMember = (req as any).familyMember;
    await familyMember.deleteOne();

    res.json({
      success: true,
      message: "Family member deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting family member:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Server error while deleting family member",
      });
  }
};
