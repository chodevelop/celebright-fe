import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  List,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion 추가
import FollowCard from "../components/common/FollowCard";
import FollowModal from "../components/MyPage/FollowModal";

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [openModal, setOpenModal] = useState(false);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<
    number | null
  >(null);
  const [modalType, setModalType] = useState<'membership' | 'profile' | null>(
    null
  );

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    console.log(influencers)
    if (query.trim() === "") {
      setInfluencers([]);
    } else {
      filterInfluencers(query);
    }
  }, [query, users]);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/user/all');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filterInfluencers = (query: string) => {
    const filtered = users
      .filter((user) => user.is_influencer)
      .filter((influencer) =>
        influencer.username.toLowerCase().includes(query.toLowerCase())
      );
    setInfluencers(filtered);
    console.log(filtered);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuery(query);
  };

  const handleCardClick = (influencerId: number) => {
    setSelectedInfluencerId(influencerId);
    console.log(influencerId)
    setModalType('profile');
    setOpenModal(true);
  };

  const handleMembershipClick = (influencerId: number) => {
    setSelectedInfluencerId(influencerId);
    setModalType('membership');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedInfluencerId(null);
    setModalType(null);
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  return (
    <Box
      sx={{
        minHeight: "81vh",
        backgroundColor: "white",
        margin: "0 5%",
        marginTop: "32px",
        marginBottom: "32px",
        borderRadius: "18px",
        boxShadow: "rgba(153, 129, 172, 0.3) 0px 7px 29px 0px",

      }}
    >
      <Container>
        <form onSubmit={handleSearch} style={{ marginTop: '20px' }}>
          <TextField
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px", // 인풋창의 borderRadius 조정
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#A88EFF", // 마우스 오버 시 테두리 색상 변경 (선택 사항)
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#6200ea", // 포커스 시 테두리 색상 변경 (선택 사항)
              },
            }}
            autoComplete='off'
            variant='outlined'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='검색어를 입력하세요'
            margin='normal'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton type='submit'
                    sx={{ padding: 0 }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        {/* 검색 결과를 표시하는 부분 */}
        {query.trim() !== '' && (
          <div>
            <AnimatePresence>
              <List>
                {influencers.slice(0, visibleCount).map((influencer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    style={{ marginBottom: '16px' }}
                  >

                    <FollowCard
                      follow={{
                        id: influencer.influencer?.id,
                        User: {
                          username: influencer.username,
                          profile_image: influencer.profile_picture,
                        },
                        category: influencer.influencer?.category,
                      }}
                      isSubscribed={false}
                      subscriptions={[]}
                      onMembershipClick={handleMembershipClick}
                      onCardClick={handleCardClick}
                    />
                  </motion.div>
                ))}
              </List>
            </AnimatePresence>

            {influencers.length > visibleCount && (
              <Box display='flex' justifyContent='center' mt={-2}>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <IconButton onClick={handleShowMore}>
                    <ExpandMoreIcon />
                  </IconButton>
                </motion.div>
              </Box>
            )}
          </div>
        )}

        <FollowModal
          open={openModal}
          modalType={modalType}
          influencerId={selectedInfluencerId}
          onClose={handleCloseModal}
          onSubscriptionUpdate={() => { }}
        />
      </Container>
    </Box>
  );
};

export default SearchPage;
