import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FamilyMemberFormData, FamilyMemberUpdateData } from '../features/FamilyFeatures/Types/familyTpes';
import familyMemberService from '../services/familyApi';


// Custom hook for getting all family members with pagination
export const useFamilyMembers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['familyMembers', page, limit],
    queryFn: () => familyMemberService.getFamilyMembers(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Custom hook for getting a single family member
export const useFamilyMember = (id: string) => {
  return useQuery({
    queryKey: ['familyMember', id],
    queryFn: () => familyMemberService.getFamilyMember(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Custom hook for creating a family member
export const useCreateFamilyMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (familyMemberData: FamilyMemberFormData) => 
      familyMemberService.createFamilyMember(familyMemberData),
    onSuccess: () => {
      // Invalidate and refetch family members list
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
    },
  });
};

// Custom hook for updating a family member
export const useUpdateFamilyMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FamilyMemberUpdateData }) => 
      familyMemberService.updateFamilyMember(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific family member and list
      queryClient.invalidateQueries({ queryKey: ['familyMember', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
    },
  });
};

// Custom hook for deleting a family member
export const useDeleteFamilyMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => familyMemberService.deleteFamilyMember(id),
    onSuccess: () => {
      // Invalidate family members list
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });
    },
  });
};