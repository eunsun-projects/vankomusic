import styles from '@/app/modernmove/page.module.css'

export default function MoonLoaderBasic() {

    return (
        <div style={{ width : '100%', height : '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <span className={styles.moonloader}></span>
        </div>
    ) 
}
