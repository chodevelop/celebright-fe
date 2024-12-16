import React, { useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tabs, Tab, Box, Divider } from "@mui/material";

interface MyMenuProps {
  user: any;
  userId: string | null; // userId는 문자열 또는 null
}

const MyMenu: React.FC<MyMenuProps> = ({ user, userId }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // 활성화된 탭 경로 리스트를 useMemo로 캐싱
  const tabPaths = useMemo(
    () => [
      { label: "좋아요", path: `/mypage/${userId}/likes` },
      { label: "팔로우", path: `/mypage/${userId}/follows` },
      ...(user?.influencer?.banner_picture
        ? [
          { label: "멤버십 관리", path: `/mypage/${userId}/membership/manage` },
          { label: "내 피드", path: `/mypage/${userId}/feeds` },
        ]
        : []),
    ],
    [userId, user?.influencer?.id]
  );

  // 현재 경로가 탭 리스트에 포함되지 않으면 기본값으로 설정
  const currentPath = useMemo(() => {
    const defaultPath = userId ? `/mypage/${userId}/likes` : "";
    return tabPaths.some((tab) => tab.path === location.pathname)
      ? location.pathname
      : defaultPath;
  }, [location.pathname, tabPaths, userId]);

  // userId가 변경될 때 기본 경로로 이동 (경로가 유효하지 않을 때만)
  useEffect(() => {
    const defaultPath = userId ? `/mypage/${userId}/likes` : "";
    if (userId && !tabPaths.some((tab) => tab.path === location.pathname)) {
      navigate(defaultPath);
    }
  }, [userId, navigate, location.pathname, tabPaths]);

  // 탭 변경 시 경로 이동
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  if (!userId) {
    return null; // userId가 없는 경우 아무것도 렌더링하지 않음
  }

  return (
    <>
      {/* <Divider
        variant="middle"
      ></Divider> */}
      <Box
        sx={{
          width: "100%",
          marginTop: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs

          value={currentPath} // 현재 경로를 기반으로 활성화된 탭 결정
          onChange={handleTabChange} // 탭 클릭 시 경로 변경
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            // backgroundColor: "red",
            "& .MuiTab-root": { fontSize: "1.0rem" },
          }} // 글씨 크기 키우기
        >
          {tabPaths.map((tab) => (
            <Tab key={tab.path} label={tab.label} value={tab.path} component={Link} to={tab.path} />
          ))}
        </Tabs>
      </Box>
    </>
  );
};

export default MyMenu;
