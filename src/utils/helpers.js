// utils/helpers.js
export const generateMemberId = () => {
  return 'CUST-' + Math.floor(100000 + Math.random() * 900000);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};