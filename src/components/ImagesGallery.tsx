'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type JobImage = {
  id: string;
  image_url: string;
  image_order: number;
};

type JobImagesGalleryProps = {
  images: JobImage[];
};

export function ImagesGallery({ images }: JobImagesGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const sortedImages = [...images].sort((a, b) => a.image_order - b.image_order);

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : sortedImages.length - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex < sortedImages.length - 1 ? selectedImageIndex + 1 : 0);
    }
  };

  if (sortedImages.length === 0) return null;

  return (
    <>
      {/* Image Grid */}
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'>
        {sortedImages.map((image, index) => (
          <div
            key={image.id}
            className='relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity'
            onClick={() => openModal(index)}
          >
            <Image src={image.image_url} alt={`Job photo ${index + 1}`} fill className='object-cover' sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw' />
          </div>
        ))}
      </div>

      {/* Modal for Full Size View */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeModal}>
        <DialogContent className='max-w-4xl w-full h-full max-h-[90vh] p-0'>
          {selectedImageIndex !== null && (
            <div className='relative w-full h-full flex items-center justify-center bg-black'>
              {/* Close Button */}
              <Button onClick={closeModal} variant='ghost' size='sm' className='absolute top-4 right-4 z-10 text-white hover:bg-white/20'>
                <X className='h-5 w-5' />
              </Button>

              {/* Navigation Buttons */}
              {sortedImages.length > 1 && (
                <>
                  <Button onClick={goToPrevious} variant='ghost' size='sm' className='absolute left-4 z-10 text-white hover:bg-white/20'>
                    <ChevronLeft className='h-6 w-6' />
                  </Button>
                  <Button onClick={goToNext} variant='ghost' size='sm' className='absolute right-4 z-10 text-white hover:bg-white/20'>
                    <ChevronRight className='h-6 w-6' />
                  </Button>
                </>
              )}

              {/* Image */}
              <div className='relative w-full h-full'>
                <Image src={sortedImages[selectedImageIndex].image_url} alt={`Job photo ${selectedImageIndex + 1}`} fill className='object-contain' sizes='90vw' />
              </div>

              {/* Image Counter */}
              {sortedImages.length > 1 && (
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-inter'>
                  {selectedImageIndex + 1} of {sortedImages.length}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
