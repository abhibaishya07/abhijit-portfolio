const STATUS_MAP = {
  'in-stock':    { label: 'In Stock',    cls: 'bg-green-100 text-green-800' },
  'low':         { label: 'Low Stock',   cls: 'bg-amber-100 text-amber-800 animate-pulse' },
  'out-of-stock':{ label: 'Out of Stock',cls: 'bg-red-100 text-red-800' },
};

export default function StockBadge({ status }) {
  const { label, cls } = STATUS_MAP[status] || STATUS_MAP['in-stock'];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-sm ${cls}`}>
      {label}
    </span>
  );
}
