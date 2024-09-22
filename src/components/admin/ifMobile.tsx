'use client';

import { useEffect, useState } from 'react';

export default function IfMobile() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const isMobile = () => {
      return /Android|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }; // =========> mobile device check function
    !isMobile() ? setMobile(false) : setMobile(true);
  }, []);

  return (
    <>
      {mobile && (
        <div
          style={{
            position: 'fixed',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            flexDirection: 'column',
            color: 'white',
            fontFamily: 'DungGeunMo',
            width: '100%',
            height: '100%',
            backgroundColor: 'blue',
            zIndex: '999',
          }}
        >
          <p style={{ fontSize: '3rem' }}>{'!!warning!!'}</p>
          <p>PC에서만 가능합니다</p>
        </div>
      )}
    </>
  );
}
