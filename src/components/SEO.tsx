import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  url?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  schema?: object;
}

export default function SEO({ 
  title, 
  description, 
  url,
  canonical, 
  ogImage, 
  ogType = 'website',
  structuredData,
  schema 
}: SEOProps) {
  const siteName = 'HVACR NET';
  const defaultOgImage = '/og-default.png';
  const baseUrl = 'https://www.hvacrnet.com';
  const pageUrl = url || canonical || baseUrl;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || `${baseUrl}${defaultOgImage}`} />
      <meta property="og:url" content={pageUrl} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || `${baseUrl}${defaultOgImage}`} />

      {/* Schema.org JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
