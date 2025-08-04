// Utility to convert image URLs to File objects for form state
export async function convertUrlToFile(url: string, filename: string): Promise<File | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image: ${url}`);
      return null;
    }

    const blob = await response.blob();

    // Create File object from blob
    const file = new File([blob], filename, {
      type: blob.type || 'image/jpeg',
    });

    return file;
  } catch (error) {
    console.error(`Error converting URL to File: ${url}`, error);
    return null;
  }
}

export async function convertImageUrlsToFiles(images: Array<{ image_url: string; image_order: number }>): Promise<File[]> {
  const filePromises = images
    .sort((a, b) => a.image_order - b.image_order) // Maintain order
    .map(async (img, index) => {
      const filename = `existing-image-${img.image_order || index + 1}.jpg`;
      return await convertUrlToFile(img.image_url, filename);
    });

  const files = await Promise.all(filePromises);

  // Filter out any failed conversions (null values)
  return files.filter((file): file is File => file !== null);
}
