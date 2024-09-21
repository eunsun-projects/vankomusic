import '../globals.css'

export default function VanampLayout({ children }) {
    return (
        <div style={{width:'100%', height : '100%', overflow:'hidden'}}>
            {children}
        </div>
    )
}