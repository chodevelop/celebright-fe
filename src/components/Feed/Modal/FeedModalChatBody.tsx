import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, IconButton, Typography, TextField, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';

import axios from 'axios';
import axiosInstance from '../../../api/client';
import { feedLikes } from '../../../api/requests/feedApi';
import { useFeedStore } from '../../../store/feedStore';
import Comment from './Comment';
import { useInitializeUser } from '../../../hooks/homeFeed/useInitializeUser';

interface Message {
  id: number;
  sender: string;
  text: string;
  user?: { username: string; profile_picture: string };
  parent_comment_id?: number;
  replies?: Message[];
}

interface ChatProps {
  userId: string | number;
  content: string;
  id: string;
  likes: string[];
}

const Chat: React.FC<ChatProps> = ({ userId, content, id, likes }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isComment, setIsComment] = useState<boolean>(false);
  const [commentInput, setCommentInput] = useState('');
  const [isLiked, setIsLiked] = useState(likes.includes(userId.toString()));
  const [replies, setReplies] = useState<Message[]>([]);
  const { feed: apiCall, setFeed: setApiCall } = useFeedStore();
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const { loggedInUser } = useInitializeUser(); // 사용자 정보
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  const handleReply = (newReply: Message) => {
    setReplies((prevReplies) => [...prevReplies, newReply]);
  };

  const handleCommentModify = async (index: number, updatedText: string) => {
    const modifiedComments = messages.map((msg: Message, idx: number) => {
      if (idx === index) {
        return { ...msg, text: updatedText };
      }
      return msg;
    });
    setMessages(modifiedComments);

    const commentToUpdate = messages[index];
    if (commentToUpdate) {
      try {
        await updateCommentInDb(commentToUpdate.id, updatedText);
      } catch (error) {
        console.error('댓글 수정 실패:', error);
      }
    }
  };

  const updateCommentInDb = async (commentId: number, updatedText: string) => {
    try {
      const response = await axiosInstance.patch(`/comment/${commentId}`, {
        content: updatedText,
      });
      return response.data;
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
      throw error;
    }
  };

  const handleReplyModify = async (
    commentIndex: number,
    replyIndex: number,
    updatedText: string
  ) => {
    const modifiedComments = messages.map((msg: Message, idx: number) => {
      if (idx === commentIndex) {
        // 대상 댓글에서 replies 배열 업데이트
        const updatedReplies = msg.replies?.map((reply, rIdx) => {
          if (rIdx === replyIndex) {
            return { ...reply, content: updatedText }; // 대댓글의 content 업데이트
          }
          return reply;
        });
        return { ...msg, replies: updatedReplies }; // 업데이트된 replies 적용
      }
      return msg;
    });

    setMessages(modifiedComments); // 상태 갱신

    const replyToUpdate = messages[commentIndex]?.replies?.[replyIndex];
    if (replyToUpdate) {
      try {
        await updateReplyInDb(replyToUpdate.id, updatedText); // DB 업데이트
      } catch (error) {
        console.error('대댓글 수정 실패:', error);
      }
    }
  };


  const updateReplyInDb = async (replyId: number, updatedText: string) => {
    try {
      const response = await axiosInstance.patch(`/comment/${replyId}`, {
        content: updatedText,
      });
      return response.data;
    } catch (error) {
      console.error('대댓글 수정 중 오류 발생:', error);
      throw error;
    }
  };

  const handleCommentDelete = async (index: number) => {
    const commentToDelete = messages[index]; // 삭제할 댓글 정보 가져오기

    try {
      // DB에서 댓글 삭제
      const result = await deleteCommentFromDb(commentToDelete.id);
      if (result.success) {
        // console.log('댓글 삭제 성공:', result.message);
        // setIsComment(prev => !prev);
        // UI에서 댓글 삭제
        const updatedComments = messages.filter((_, idx) => idx !== index);
        setMessages(updatedComments);
      } else {
        console.error('댓글 삭제 실패:', result.message);
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };
  const getComment = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/comment/${id}`);
      console.log(response.data, 'dsdwdsjabjdjsh');

      if (response.data.success) {
        // response.data.data가 댓글 목록이라 가정
        const fetchedMessages: Message[] = response.data.data.map(
          (comment: any) => ({
            id: comment.id,
            sender: comment.user_id.toString(),
            text: comment.content,
            user: comment.User,
            replies: comment.replies,
          })
        );

        setMessages(fetchedMessages); // 댓글을 상태에 저장
        if (commentsEndRef.current) {
          commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        console.error('댓글을 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('댓글을 불러오는 중 오류 발생:', error);
    }
  }, [id]);
  useEffect(() => {
    getComment();
  }, [getComment, id, isComment, replies]);

  const saveCommentToDb = async (comment: Message) => {
    try {
      const response = await axiosInstance.post(`/comment`, {
        user_id: userId, // 유저 ID
        post_id: id, // 게시글 ID
        parent_comment_id: null, // 부모 댓글 ID (대댓글이 아닌 경우 null)
        content: comment.text, // 댓글 내용
      });

      if (!response) {
        throw new Error('댓글 저장 실패');
      }
      return await response.data;
    } catch (error) {
      console.error('댓글 저장 중 오류 발생:', error);
      throw error;
    }
  };

  const deleteCommentFromDb = async (commentId: number) => {
    try {
      const response = await axiosInstance.delete(`/comment/${commentId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          '댓글 삭제 요청 실패:',
          error.response?.data || error.message
        );
      } else {
        console.error('알 수 없는 오류 발생:', error);
      }
      throw error;
    }
  };

  const commentSend = async () => {
    if (commentInput.trim() !== '') {
      // 1. 입력한 댓글을 임시로 로컬 상태에 추가
      const tempMessage: Message = {
        id: Date.now(), // 임시 ID
        sender: userId.toString(),
        text: commentInput.trim(),
      };

      // 2. 서버로 댓글 저장 요청
      try {
        const savedComment = await saveCommentToDb(tempMessage); // 서버에 저장
        // console.log('저장된 댓글:', savedComment);

        if (savedComment.success === true) {
          setIsComment((prev) => !prev);
          getComment();
        }
      } catch (error) {
        console.error('댓글 저장 실패:', error);
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== tempMessage.id)
        );
      }

      // 3. 입력 필드 초기화
      setCommentInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commentSend();
  };

  const onLikes = async (id: string) => {
    if (userId === '0') return alert('로그인안되있어');
    feedLikes(id);
    setApiCall(!apiCall);
  };
  return (
    <Box sx={{ p: 2, height: '90%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant='subtitle2'
            sx={{
              fontWeight: 'bold',
              color: '#555',
              padding: '20px 5px 30px 5px',
              borderBottom: '1px solid #ddd',
            }}
          >
            {content}
          </Typography>
        </Box>
        <Box
          sx={{
            overflowY: 'auto',
          }}
        >
          {/* <Typography
            sx={{ fontWeight: "bold", color: "#555", padding: "0px 5px" }}
          >
            댓글
          </Typography> */}
          {messages.map((message: Message, index: number) => {
            return (
              <Comment
                key={message.id}
                userId={String(userId)}
                message={message}
                handleCommentModify={handleCommentModify}
                handleCommentDelete={handleCommentDelete}
                index={index}
                handleReply={handleReply}
                setReplies={setReplies}
                replies={message?.replies || []}
                handleReplyModify={(replyIndex, updatedText) => handleReplyModify(index, replyIndex, updatedText)}
              />
            );
          })}
          <div ref={commentsEndRef} /> {/* 댓글 리스트 마지막에 추가 */}
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            display: 'flex',
            borderTop: '1px solid #ddd',
            padding: '5px 0 0 0',
          }}
        >
          <Button
            disabled={!loggedInUser}
            onClick={() => onLikes(`${id}`)}
            sx={{
              fontWeight: 'bold', // 텍스트 굵기 변경 (선택사항)
            }}
          >
            {likes.includes(`${userId}`) ? (
              <FavoriteIcon sx={{ cursor: 'pointer', marginRight: '5px' }} />
            ) : (
              <FavoriteBorderIcon
                sx={{ cursor: 'pointer', marginRight: '5px', color: '#000000' }}
              />
            )}
            <span style={{ color: '#000000' }}> 좋아요 {likes.length} 개</span>
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', pt: 1 }}>
          <TextField
            fullWidth
            placeholder={loggedInUser ? '메시지를 입력하세요' : '로그인이 필요합니다'}
            size='small'
            value={commentInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' } },
            }}
            disabled = {!loggedInUser}
          />
          <IconButton color='primary' onClick={commentSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
