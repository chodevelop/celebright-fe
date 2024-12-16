import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  connectSocket,
  disconnectSocket,
  sendMessage,
  onMessage,
} from '../../util/socket_fe';
import {
  Box,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Modal,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SendRounded } from '@mui/icons-material';
import FollowModal from '../MyPage/FollowModal';
import MessageBubble from './MessageBubble';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface ChatProps {
  roomId: string;
}

interface Message {
  id: string;
  user_id: string;
  username: string;
  profile: string;
  content: string;
  isMine: boolean;
  influencer_id?: string;
  follower?: string;
  banner_picture?: string;
  category?: string;
}

const Chat: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();
  const { user_id, user_name, user_profile } = location.state || {};
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isSentByUser, setIsSentByUser] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const limit: number = 20;
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<
    string | null
  >(null);
  const [modalType, setModalType] = useState<'membership' | 'profile' | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = (id: string, type: 'membership' | 'profile') => {
    setSelectedInfluencerId(id);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInfluencerId(null);
    setModalType(null);
  };

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleNewMessage = async (msg: any) => {
    const newMessage = {
      id: msg.id,
      user_id: msg.user_id,
      username: msg.username,
      profile: msg.profile,
      content: msg.text,
      isMine: msg.username === user_name,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  useEffect(() => {
    connectSocket(roomId);
    fetchMessages();

  }, []);

  // useEffect(() => {
  //     onMessage(handleNewMessage);
  // }, [messages]);

  useEffect(() => {
    onMessage((msg: any) => {
      const newMessage = {
        id: msg.id,
        user_id: msg.user_id,
        username: msg.username,
        profile: msg.profile,
        content: msg.text,
        isMine: msg.username === user_name,
      };

      setMessages((prev) => [...prev, newMessage]);
    });
    setIsLoading(false);
    return () => {
      disconnectSocket(roomId);
    };
  }, [roomId, user_name]);

  useEffect(() => {
    if (isSentByUser) {
      setIsSentByUser(false);
      scrollToBottom(100);
    }
  }, [messages, isSentByUser]);

  const scrollToBottom = (delay: number) => {
    if (chatEndRef.current) {
      setTimeout(() => {
        if (chatEndRef.current)
          chatEndRef.current.scrollIntoView({ behavior: 'auto' });
      }, delay);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(roomId, message, {
        username: user_name,
        profile: user_profile,
      });
      saveMessage(message);
      setMessage('');
      setIsSentByUser(true);
    }
  };

  const saveMessage = async (content: string) => {
    try {
      await axios.post('http://localhost:4000/message', {
        room_id: roomId,
        user_id,
        message_content: content,
      });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(
          'http://localhost:4000/message/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        const imageUrl = response.data.url;
        sendMessage(roomId, imageUrl, {
          username: user_name,
          profile: user_profile,
        });
        saveMessage(imageUrl);
        setIsSentByUser(true);
      } catch (err) {
        console.error('Error uploading image:', err);
      }
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!hasMore) return;

    const container = chatContainerRef.current;
    const previousScrollHeight = container?.scrollHeight || 0;

    try {
      const response = await axios.get(
        `http://localhost:4000/message/room?roomId=${roomId}&page=${currentPage}&limit=${limit}`
      );
      const fetchedMessages = response.data.map((msg: any) => ({
        id: msg.message_id,
        user_id: msg.user_id,
        username: msg.username,
        profile: msg.profile_picture,
        content: msg.message_content,
        influencer_id: msg.influencer_id,
        follower: msg.follower,
        banner_picture: msg.banner_picture,
        category: msg.category,
        isMine: Number(msg.user_id) === Number(user_id),
      }));

      setMessages((prev) => [...fetchedMessages, ...prev]);
      if (currentPage === 1) {
        scrollToBottom(50);
      }
      setHasMore(response.data.length > 0);
      setCurrentPage((prev) => prev + 1);

      setTimeout(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - previousScrollHeight;
        }
      }, 0);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }, [hasMore, roomId, currentPage, limit, user_id]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        chatContainerRef.current &&
        chatContainerRef.current.scrollTop === 0
      ) {
        fetchMessages();
      }
    };

    const container = chatContainerRef.current;
    container?.addEventListener('scroll', handleScroll);

    return () => container?.removeEventListener('scroll', handleScroll);
  }, [fetchMessages]);

  const handleDeleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
  };

  const renderMessage = useMemo(
    () =>
      messages.map((msg, index) => (
        <MessageBubble
          key={index}
          {...msg}
          handleOpenModal={handleOpenModal}
          handleImageClick={handleImageClick}
          roomId={roomId}
          handleDeleteMessage={handleDeleteMessage}
        />
      )),
    [messages]
  );

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#EAEBEE',
        }}
      >
        <Typography variant='h6' color='textSecondary'>
          로딩 중...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        margin: '0 5%',
        marginTop: '32px',
        borderRadius: '18px',
        boxShadow: 'rgba(153, 129, 172, 0.3) 0px 7px 29px 0px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderRadius: '18px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '18px',
          }}
        >
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'black' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            sx={{
              fontSize: '18px',
              marginLeft: 1,
              fontWeight: 'bold',
            }}
          >
            채팅방
          </Typography>
        </Box>
        <Tabs value={0} sx={{ color: '#fff' }}>
          <Tab label='전체방' sx={{ minWidth: 'auto', color: 'black' }} />
          {/* <Tab label='인플만' sx={{ minWidth: 'auto', color: 'black' }} /> */}
        </Tabs>
      </Box>
      <Divider variant='middle' />
      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          padding: '0px 36px',
          overflowY: 'auto',
        }}
      >
        {renderMessage}
        <div ref={chatEndRef}></div>
      </Box>
      <Divider variant='middle' />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
          borderRadius: '18px',
          height: '8vh',
        }}
      >
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          placeholder='채팅을 입력해주세요'
          variant='outlined'
          size='small'
          sx={{ marginRight: 2 }}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <input
          accept='image/*'
          style={{ display: 'none' }}
          id='upload-image'
          type='file'
          onChange={handleImageUpload}
        />
        <label htmlFor='upload-image'>
          <Button
            component='span'
            variant='contained'
            sx={{
              boxShadow: 'none',
              color: 'white',
              minWidth: 'auto',
              padding: '10px',
              marginRight: 1,
            }}
          >
            <PhotoCamera />
          </Button>
        </label>
        <Button
          onClick={handleSendMessage}
          variant='contained'
          sx={{
            boxShadow: 'none',
            color: 'white',
            minWidth: 'auto',
            padding: '10px',
          }}
        >
          <SendRounded />
        </Button>
      </Box>
      <FollowModal
        open={isModalOpen}
        modalType={modalType}
        influencerId={Number(selectedInfluencerId) || null}
        onClose={handleCloseModal}
      />
      <Modal
        open={!!selectedImage}
        onClose={handleCloseImageModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={selectedImage || ''}
          alt='large image'
          style={{ maxWidth: '90%', maxHeight: '90%' }}
        />
      </Modal>
    </Box>
  );
};

export default Chat;
