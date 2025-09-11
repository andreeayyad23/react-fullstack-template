import { createFileRoute } from '@tanstack/react-router'
import FamilyMembersList from '../features/FamilyFeatures/FamilyMembersList'

export const Route = createFileRoute('/family/')({
  component: FamilyMembersList,
})