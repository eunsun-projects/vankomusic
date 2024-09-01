'use client'
import { useRef } from 'react'
import emailjs from '@emailjs/browser'
import styles from '@/app/contact/page.module.css'
import { lobster } from '@/app/layout'
import Link from 'next/link'

const EmailForm = () => {
    const form = useRef()
    const sanitizeInput = (input) => {
        return input.replace(/[{}()<>`~!@#$%^&*|\[\]\\\'\";:\/?|]/gim, '');
    };
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    };

    // send mail
    const onSubmitForm = (event) => {
        event.preventDefault()

        try {
            const name = sanitizeInput(form.current.name.value);
            const email = form.current.email.value;
            if (!validateEmail(email)) {
                alert('이메일 주소를 확인해 주세요. @, . 이 빠졌나..');
                return;
            }
            const message = sanitizeInput(form.current.message.value);

            const formpack = {
                name: name,
                email: email,
                message: message
            }
            
            emailjs.send(
                process.env.NEXT_PUBLIC_NEXT_PUBLIC_MAIL_SERVER_KEY,
                process.env.NEXT_PUBLIC_MAIL_TEMPLATE_KEY,
                formpack,
                process.env.NEXT_PUBLIC_MAIL_PRIVATE_KEY
            )
            .then((response)=>{
                 // ... (이메일 전송 코드)
                alert('주인장에게 메일이 전송되었습니다.💌');
                console.log('SUCCESS!', response.status, response.text);
            })
        } catch (error) {
            alert('메일 전송에 실패하였습니다.');
        }
    }

    return (
        <div className={styles.contactbox}>
            <p>e-mail | vankohelp@gmail.com</p>
            <Link href={'https://www.instagram.com/vanko.live'} target='_blank' className={`${styles.link} ${lobster.className}`}><p>instagram</p></Link>
            <Link href={'https://www.youtube.com/@vankolive'} target='_blank' className={`${styles.link} ${lobster.className}`}><p>youtube</p></Link>
            {/* <p>{`작업의뢰는 아래 양식에 맞추어 작성해주세요 ↓`}</p> */}

            <form ref={form} className={styles.contactform} onSubmit={onSubmitForm}>
                <label>Name <span className={styles.labelstar}>*</span></label>
                <input type="text" name="name" required />

                <label>Email <span className={styles.labelstar}>*</span></label>
                <input type="email" name="email" required />

                <label>Message <span className={styles.labelstar}>*</span></label>
                <textarea 
                    className={styles.textarea} 
                    type="text" 
                    name="message" 
                    placeholder={
                        `작업의뢰/협업문의/프로젝트 제안 환영합니다.
                        궁금하신 사항이나 하시고 싶은 말씀 모두
                        편하게 여기 적어주시면 메일로 답장 드립니다.`
                    } 
                    required
                />
                
                <input className={styles.consendbtn} style={{width:'5rem', margin:'1rem auto 0', borderRadius:'0'}}
                    type="submit"
                    value="send"
                />
            </form>
        </div>
    )
}

export default EmailForm