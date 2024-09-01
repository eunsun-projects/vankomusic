import '../globals.css'

export default function SeonangLayout({ children }) {
    return (
        <div style={{height : '100%', minHeight: "100vh", overflowY:"auto", backgroundImage: 'url(/assets/img/cave2.jpg)', backgroundSize: 'cover', touchAction: "none"}}>
            {children}
        </div>
    )
}