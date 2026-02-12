'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmissionFormData, ValidationErrors } from '@/types/submission';
import { validateSubmissionForm } from '@/utils/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function SubmissionForm() {
  const [formData, setFormData] = useState<SubmissionFormData>({
    name: '',
    role: '',
    advice: '',
    hiringTrait: '',
    consent: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      consent: checked,
    }));

    if (errors.consent) {
      setErrors((prev) => ({
        ...prev,
        consent: undefined,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    const fieldErrors = validateSubmissionForm(formData);

    if (fieldErrors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name as keyof ValidationErrors],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateSubmissionForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          role: formData.role.trim(),
          advice: formData.advice.trim(),
          hiringTrait: formData.hiringTrait.trim(),
          consent: formData.consent,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit');
      }

      const newSubmission = await response.json();

      toast({
        title: 'Success!',
        description: 'Taking you to the Wisdom Wall!',
      });

      // Redirect to wall and scroll to new card
      setTimeout(() => {
        router.push(`/wall?highlight=${newSubmission.id}`);
      }, 500);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCharacterCountColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return 'text-red-500';
    if (percentage >= 90) return 'text-orange-500';
    return 'text-muted-foreground';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="John Doe"
          className={errors.name ? 'border-red-500' : ''}
        />
        <div className="flex justify-between">
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          <p className={`text-sm ml-auto ${getCharacterCountColor(formData.name.length, 100)}`}>
            {formData.name.length}/100
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Your Role</Label>
        <Input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Senior Software Engineer"
          className={errors.role ? 'border-red-500' : ''}
        />
        <div className="flex justify-between">
          {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
          <p className={`text-sm ml-auto ${getCharacterCountColor(formData.role.length, 150)}`}>
            {formData.role.length}/150
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="advice">Your Advice</Label>
        <Textarea
          id="advice"
          name="advice"
          value={formData.advice}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          placeholder="Share your wisdom with the community..."
          className={errors.advice ? 'border-red-500' : ''}
        />
        <div className="flex justify-between">
          {errors.advice && <p className="text-sm text-red-500">{errors.advice}</p>}
          <p className={`text-sm ml-auto ${getCharacterCountColor(formData.advice.length, 300)}`}>
            {formData.advice.length}/300
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hiringTrait">One Trait You'd Hire For</Label>
        <Input
          type="text"
          id="hiringTrait"
          name="hiringTrait"
          value={formData.hiringTrait}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Curiosity"
          className={errors.hiringTrait ? 'border-red-500' : ''}
        />
        <div className="flex justify-between">
          {errors.hiringTrait && <p className="text-sm text-red-500">{errors.hiringTrait}</p>}
          <p className={`text-sm ml-auto ${getCharacterCountColor(formData.hiringTrait.length, 30)}`}>
            {formData.hiringTrait.length}/30
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox
          id="consent"
          checked={formData.consent}
          onCheckedChange={handleCheckboxChange}
          className={`mt-0.5 ${errors.consent ? 'border-red-500' : ''}`}
        />
        <div className="space-y-1">
          <Label htmlFor="consent" className="text-sm font-normal cursor-pointer">
            I agree to share my wisdom publicly on the Wisdom Wall
          </Label>
          {errors.consent && <p className="text-sm text-red-500">{errors.consent}</p>}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Share Your Wisdom'}
      </Button>
    </form>
  );
}
