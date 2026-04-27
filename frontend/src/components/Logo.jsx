import { Link } from 'react-router-dom';
import { product } from '../data/siteData';

const Mark = ({ className = '' }) => (
  <span className={`grid h-9 w-9 grid-cols-2 grid-rows-2 gap-1 rounded-lg bg-ink p-1.5 ${className}`}>
    <span className="col-span-2 rounded-sm bg-citron" />
    <span className="rounded-sm bg-teal" />
    <span className="rounded-sm bg-paper" />
    <span className="col-span-2 rounded-sm bg-coral" />
  </span>
);

const Logo = ({ to = '/', compact = false }) => (
  <Link to={to} className="flex items-center gap-3" aria-label={`${product.name} home`}>
    <Mark />
    {!compact && (
      <span className="leading-none">
        <span className="block text-sm font-black tracking-tight text-ink">{product.name}</span>
        <span className="block pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-ink/50">
          {product.college}
        </span>
      </span>
    )}
  </Link>
);

export { Mark };
export default Logo;
