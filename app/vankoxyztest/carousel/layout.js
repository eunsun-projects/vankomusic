import '@/app/globals.css'
import '@/app/vankoxyztest/carousel/react-carousel.es.css'

export default function CarouselLayout({ children }){
    return(
        <div style={{height:'100%', minHeight:'100vh', backgroundImage: 'url(/assets/img/cave.webp)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
            {children}
        </div>
    )
}

