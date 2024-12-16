import { Box, Typography, Button, Avatar } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import { feedDelete } from '../../../api/requests/feedApi';
import { fetchFollow, fetchUserFollowings } from '../../../util/myPageApi';
import { useCallback, useEffect, useState } from 'react';
import FollowButton from '../../Home/FollowButton';
import { useInitializeUser } from '../../../hooks/homeFeed/useInitializeUser';

type ChatHeaderProps = {
  name: string;
  inInfluencerId: string;
  id: string;
  userId: number | string;
  influencerId: number | string;
  onClose: () => void;
  profileImg: string;
};

const FeedModalChatHeader = ({
  name,
  id,
  userId,
  influencerId,
  inInfluencerId,
  profileImg,
  onClose,
}: ChatHeaderProps) => {
  // follow 초기값과 타입을 명확히 설정
  const [follow, setFollow] = useState<string[]>([]);
  const navigate = useNavigate();
  const { loggedInUser } = useInitializeUser(); // 사용자 정보

  // 피드 수정 이동
  const onNavIgate = () => {
    navigate(`update/${id}`);
  };

  // 피드 삭제
  const onFeedDelete = async () => {
    await feedDelete(id);
    onClose();
  };

  // 팔로우/언팔로우 처리
  const onFollow = useCallback(async () => {
    // if (userId === '0') return alert('로그인이 필요합니다');
    if (!userId) return alert('로그인이 필요합니다');
    if (userId && influencerId) {
      await fetchFollow(userId?.toString(), influencerId?.toString() as string);

      // 팔로우 업데이트 후 데이터 새로 가져오기
      const followData = await fetchUserFollowings(userId?.toString());
      const JsonFollow =
        followData.length > 0 ? JSON.parse(followData[0]?.follower) : [];
      setFollow(JsonFollow);
    }
  }, [userId, influencerId]);

  // 팔로우 데이터 초기 로드
  useEffect(() => {
    // if (userId === '0') return;
    if (!userId) return;

    const fetchFollowData = async () => {
      const followData = await fetchUserFollowings(userId?.toString());
      const JsonFollow =
        followData.length > 0 ? JSON.parse(followData[0]?.follower) : [];
      setFollow(JsonFollow);
    };

    fetchFollowData();
  }, [userId]);

  // userId를 string으로 변환 후 변수에 저장
  const userIdString = userId?.toString();
  console.log(profileImg, 'influencerImg');

  return (
    // 전체 박스
    <Box
      sx={{
        borderBottom: '1px solid #ddd',
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: '#fff',
        whiteSpace: 'nowrap',
        // backgroundColor: "red"
      }}
    >
      {/* 인플루언서 정보창+ 팔로우 버튼 */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
        }}
      >
        <Avatar alt='inflProfile' src={profileImg || ''} />

        {/* 인플루언서 이름 */}
        <Typography
          // variant='h6'
          sx={{
            fontSize: '18px',
            fontWeight: 'bold',
            paddingRight: '3%',
            paddingLeft: '3%',
          }}
        >
          {name}
        </Typography>

        {/* 팔로우 버튼 */}
        <Button
          sx={{
            // backgroundColor: "red",
            // boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
            fontWeight: 'bold',
          }}
          disabled={!loggedInUser}
          onClick={onFollow}
        >
          <AutoAwesomeIcon
            color='primary'
            sx={{
              marginRight: '5px',
              // color: '#9252E7',
            }}
          />
          <span style={{ color: '#9252E7' }}>
            {follow?.length > 0 && follow.includes(userIdString)
              ? '언팔로우'
              : '팔로우'}
          </span>
        </Button>
      </Box>

      {/* 디자인위해 잠시 주석 */}
      {influencerId === inInfluencerId && (
        <Box
          sx={{
            width: "100%",
            textAlign: "end",
          }}
        >
          <Button
            variant='outlined'
            size='small'
            color='primary'
            sx={{ mr: 1, }}
            onClick={onFeedDelete}
          >
            피드 삭제
          </Button>
          <Button
            variant='contained'
            size='small'
            color='primary'
            sx={{}}
            onClick={onNavIgate}
          >
            피드 수정
          </Button>
        </Box>
      )}




    </Box >
  );
};

export default FeedModalChatHeader;
