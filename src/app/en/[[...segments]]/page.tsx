import { PublicPage, buildParams, pageMetadata, type RouteParams } from '@/components/public-page';
const locale='en';
export const generateStaticParams = buildParams;
export async function generateMetadata({params}: {params:RouteParams}) {
  return pageMetadata(locale,await params);
}
export default async function Page({params}: {params:RouteParams}) {
  return <PublicPage locale={locale} {...await params}/>;
}
