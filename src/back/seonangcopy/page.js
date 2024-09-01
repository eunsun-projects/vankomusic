import SeonangIntro from '@/components/seonangcopy/seonangintro';
import { basicMeta, basicViewport } from '../basicmeta';

export const metadata = basicMeta;
export const viewport = basicViewport;

export default function SeonangPage() {
    return (
        <SeonangIntro/>
    )
}