import styles from '@/app/modernmove/page.module.css'

export default function MoonLoader() {

    return (
        <div style={{ width : '100%', height : '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor :'#0b061f'}}>
            <span className={styles.moonloader}></span>
        </div>
    ) 
}
