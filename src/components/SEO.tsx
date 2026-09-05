import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object | object[];
}

const BASE_URL = 'https://www.hvacrnet.com';

export default function SEO({ 
  title, 
  description, 
  url,
  ogImage, 
  ogType = 'website',
  structuredData,
}: SEOProps) {
  const location = useLocation();
  const siteName = 'HVACR NET';
  const pagePath = url || location.pathname;
  const fullUrl = pagePath.startsWith('http') ? pagePath : `${BASE_URL}${pagePath}`;

  const schemas = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || `${BASE_URL}/og-default.png`} />
      <meta property="og:url" content={fullUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || `${BASE_URL}/og-default.png`} />

      {/* Schema.org JSON-LD */}
      {schemas.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
