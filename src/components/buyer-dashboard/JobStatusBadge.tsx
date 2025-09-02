import React from 'react';

export default function JobStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-bold ${
        status === 'open'
          ? 'bg-green-100 text-green-800'
          : status === 'draft'
          ? 'bg-gray-100 text-gray-800'
          : status === 'full_bid'
          ? 'bg-blue-100 text-blue-800'
          : status === 'confirmed'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {status === 'full_bid' ? 'Full Bids' : status === 'waiting_confirmation' ? 'Waiting Confirmation' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
