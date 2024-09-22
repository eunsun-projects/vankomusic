function Joystick({ camera, isColliding }) {
    const [previousPosition, setPreviousPosition] = useState(new THREE.Vector3([0, 3, 80]));
    const joysticRef = useRef();

    useEffect(() => {
        if (!camera) return;

        const nipplejs = require('nipplejs');
        const options = { 
            zone : joysticRef.current, 
            mode : 'static',
            position : { right: '50%', bottom: '50%' },
            threshold : 0.1,
            size : 100
        };
        
        const manager = nipplejs.create(options);
        // setManager(manager);

        let isJoystickActive = false;  // 사용자가 조이스틱을 누르고 있는지 여부
        let lastData = null;  // 마지막으로 받은 조이스틱 데이터

        manager.on('move', (event, data) => {
            isJoystickActive = true;  // 조이스틱 활성화 상태로 설정
            lastData = data;  // 마지막 데이터 저장
        
            // 조이스틱의 움직임에 따른 방향 벡터를 계산합니다.
            const moveDirection = new THREE.Vector3();
            if(data.direction && data.direction.angle) {
                const angle = data.direction.angle; // angle 방향 판단
                if (!isColliding) { // 충돌 상태가 아닐 때만 움직임을 처리
                    if(angle === 'up') {
                        moveDirection.z = -1;
                    } else if(angle === 'down') {
                        moveDirection.z = 1;
                    }
                    if(angle === 'left') {
                        moveDirection.x = -1;
                    } else if(angle === 'right') {
                        moveDirection.x = 1;
                    }

                    // 방향 벡터를 정규화하고 움직일 거리를 곱합니다.
                    const speed = 0.005; // 원하는 속도 값으로 조절
                    moveDirection.normalize().multiplyScalar(speed);

                    // 카메라의 위치를 업데이트합니다.
                    camera.position.add(moveDirection);
                } else {
                    camera.position.copy(previousPosition);
                }
            }
        });

        manager.on('end', () => {
            // 조이스틱이 끝날 때의 로직을 여기에 작성합니다.
            isJoystickActive = false;  // 조이스틱 비활성화 상태로 설정
        });
        
        //지속적인 움직임 처리
        function handleContinuousMovement() {
            if (isJoystickActive && lastData) {
                // lastData를 기반으로 움직임 처리...
                const moveDirection = new THREE.Vector3();
                if(lastData.direction && lastData.direction.angle) {
                    const angle = lastData.direction.angle;
                    if (!isColliding && lastData) { // 충돌 상태가 아닐 때만 움직임을 처리
                        if(angle === 'up') {
                            moveDirection.z = -1;
                        } else if(angle === 'down') {
                            moveDirection.z = 1;
                        }
                        if(angle === 'left') {
                            moveDirection.x = -1;
                        } else if(angle === 'right') {
                            moveDirection.x = 1;
                        }
                    }
                }

                const speed = 0.005; // 원하는 속도 값으로 조절
                moveDirection.normalize().multiplyScalar(speed);

                camera.position.add(moveDirection);
            }
            requestAnimationFrame(handleContinuousMovement);
        }
        // requestAnimationFrame(handleContinuousMovement);

        // 컴포넌트가 unmount될 때 이벤트 리스너와 객체를 정리합니다.
        return () => {
            manager.destroy();
        };
    }, [camera, isColliding]);

    return (
        // 조이스틱 UI...
        <div style={{
            width : "100%", 
            height: "100%", 
            position: "absolute", 
        }}>
            <div ref={joysticRef} 
                style={{
                    width : "100px",
                    height: "100px",
                    position: "absolute", 
                    right: "3%",
                    bottom : "3%", 
                }}
            ></div>
        </div>
    );
};