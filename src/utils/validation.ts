import { SubmissionFormData, ValidationErrors } from '@/types/submission';

export function validateSubmissionForm(data: SubmissionFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Name must be 100 characters or less';
  }

  if (!data.role || data.role.trim().length === 0) {
    errors.role = 'Role is required';
  } else if (data.role.length > 150) {
    errors.role = 'Role must be 150 characters or less';
  }

  if (!data.advice || data.advice.trim().length === 0) {
    errors.advice = 'Advice is required';
  } else if (data.advice.length > 300) {
    errors.advice = 'Advice must be 300 characters or less';
  }

  if (!data.hiringTrait || data.hiringTrait.trim().length === 0) {
    errors.hiringTrait = 'Hiring trait is required';
  } else if (data.hiringTrait.length > 30) {
    errors.hiringTrait = 'Hiring trait must be 30 characters or less';
  } else {
    const wordCount = data.hiringTrait.trim().split(/\s+/).length;
    if (wordCount > 3) {
      errors.hiringTrait = 'Hiring trait must be maximum 3 words';
    }
  }

  if (!data.consent) {
    errors.consent = 'You must agree to share your wisdom publicly';
  }

  return errors;
}
