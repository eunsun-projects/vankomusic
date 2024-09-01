import styles from '@/app/loaders/page.module.css'

export default function CircleLoader() {

    return (
        <div style={{ 
            width : '100%', 
            height : '100%',
            top: '50%',
            left: '50%',
            position: 'relative',
            transform: 'translate(-50%, -50%)',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: '1000', 
            // boxShadow: '0 0 1rem 1rem black',
            // backgroundColor: 'grey'
        }}>
            <span className={styles.circleloader}></span>
        </div>
    ) 
}
