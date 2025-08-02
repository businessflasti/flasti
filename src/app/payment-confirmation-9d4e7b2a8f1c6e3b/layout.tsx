import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pago Completado - Flasti',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
  // Evitar que aparezca en resultados de búsqueda
  other: {
    'robots': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
    'googlebot': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
    'bingbot': 'noindex, nofollow, noarchive, nosnippet, noimageindex',
  }
};

export default function PaymentSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}