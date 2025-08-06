'use client';

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';

type ImageUploadSectionProps = {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  title?: string;
  description?: string;
  isLoading?: boolean;
  disabled?: boolean;
};

export function ImageUploadSection({
  images,
  onImagesChange,
  maxImages = 6,
  title = 'Job Photos',
  description = `Optional, max ${maxImages} images`,
  isLoading = false,
  disabled = false,
}: ImageUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed per job`);
      return;
    }

    onImagesChange([...images, ...files]);

    // Clear the input so same file can be selected again if removed and re-added
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='font-roboto'>Additional Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-8'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2'></div>
              <p className='font-inter text-sm text-gray-600'>Loading images...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-3'>
      <Label className='font-roboto'>
        {title}
        <span className='font-inter text-sm text-gray-500 ml-2'>({description})</span>
      </Label>

      <div className='flex items-center gap-4'>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          multiple
          onChange={handleImageUpload}
          className='hidden'
          id='image-upload'
          disabled={disabled || images.length >= maxImages}
        />
        <label
          htmlFor='image-upload'
          className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-inter cursor-pointer hover:bg-gray-50 ${
            disabled || images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Plus className='h-4 w-4' />
          Add Photos
        </label>
        <p className='font-inter text-xs text-gray-500'>
          {images.length}/{maxImages} images
        </p>
      </div>

      {images.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
          {images.map((file, index) => (
            <div key={`${file.name}-${index}`} className='relative group'>
              <img src={URL.createObjectURL(file)} alt={`Upload ${index + 1}`} className='w-full h-24 object-cover rounded-lg border' />
              {!disabled && (
                <button
                  type='button'
                  onClick={() => removeImage(index)}
                  className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <X className='h-3 w-3' />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
