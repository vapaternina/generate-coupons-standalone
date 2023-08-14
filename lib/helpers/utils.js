const formatMoney = x => {
  if (!x) {
    return '$0';
  }
  const withDots = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${withDots}`;
};

export { formatMoney }