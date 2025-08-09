'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils/custom-format';

type BidFormData = {
  title: string;
  price_min: string;
  price_max: string;
  timeline_estimate: string;
  work_description: string;
  additional_notes: string;
};

type BidInfoSectionProps = {
  formData: BidFormData;
  onFormInputChange: (field: keyof BidFormData, value: string) => void;
  errors: Partial<Record<keyof BidFormData, string>>;
};

export function BidInfoSection({ formData, onFormInputChange, errors }: BidInfoSectionProps) {
  const handlePriceChange = (field: 'price_min' | 'price_max', value: string) => {
    const formatted = formatCurrency(value);
    onFormInputChange(field, formatted);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-roboto'>Your Bid Details</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Bid Title */}
        <div className='space-y-2'>
          <Label htmlFor='title' className='font-roboto'>
            Bid Title <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='title'
            value={formData.title}
            onChange={(e) => onFormInputChange('title', e.target.value)}
            placeholder='e.g., Professional Kitchen Plumbing Installation'
            className={`font-inter ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && <p className='font-inter text-sm text-red-600'>{errors.title}</p>}
        </div>

        {/* Price Range */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='price_min' className='font-roboto'>
              Minimum Price <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='price_min'
              type='text'
              inputMode='numeric'
              value={formData.price_min}
              onChange={(e) => handlePriceChange('price_min', e.target.value)}
              placeholder='e.g., 500'
              className={`font-inter ${errors.price_min ? 'border-red-500' : ''}`}
            />
            {errors.price_min && <p className='font-inter text-sm text-red-600'>{errors.price_min}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='price_max' className='font-roboto'>
              Maximum Price <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='price_max'
              type='text'
              inputMode='numeric'
              value={formData.price_max}
              onChange={(e) => handlePriceChange('price_max', e.target.value)}
              placeholder='e.g., 800'
              className={`font-inter ${errors.price_max ? 'border-red-500' : ''}`}
            />
            {errors.price_max && <p className='font-inter text-sm text-red-600'>{errors.price_max}</p>}
          </div>
        </div>

        {/* Timeline Estimate */}
        <div className='space-y-2'>
          <Label htmlFor='timeline_estimate' className='font-roboto'>
            Timeline Estimate <span className='text-red-500'>*</span>
          </Label>
          <Input
            id='timeline_estimate'
            value={formData.timeline_estimate}
            onChange={(e) => onFormInputChange('timeline_estimate', e.target.value)}
            placeholder='e.g., 2-3 days, 1 week, 2 weeks'
            className={`font-inter ${errors.timeline_estimate ? 'border-red-500' : ''}`}
          />
          {errors.timeline_estimate && <p className='font-inter text-sm text-red-600'>{errors.timeline_estimate}</p>}
          <p className='font-inter text-xs text-gray-500'>How long will this job take to complete?</p>
        </div>

        {/* Work Description */}
        <div className='space-y-2'>
          <Label htmlFor='work_description' className='font-roboto'>
            Detailed Work Description <span className='text-red-500'>*</span>
          </Label>
          <textarea
            id='work_description'
            value={formData.work_description}
            onChange={(e) => onFormInputChange('work_description', e.target.value)}
            placeholder='Describe in detail what work you will perform, your approach, materials you will use, and any guarantees you provide...'
            className={`w-full min-h-32 px-3 py-2 text-sm border rounded-md font-inter resize-y ${errors.work_description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.work_description && <p className='font-inter text-sm text-red-600'>{errors.work_description}</p>}
        </div>

        {/* Additional Notes */}
        <div className='space-y-2'>
          <Label htmlFor='additional_notes' className='font-roboto'>
            Additional Notes <span className='font-inter text-sm text-gray-500'>(Optional)</span>
          </Label>
          <textarea
            id='additional_notes'
            value={formData.additional_notes}
            onChange={(e) => onFormInputChange('additional_notes', e.target.value)}
            placeholder='Any additional information, special offers, or questions for the buyer...'
            className='w-full min-h-24 px-3 py-2 text-sm border rounded-md font-inter resize-y border-gray-300'
          />
        </div>
      </CardContent>
    </Card>
  );
}
