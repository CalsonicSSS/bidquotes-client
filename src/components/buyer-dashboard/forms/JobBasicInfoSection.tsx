'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils/custom-format';

const JOB_TYPES = ['Plumbing', 'Painting', 'Landscaping', 'Roofing', 'Indoor', 'Backyard', 'Fencing & Decking', 'Design'] as const;

type JobBasicInfoData = {
  title: string;
  job_type: string;
  job_budget: string;
  description: string;
  other_requirements: string;
};

type JobBasicInfoSectionProps = {
  formData: JobBasicInfoData;
  onFormInputChange: (field: keyof JobBasicInfoData, value: string) => void;
  errors: Partial<Record<keyof JobBasicInfoData, string>>;
};

export function JobBasicInfoSection({ formData, onFormInputChange, errors }: JobBasicInfoSectionProps) {
  const handleJobBudgetChange = (value: string) => {
    const formatted = formatCurrency(value);
    onFormInputChange('job_budget', formatted);
  };

  return (
    <>
      {/* Basic Job Information */}
      <Card>
        <CardHeader>
          <CardTitle className='font-roboto'>Job Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Job Title */}
          <div className='space-y-2'>
            <Label htmlFor='title' className='font-roboto'>
              Job Title <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='title'
              value={formData.title}
              onChange={(e) => onFormInputChange('title', e.target.value)}
              placeholder='e.g., Kitchen Plumbing Repair Needed'
              className={`font-inter ${errors.title ? 'border-red-500' : ''}`}
            />
            {errors.title && <p className='font-inter text-sm text-red-600'>{errors.title}</p>}
          </div>

          {/* Job Type */}
          <div className='space-y-2'>
            <Label htmlFor='job_type' className='font-roboto'>
              Job Type <span className='text-red-500'>*</span>
            </Label>
            <select
              id='job_type'
              value={formData.job_type}
              onChange={(e) => onFormInputChange('job_type', e.target.value)}
              className={`w-full h-9 px-3 py-1 text-sm border rounded-md font-inter ${errors.job_type ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value=''>Select a job type...</option>
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.job_type && <p className='font-inter text-sm text-red-600'>{errors.job_type}</p>}
          </div>

          {/* Job Budget */}
          <div className='space-y-2'>
            <Label htmlFor='job_budget' className='font-roboto'>
              Job Budget <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='job_budget'
              type='text'
              inputMode='numeric'
              value={formData.job_budget}
              onChange={(e) => handleJobBudgetChange(e.target.value)}
              placeholder='e.g., 500'
              className={`font-inter ${errors.job_budget ? 'border-red-500' : ''}`}
            />
            {errors.job_budget && <p className='font-inter text-sm text-red-600'>{errors.job_budget}</p>}
          </div>

          {/* Job Description */}
          <div className='space-y-2'>
            <Label htmlFor='description' className='font-roboto'>
              Job Description <span className='text-red-500'>*</span>
            </Label>
            <textarea
              id='description'
              value={formData.description}
              onChange={(e) => onFormInputChange('description', e.target.value)}
              placeholder='Describe your project in detail. Include what needs to be done, current issues, timeline preferences, and any specific requirements...'
              className={`w-full min-h-32 px-3 py-2 text-sm border rounded-md font-inter resize-y ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && <p className='font-inter text-sm text-red-600'>{errors.description}</p>}
          </div>

          {/* Additional Information */}
          <div className='space-y-2'>
            <Label htmlFor='additional_info' className='font-roboto'>
              Additional Information <span> (Optional) </span>
            </Label>
            <textarea
              id='additional_info'
              value={formData.other_requirements}
              onChange={(e) => onFormInputChange('other_requirements', e.target.value)}
              placeholder='Any special requirements, preferred timing, budget considerations, or other important details...'
              className={`w-full min-h-24 px-3 py-2 text-sm border rounded-md font-inter resize-y ${errors.other_requirements ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
