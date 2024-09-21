import '../globals.css'
import styles from '@/app/eclipse/page.module.css'
import SetScreenSize from '@/components/elements/setScreensize'

export default function SeonangLayout({ children }) {
    return (
        <>
        <SetScreenSize/>
        <div style={{height : '100%', color: 'white', minHeight:'calc(var(--vh, 1vh) * 100)', overflowY:"auto", touchAction: "none", cursor:'auto'}}>
            {children}
        </div>
        </>
    )
}