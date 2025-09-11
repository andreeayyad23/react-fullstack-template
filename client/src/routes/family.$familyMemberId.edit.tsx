// src/routes/family_/$familyMemberId.edit.tsx
import { createFileRoute } from '@tanstack/react-router';
import FamilyMemberEdit from '../features/FamilyFeatures/FamilyMemberEdit';

export const Route = createFileRoute('/family/$familyMemberId/edit')({
  component: FamilyMemberEdit,
});