import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Lips',       image: 'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/a09daa8fdc50edf1c472985ccf59048865112995.png?v=1774352759', color: 'from-lb-blush' },
  { name: 'Eyes',       image: 'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/ef2f7301a2071a479a4af82943624fdf1bd295e2.png?v=1774352553', color: 'from-gray-900' },
  { name: 'Face',       image: 'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/cf428c5b1a9aabe81076f8dcddf29f624403b34b.png?v=1774422775', color: 'from-lb-rose' },
  { name: 'Skincare',   image: 'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/31var9m3p7L.jpg?v=1773322001', color: 'from-emerald-900' },
  { name: 'Hair Care',  image: 'https://cdn.shopify.com/s/files/1/0972/2816/1387/files/eebd36f1905698975954d59dae8787eea767cfb9_1.png?v=1774408194', color: 'from-amber-900' },
  { name: 'Fragrance',  image: 'https://images.pexels.com/photos/1961791/pexels-photo-1961791.jpeg?auto=compress&cs=tinysrgb&w=600', color: 'from-lb-mauve' },
  { name: 'Nails',      image: 'https://images.pexels.com/photos/3997390/pexels-photo-3997390.jpeg?auto=compress&cs=tinysrgb&w=600', color: 'from-lb-black' },
];

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-3">Browse By</p>
        <h2 className="section-title">Shop By Category</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {CATEGORIES.map(({ name, image }) => (
          <Link key={name} to={`/shop?category=${name}`}
            className="group relative overflow-hidden aspect-[3/4] bg-lb-blush cursor-pointer">
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-lb-mauve/80 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <p className="text-xs tracking-widest uppercase font-semibold">{name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
