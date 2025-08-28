export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (
  name: string,
  value: string,
  rules: ValidationRules
): string => {
  if (rules.required && !value.trim()) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
  }

  if (rules.minLength && value.length < rules.minLength) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} must be less than ${rules.maxLength} characters`;
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} is invalid`;
  }

  if (rules.custom && !rules.custom(value)) {
    return `${name.charAt(0).toUpperCase() + name.slice(1)} is invalid`;
  }

  return '';
};

export const validateForm = (
  formData: Record<string, string>,
  validationRules: Record<string, ValidationRules>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(validationRules).forEach(key => {
    const error = validateField(key, formData[key], validationRules[key]);
    if (error) {
      errors[key] = error;
    }
  });

  return errors;
};