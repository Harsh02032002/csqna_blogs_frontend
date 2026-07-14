export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const timeAgo = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 7) return formatDateShort(dateStr);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

export const truncate = (str, n = 150) => {
  if (!str) return '';
  const plain = stripHtml(str);
  return plain.length > n ? plain.slice(0, n) + '…' : plain;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800';
    case 'draft': return 'bg-yellow-100 text-yellow-800';
    case 'archived': return 'bg-gray-100 text-gray-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};
