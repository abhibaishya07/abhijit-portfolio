export default function Spinner({ size = 'md', light = false }) {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };
  const color = light ? 'border-white/30 border-t-white' : 'border-lb-border border-t-lb-black';
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} ${color} rounded-full animate-spin`} />
    </div>
  );
}
