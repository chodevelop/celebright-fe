import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Stack,
  Collapse,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import { Edit, Delete, Reply, Send, ExpandMore, ExpandLess, Check, Close } from '@mui/icons-material';
import axiosInstance from '../../../api/client';

interface Message {
  id: number;
  sender: string;
  text: string;
  user?: { username: string; profile_picture: string };
  parent_comment_id?: number;
  User?: { username: string; profile_picture: string };
  user_id?: string;
  content?: string;
}

interface CommentProps {
  userId: string;
  message: Message;
  handleCommentModify: (index: number, updatedText: string) => void;
  handleCommentDelete: (index: number) => void;
  handleReply: (newReply: Message) => void;
  index: number;
  setReplies: React.Dispatch<React.SetStateAction<Message[]>>;
  replies: Message[];
  handleReplyModify: (replyIndex: number, updatedText: string) => void;
}

const Comment: React.FC<CommentProps> = ({
  userId,
  message,
  replies,
  handleReply,
  handleCommentModify,
  handleCommentDelete,
  index,
  setReplies,
  handleReplyModify,
}) => {
  const [replyInput, setReplyInput] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(message.text);
  const [replyEditInput, setReplyEditInput] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [error, setError] = useState('');

  const postId = sessionStorage.getItem('page') ?? null;

  const saveReplyToDb = async (reply: Message) => {
    try {
      const response = await axiosInstance.post('/comment', {
        user_id: userId,
        post_id: postId,
        parent_comment_id: reply.parent_comment_id,
        content: reply.text,
      });
      return response.data;
    } catch (error) {
      setError('댓글 저장 실패. 다시 시도해주세요.');
      console.error(error);
      throw error;
    }
  };

  const submitReply = async () => {
    if (!replyInput.trim() || !postId) return;

    const newReply: Message = {
      id: Date.now(),
      sender: userId,
      text: replyInput.trim(),
      parent_comment_id: message.id,
    };

    try {
      const savedReply = await saveReplyToDb(newReply);
      setReplies((prevReplies) => [...prevReplies, savedReply]);
      handleReply(savedReply);
      setReplyInput('');
      setIsReplying(false);
    } catch {
      console.error('답글 저장 실패');
    }
  };

  const submitEdit = async () => {
    if (!editInput.trim()) {
      setError('수정할 내용을 입력하세요.');
      return;
    }
    try {
      await handleCommentModify(index, editInput);
      setIsEditing(false);
      setError('');
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  const submitReplyEdit = async (replyId: number, replyIndex: number) => {
    if (!replyEditInput.trim()) {
      setError('수정할 내용을 입력하세요.');
      return;
    }
    try {
      await handleReplyModify(replyIndex, replyEditInput);
      setEditingReplyId(null);
      setReplyEditInput('');
      setError('');
    } catch (error) {
      console.error('대댓글 수정 실패:', error);
    }
  };

  const renderReplies = () => (
    <Box sx={{ marginTop: 1, paddingLeft: 3 }}>
      {replies.map((reply, replyIndex) => (
  <Box
    key={reply.id}
    sx={{
      backgroundColor: '#f9f9f9',
      padding: '8px 16px',
      borderRadius: 2,
      marginBottom: 1,
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Avatar
      src={reply.User?.profile_picture || ''}
      sx={{ width: 32, height: 32, marginRight: 2 }}
    />
    <Box sx={{ flexGrow: 1 }}>
      {editingReplyId === reply.id ? (
        <TextField
          fullWidth
          size="small"
          value={replyEditInput}
          onChange={(e) => setReplyEditInput(e.target.value)}
        />
      ) : (
        <>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {reply.User?.username || '익명'}
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {reply.content || reply.text}
          </Typography>
        </>
      )}
    </Box>
    <Box sx={{ display: 'flex', gap: 1 }}>
      {/* 수정/삭제 버튼 조건 */}
      {reply.user_id == userId && (
        <>
          {editingReplyId === reply.id ? (
            <>
              <IconButton
                size="small"
                onClick={() => submitReplyEdit(reply.id, replyIndex)}
                sx={{ color: '#4caf50' }}
              >
                <Check fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setEditingReplyId(null);
                  setReplyEditInput('');
                }}
                sx={{ color: '#f44336' }}
              >
                <Close fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                size="small"
                onClick={() => {
                  setEditingReplyId(reply.id);
                  setReplyEditInput(reply.content!); // 수정할 내용 설정
                }}
                sx={{ color: '#9252E7' }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleCommentDelete(replyIndex)}
                sx={{ color: '#FF6F61' }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </>
          )}
        </>
      )}
    </Box>
  </Box>
))}
    </Box>
  );

  return (
    <Box
      sx={{
        padding: '4px 16px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        marginBottom: 0.5,
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={message.user?.profile_picture}
            sx={{ width: 32, height: 32 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {isEditing ? (
              <TextField
                fullWidth
                size="small"
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
              />
            ) : (
              <>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {message.user?.username || '익명'}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {message.text}
                </Typography>
              </>
            )}
          </Box>
          {message.sender === userId && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isEditing ? (
                <>
                  <IconButton
                    size="small"
                    onClick={submitEdit}
                    sx={{ color: '#4caf50' }}
                  >
                    <Check fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setIsEditing(false);
                      setEditInput(message.text);
                    }}
                    sx={{ color: '#f44336' }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    size="small"
                    onClick={() => setIsEditing(true)}
                    sx={{ color: '#9252E7' }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleCommentDelete(index)}
                    sx={{ color: '#FF6F61' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          )}
          <IconButton
            size="small"
            onClick={() => setIsReplying((prev) => !prev)}
            sx={{ color: '#555' }}
          >
            <Reply fontSize="small" />
          </IconButton>
        </Stack>

        {isReplying && (
          <Box
            sx={{
              marginTop: 1,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 4,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="답글을 입력하세요"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
            />
            <IconButton
              size="small"
              onClick={submitReply}
              sx={{ marginLeft: 1 }}
            >
              <Send fontSize="small" />
            </IconButton>
          </Box>
        )}

        {replies.length > 0 && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ marginTop: 1 }}
            >
              <Button
                size="small"
                onClick={() => setShowReplies((prev) => !prev)}
                sx={{ textTransform: 'none', padding: 0, color: '#555' }}
                startIcon={showReplies ? <ExpandLess /> : <ExpandMore />}
              >
                {showReplies ? '숨기기' : `답글(${replies.length})`}
              </Button>
            </Stack>
            <Collapse in={showReplies} timeout="auto" unmountOnExit>
              {renderReplies()}
            </Collapse>
          </>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default Comment;
