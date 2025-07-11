import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

// Utilidad para formatear los segmentos de la ruta
function formatSegment(seg: string) {
  return seg
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname() || '';
  const segments = pathname.split('/').filter(Boolean);
  let path = '';

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-[#b0b0b0]" role="list">
        <li>
          <Link
            href="/dashboard"
            className="hover:underline text-white font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0] rounded transition-colors duration-150 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010] flex items-center gap-1"
            aria-current={segments.length === 1 ? 'page' : undefined}
            tabIndex={0}
            data-tooltip-id="breadcrumb-dashboard"
            data-tooltip-content="Ir al inicio del panel"
          >
            <FiHome className="inline-block text-lg mb-[2px]" aria-hidden="true" />
            <span className="sr-only">Dashboard</span>
          </Link>
          <Tooltip id="breadcrumb-dashboard" place="bottom" />
        </li>
        {segments.slice(1).map((seg, i) => {
          path += '/' + seg;
          const isLast = i === segments.length - 2;
          return (
            <motion.li
              key={seg}
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: i * 0.06 }}
              role="listitem"
            >
              <FiChevronRight className="mx-1 text-[#b0b0b0]" aria-hidden="true" />
              {isLast ? (
                <span
                  className="text-white font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0] rounded transition-colors duration-150"
                  aria-current="page"
                  tabIndex={0}
                  data-tooltip-id={`breadcrumb-${seg}`}
                  data-tooltip-content={formatSegment(seg)}
                >
                  {formatSegment(seg)}
                </span>
              ) : (
                <Link
                  href={path}
                  className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b0b0b0] rounded transition-colors duration-150 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101010] hover:text-white hover:scale-[1.06]"
                  tabIndex={0}
                  data-tooltip-id={`breadcrumb-${seg}`}
                  data-tooltip-content={`Ir a ${formatSegment(seg)}`}
                >
                  {formatSegment(seg)}
                </Link>
              )}
              <Tooltip id={`breadcrumb-${seg}`} place="bottom" />
            </motion.li>
          );
        })}
      </ol>
    </nav>
  );
}
