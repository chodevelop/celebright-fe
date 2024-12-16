/**
 * KakaoCallback.tsx
 * 작성자: 조영우(chodevelop)
 * 작성일: 2024/11/21
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SocialLoginCallback: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const userInfo = {
            accessToken: query.get("accessToken"),
        };

        // 사용자 정보가 있으면 상태에 저장
        if (userInfo) {
            setUser(userInfo);
            localStorage.setItem("user", JSON.stringify(userInfo)); // 로컬 스토리지에 저장
        } else {
            alert('카카오 로그인에 실패했습니다!')
        }
        navigate('/');
        window.location.reload(); // 페이지 새로고침
    }, [location, navigate]);


    return <div>로그인 처리 중...</div>;
};

export default SocialLoginCallback;