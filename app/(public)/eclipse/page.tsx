import { EclipseTemplate } from '@/components/project/eclipse';
import { basicMeta, basicViewport } from '@/meta/basicmeta';

export const metadata = basicMeta;
export const viewport = basicViewport;

export default function EclipsePage() {
  return <EclipseTemplate />;
}
