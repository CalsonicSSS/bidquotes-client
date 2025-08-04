// Format phone number as user types: (123) 456-7890
export function formatPhoneInput(value: string): string {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, '');

  // Apply formatting as user types
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
}

// Get clean phone number (digits only) for storage
export function getCleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

// truncate text
export function truncate(str: string, max = 35) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '...' : str;
}
