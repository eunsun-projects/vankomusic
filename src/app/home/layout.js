import '../globals.css'
import {orbitron} from '../layout'

export default function NoHomeLayout({ children }) {
    return (
        <div className={orbitron.className} style={{minHeight : '100vh', overflowY: "auto"}}>
            {children}
        </div>
    )
}