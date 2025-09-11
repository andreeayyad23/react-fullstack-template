import React, { useState } from 'react';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import familyMemberService from '../../services/familyApi';
import { useTranslation } from 'react-i18next'; // 👈 Import useTranslation

// Form data
interface FormData {
  username: string;
  fatherName: string;
  motherName: string;
  familyName: string;
  date: string;
}

// Form errors
interface FormErrors {
  username?: string;
  fatherName?: string;
  motherName?: string;
  familyName?: string;
  date?: string;
  general?: string;
}

// API response
interface FamilyMember {
  _id: string;
  username: string;
  fatherName: string;
  motherName: string;
  familyName: string;
  date: string;
}

interface ApiResponse<T> {
  data: T;
}

const FamilyMemberCreate: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation(); // 👈 Destructure t from useTranslation

  const [formData, setFormData] = useState<FormData>({
    username: '',
    fatherName: '',
    motherName: '',
    familyName: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Mutation
  const mutation: UseMutationResult<ApiResponse<FamilyMember>, Error, FormData> = useMutation({
    mutationFn: (newMember: FormData) => familyMemberService.createFamilyMember(newMember) as Promise<ApiResponse<FamilyMember>>,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['familyMembers'] });

      const id = response.data?._id;
      router.navigate({ to: id ? `/family/${id}` : '/' }); // Removed unnecessary "as any"
    },
    onError: (err: Error) => {
      setErrors({ general: err.message || t('family.create.error.message') }); // 👈 Use t() here too
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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

    if (!formData.username.trim()) newErrors.username = t('family.create.errors.username.required');
    else if (formData.username.trim().length < 3) newErrors.username = t('family.create.errors.username.minLength');

    if (!formData.fatherName.trim()) newErrors.fatherName = t('family.create.errors.fatherName.required');
    if (!formData.motherName.trim()) newErrors.motherName = t('family.create.errors.motherName.required');
    if (!formData.familyName.trim()) newErrors.familyName = t('family.create.errors.familyName.required');

    if (!formData.date) newErrors.date = t('family.create.errors.date.required');
    else if (isNaN(new Date(formData.date).getTime())) newErrors.date = t('family.create.errors.date.invalid');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-bold text-white">{t('family.create.title')}</h1>
            <p className="mt-2 text-blue-100">{t('family.create.description')}</p>
          </div>

          <div className="p-6 sm:p-10">
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{t('family.create.error.title')}:</span>
                </div>
                <p className="mt-2 ml-7">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {['username', 'fatherName', 'motherName', 'familyName'].map(field => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {t(`family.create.form.${field}`)} *
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
                        placeholder={t(`family.create.form.placeholder.${field}`)}
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
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">{t('family.create.form.dateOfBirth')} *</label>
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
                  onClick={() => router.navigate({ to: '/' })}
                  className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('family.create.backButton')}
                </button>

                <button
                  type="submit"
                  disabled={mutation.status === 'pending'}
                  className={`w-full sm:w-auto px-6 py-3 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 flex items-center justify-center ${
                    mutation.status === 'pending'
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:ring-blue-500 shadow-md hover:shadow-lg'
                  }`}
                >
                  {mutation.status === 'pending' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('family.create.creatingButton')}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {t('family.create.createButton')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberCreate;