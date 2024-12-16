import React, { Suspense, useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ModalProps } from '../../../hooks/useModal';
import FeedModalImages from './FeedModalImages';
import FeedModalChatHeader from './FeedModalChatHeader';
import Chat from './FeedModalChatBody';
import { feedGet } from '../../../api/requests/feedApi';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../../../types/jwtType';
import { Feed } from '../../../types/FeedType';
import { useFeedStore } from '../../../store/feedStore';

const ChatPage = ({ onClose }: ModalProps) => {
  const pageNum = sessionStorage.getItem('page') ?? '';
  const [feed, setFeed] = useState<Feed | null>(null);
  const [user, setUser] = useState<{
    userId: string;
    influencerId?: string;
  } | null>(null);
  const { feed: apiCall } = useFeedStore();
  useEffect(() => {
    const fetchFeed = async () => {
      if (!pageNum) return;
      try {
        const data = await feedGet(pageNum);
        setFeed(data);
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    };
    fetchFeed();
  }, [pageNum, apiCall]);

  useEffect(() => {
    const token = localStorage.getItem('user');

    if (!token) return;
    try {
      const parsedToken = JSON.parse(token);

      const decoded = jwtDecode<CustomJwtPayload>(parsedToken.accessToken);

      setUser({ userId: decoded.userId, influencerId: decoded.influencerId });
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
  }, []);

  if (!feed) return <>로딩 중...</>;

  return (
    <Suspense fallback={<>로딩중...</>}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          // width: "100%",
          bgcolor: 'black',
          overflow: 'hidden', // 기본적으로 overflow hidden
          borderRadius: 2,
          flexDirection: { xs: 'column', md: 'row' }, // 화면 크기에 따라 방향 변경
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '50%' }, // 작은 화면에서는 100%, md 이상에서는 50%
            height: { xs: '100%', md: '700px' },
            position: 'relative',
            // mb: { xs: 0, md: 0 }, // 작은 화면에서는 margin bottom 추가
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 10,
              color: '#ffffff',
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <FeedModalImages images={feed.images} products={feed.products} />
        </Box>
        <Box
          sx={{
            width: { xs: '100%', md: '50%' }, // 작은 화면에서는 100%, md 이상에서는 40%
            height: { xs: '100%', md: '700px' },
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#fff',
          }}
        >
          <FeedModalChatHeader
            profileImg={feed?.influencerImg ?? ''}
            influencerId={feed.influencer_id}
            userId={user?.userId ?? ''}
            inInfluencerId={user?.influencerId ?? ''}
            name={feed.influencer}
            id={pageNum}
            onClose={onClose}
          />
          <Chat
            userId={user?.userId ?? ''}
            content={feed.content}
            id={pageNum}
            likes={feed.likes}
          />
        </Box>
      </Box>
    </Suspense>
  );
};

export default ChatPage;
