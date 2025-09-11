// src/services/familyMemberService.ts

import type { IFamilyMember } from "../features/FamilyFeatures/Types/familyTpes";
import { apiClient } from './authApi';
// Define the shape of our API responses
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
   familyMembers?: T[];
  count?: number;
  pagination?: {
    page: number;
    pages: number;
    total: number;
  };
}

// Family Member Service
const familyMemberService = {
  // Get all family members with pagination
  getFamilyMembers: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get<ApiResponse<IFamilyMember[]>>(
      `/api/v1/family?page=${page}&limit=${limit}` // Added /api/v1/ prefix
    );
    return response.data;
  },

  // Get a single family member by ID
  getFamilyMember: async (id: string) => {
    const response = await apiClient.get<ApiResponse<IFamilyMember>>(
      `/api/v1/family/${id}` // Added /api/v1/ prefix
    );
    return response.data;
  },

  // Create a new family member
  createFamilyMember: async (familyMemberData: Omit<IFamilyMember, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await apiClient.post<ApiResponse<IFamilyMember>>(
      '/api/v1/family', // Added /api/v1/ prefix
      familyMemberData
    );
    return response.data;
  },

  // Update an existing family member
  updateFamilyMember: async (id: string, familyMemberData: Partial<Omit<IFamilyMember, '_id' | 'createdAt' | 'updatedAt'>>) => {
    const response = await apiClient.put<ApiResponse<IFamilyMember>>(
      `/api/v1/family/${id}`, // Added /api/v1/ prefix
      familyMemberData
    );
    return response.data;
  },

  // Delete a family member
  deleteFamilyMember: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<object>>(
      `/api/v1/family/${id}` // Added /api/v1/ prefix
    );
    return response.data;
  },
};

export default familyMemberService;