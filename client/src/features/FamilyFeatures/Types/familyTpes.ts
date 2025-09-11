export interface IFamilyMember {
  _id: string;
  username: string;
  fatherName: string;
  motherName: string;
  familyName: string;
  date: string; // ISO date string
  
  createdAt: string;
  updatedAt: string;
}

// Create form data type (without _id, createdAt, updatedAt)
export type FamilyMemberFormData = Omit<IFamilyMember, '_id' | 'createdAt' | 'updatedAt'>;

// Update form data type (partial fields)
export type FamilyMemberUpdateData = Partial<FamilyMemberFormData>;