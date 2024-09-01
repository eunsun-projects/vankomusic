'use client'
import styles from "@/app/ffd/page.module.css"
import { useState, useRef, useEffect } from 'react';

const FfdDrag = ({imgarr}) => {

    const [isDragging, setIsDragging] = useState(false);
    const dragItem = useRef();
    const dragStartPos = useRef({ x: 0, y: 0 });
    const scrollStart = useRef({ left: 0, top: 0 });

    const onMouseDown = (e) => {
        setIsDragging(true);
        dragStartPos.current = {
            x: e.pageX - dragItem.current.offsetLeft,
            y: e.pageY - dragItem.current.offsetTop,
        };
        scrollStart.current = {
            left: dragItem.current.scrollLeft,
            top: dragItem.current.scrollTop,
        };
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        // document.body.style.cursor = "grab";
        const x = e.pageX - dragItem.current.offsetLeft;
        const y = e.pageY - dragItem.current.offsetTop;
        const walkX = (x - dragStartPos.current.x) * 2; // 3은 움직임을 더 크게 보이게 하는 인자입니다.
        const walkY = (y - dragStartPos.current.y) * 2;

        dragItem.current.scrollLeft = scrollStart.current.left - walkX;
        dragItem.current.scrollTop = scrollStart.current.top - walkY;
    };

    useEffect(() => {
        if (dragItem.current) {
            const container = dragItem.current;
            const x = container.scrollWidth / 3.6;
            const y = container.scrollHeight / 3.6;

            container.scroll(x, y);
        }
    }, []);

    return (
        <div 
            ref={dragItem}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            className={styles.ffdbox}
            // style={{cursor: isDragging ? '-webkit-grabbing' : '-webkit-grab'}}
            >
            <div 
                className={styles.ffdimg}
                style={{
                    userSelect: 'none',
                    backgroundImage: `url(${imgarr})`
                }}>
            </div>
        </div>
    );
};

export default FfdDrag;
