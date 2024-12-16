import React, { useState } from 'react';
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from 'axios';

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

interface MessageBubbleProps extends Message {
    handleOpenModal: (id: string, type: "membership" | "profile") => void;
    handleImageClick: (src: string) => void;
    roomId: string;
    handleDeleteMessage: (id: string) => void;
}

const handleDeleteImage = async (id: string, key: string, handleDeleteMessage: (id: string) => void) => {
    console.log('Deleting image:', key);
    try {
        await axios.post('http://localhost:4000/message/delete', { id, key });
        handleDeleteMessage(id);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ handleOpenModal, handleImageClick, roomId, handleDeleteMessage, ...message }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: message.isMine ? "row-reverse" : "row",
                alignItems: "center",
                marginTop: 2,
                marginBottom: 2,
                position: "relative",
            }}
        >
            <Avatar
                alt="profile"
                src={message.profile}
                sx={{
                    width: 40,
                    height: 40,
                    margin: message.isMine ? "0 0 0 12px" : "0 12px 0 0",
                    outline: (String(roomId) === String(message.influencer_id)) && !message.isMine ? "3px solid #A88EFF" : "",
                    outlineOffset: '2px', // 요소와 outline 사이 간격을 설정
                    cursor: (String(roomId) === String(message.influencer_id)) && !message.isMine ? 'pointer' : 'default',
                    '&:hover': {
                        boxShadow: (String(roomId) === String(message.influencer_id)) && !message.isMine
                            ? "rgba(195, 116, 252, 0.584) 0px 7px 29px 0px"
                            : "none",
                    },
                }}
                onClick={() => {
                    if (String(message.influencer_id) === String(roomId)) {
                        handleOpenModal(String(message.influencer_id), "profile");
                    }
                }}
            />
            <Box sx={{ maxWidth: "60%", position: "relative" }}>
                {(
                    <Typography
                        variant="subtitle2"
                        sx={{
                            marginBottom: "5px",
                            color: "#555",
                            textAlign: message.isMine ? "right" : "left",
                        }}
                    >
                        {message.username}
                    </Typography>
                )}
                <Box
                    sx={{
                        backgroundColor: message.isMine ? "secondary.main" : "#EAEBEE",
                        color: message.isMine ? "white" : "black",
                        padding: "10px 15px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        wordWrap: "break-word",
                        textAlign: message.isMine ? "right" : "left",
                        position: "relative",
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {message.content.startsWith('http://') || message.content.startsWith('https://') ? (
                        <>
                            {!isImageLoaded && (
                                <Box
                                    sx={{
                                        width: '100px',
                                        height: '100px',
                                        backgroundColor: 'primary',
                                    }}
                                />
                            )}
                            <img
                                src={message.content}
                                alt="image"
                                style={{ display: isImageLoaded ? 'block' : 'none', maxWidth: '100px', cursor: 'pointer' }}
                                onLoad={() => setIsImageLoaded(true)}
                                onClick={() => handleImageClick(message.content)}
                            />
                            {message.isMine && isHovered && (
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        color: "white",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        '&:hover': {
                                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        },
                                    }}
                                    onClick={() => handleDeleteImage(message.id, message.content, handleDeleteMessage)}
                                >
                                    <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                                </IconButton>
                            )}
                        </>
                    ) : (
                        <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
                            {message.content}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default MessageBubble;