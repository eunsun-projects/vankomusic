import styles from '@/app/page.module.css'
import Link from 'next/link'

export const metadata = {
    title: 'page not found!',
    description: 'page not found!',
    generator: 'Next.js',
    applicationName: 'Vanko.Live',
    referrer: 'origin-when-cross-origin',
    keywords: ['Vanko.Live', 'music', 'vanko'],
    authors: [{ name: 'Vanko' }, { name: 'Vanko', url: 'https://vanko.live' }],
    creator: 'Vanko.Live',
    publisher: 'Vanko.Live',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://vanko.live'),
    alternates: {
        canonical: '/',
        languages: {
            'ko-KR': '/',
        },
    },
    openGraph: {
        title: 'page not found!',
        description: 'page not found!',
        url: 'https://vanko.live',
        siteName: 'Vanko.Live',
        images: [
            {
                url: '/192vanko.png',
                width: 800,
                height: 600,
            },
        ],
        locale: 'ko_KR',
        type: 'website',
    },
    robots: {
        index: false,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: false,
            noimageindex: true,
        },
    },
    icons: {
        icon: '/192vanko.png',
        shortcut: '/192vanko.png',
        apple: '/192vanko.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/192vanko.png',
        },
    },
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: "no",
    viewportFit : "cover"
}

export default function NotFound(){
    return(
        <div className={styles.notfoundbox}>
            <p className={styles.notp}>Not Found</p>
            <p className={styles.notcon}>주소를 찾을 수 없습니다.</p>
            <Link href={'/'}><p className={styles.notcon}>← return Home</p></Link>
        </div>
    )
}