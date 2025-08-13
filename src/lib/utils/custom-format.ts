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

// Format job budget input
export const formatCurrency = (value: string) => {
  const numericValue = value.replace(/[^\d]/g, '');
  if (!numericValue) return '';

  const number = parseInt(numericValue, 10);
  return `$${number.toLocaleString()}`;
};

// Helper function to format date
export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to get status badge styling
export const getStatusBadgeStyle = (status: string, isSelected: boolean) => {
  if (isSelected) {
    return 'bg-blue-100 text-blue-800 border border-blue-200';
  }

  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'declined':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
