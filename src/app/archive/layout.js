import '../globals.css'
import { knewave } from '../layout'
import SetScreenSize from '@/components/elements/setScreensize'

export default function ArchiveLayout({ children }) {
    return (
        <>
        <SetScreenSize/>
        <div className={knewave.className} style={{minHeight:'calc(var(--vh, 1vh) * 100)', overflowY:'auto', backgroundImage: 'url(/assets/img/starpixel.webp)', backgroundSize:'25rem', backgroundRepeat:'repeat'}}>
            {children}
        </div>
        </>
    )
}