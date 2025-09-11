import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from '@tanstack/react-router';
import { useFamilyMember, useUpdateFamilyMember } from '../../mutation/familyMutation';
// Types (you can import these from your types file)
interface FormData {
  username: string;
  fatherName: string;
  motherName: string;
  familyName: string;
  date: string;
}

interface FormErrors {
  username?: string;
  fatherName?: string;
  motherName?: string;
  familyName?: string;
  date?: string;
  general?: string;
}


const FamilyMemberEdit: React.FC = () => {
  const router = useRouter();
  const { familyMemberId } = useParams({ strict: false }) as { familyMemberId: string };

  const [formData, setFormData] = useState<FormData>({
    username: '',
    fatherName: '',
    motherName: '',
    familyName: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Use custom hooks
  const { data: familyMemberData, isLoading, isError } = useFamilyMember(familyMemberId);
  const updateMutation = useUpdateFamilyMember();

  // Initialize form when data loads
  useEffect(() => {
    if (familyMemberData?.data) {
      const member = familyMemberData.data;
      setFormData({
        username: member.username || '',
        fatherName: member.fatherName || '',
        motherName: member.motherName || '',
        familyName: member.familyName || '',
        date: member.date ? member.date.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  }, [familyMemberData]);

  // Handle general error from query
  useEffect(() => {
    if (isError) {
      setErrors({ general: 'Failed to load family member. Please try again later.' });
    }
  }, [isError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field if it had one
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name as keyof FormErrors];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.trim().length < 3) newErrors.username = 'Username must be at least 3 characters';

    if (!formData.fatherName.trim()) newErrors.fatherName = 'Father name is required';
    if (!formData.motherName.trim()) newErrors.motherName = 'Mother name is required';
    if (!formData.familyName.trim()) newErrors.familyName = 'Family name is required';

    if (!formData.date) newErrors.date = 'Date is required';
    else if (isNaN(new Date(formData.date).getTime())) newErrors.date = 'Invalid date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateMutation.mutate(
      { id: familyMemberId, data: formData },
      {
        onSuccess: () => {
          router.navigate({ to: `/family/${familyMemberId}` });
        },
        onError: (error) => {
          setErrors({ general: error.message || 'Failed to update family member. Please try again.' });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading family member...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-white">Edit Family Member</h1>
            <p className="mt-2 text-blue-100">Update the details below to edit this family member</p>
          </div>

          <div className="p-6 sm:p-10">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Error:</span>
                </div>
                <p className="mt-2 ml-7">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {['username', 'fatherName', 'motherName', 'familyName'].map(field => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {field.replace(/([A-Z])/g, ' $1')} *
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id={field}
                        name={field}
                        value={formData[field as keyof FormData]}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                          errors[field as keyof FormErrors]
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                      />
                    </div>
                    {errors[field as keyof FormErrors] && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors[field as keyof FormErrors]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.date 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.date}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 space-y-4 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => router.navigate({ to: `/family/${familyMemberId}` })}
                  className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className={`w-full sm:w-auto px-6 py-3 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 flex items-center justify-center ${
                    updateMutation.isPending
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:ring-blue-500 shadow-md hover:shadow-lg'
                  }`}
                >
                  {updateMutation.isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Update Family Member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>All fields marked with * are required</p>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberEdit;