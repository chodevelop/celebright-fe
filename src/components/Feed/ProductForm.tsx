import React, { useLayoutEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Select,
  MenuItem,
  Button,
  Divider,
  Container,
} from '@mui/material';
import FeedImages from './FeedImages';
import FeedRecommendations from './FeedRecommendations';
import { feedGet, feedUpdate, feedWrite } from '../../api/requests/feedApi';
import { useNavigate } from 'react-router-dom';

type Product = {
  img: null;
  link: string;
  title: string;
  [key: string]: any; // 동적 속성 허용
};

const PostForm = ({ id, pathname }: { id: string; pathname: string }) => {

  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState('1');
  const [postImages, setPostImages] = useState<File[]>([]);
  const [productImgs, setProductImgs] = useState([
    { img: null, link: '', title: '' },
  ]);

  useLayoutEffect(() => {
    const fetchData = async () => {
      if (!pathname.includes('update')) return;
      const data = await feedGet(id); // 이미지 데이터 가져오기
      setProductImgs(data.products);
      setPostImages(data.images);
      setGrade(data.visibility_level);
      setDescription(data.content);
    };
    fetchData();
  }, [id, pathname]);

  const handleAddPostImage = (file: File) =>
    setPostImages([...postImages, file]);
  const handleRemovePostImage = (index: number) =>
    setPostImages(postImages.filter((_, i) => i !== index));

  const handleProductChange = (index: number, field: string, value: any) => {
    const updatedProducts: Product[] = [...productImgs];
    updatedProducts[index][field] = value;
    setProductImgs(updatedProducts);
  };

  const addProduct = () =>
    setProductImgs([...productImgs, { img: null, link: '', title: '' }]);
  const removeProduct = (index: number) =>
    setProductImgs(productImgs.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    postImages.forEach((image) => formData.append('postImages', image));
    productImgs.forEach((product) => {
      if (product.img) formData.append('productImgs', product.img);
      formData.append('productImgsLink', product.link);
      formData.append('productImgsTitle', product.title);
    });
    formData.append('description', description);
    formData.append('grade', grade);

    const res = pathname.includes('update')
      ? await feedUpdate(id, formData)
      : await feedWrite(formData);
    if (res?.status === 200) {
      alert(`${res.data.message}`);
      return navigate('/');
    }
  };

  return (

    <Box
      sx={{
        backgroundColor: 'white',
        padding: '36px',

        borderRadius: '18px',
        boxShadow: 'rgba(153, 129, 172, 0.3) 0px 7px 29px 0px',

        margin: '0 5%',
        marginTop: '32px',
        minHeight: '81vh',
        maxWidth: '600px',
      }}
    >
      {/* <Typography
          variant='h5'
          sx={{
            mb: 3,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          {pathname.includes('update') ? '게시글 수정하기' : '게시글 등록하기'}
        </Typography> */}

      <Stack spacing={3}>
        <FeedImages
          feedImages={postImages}
          onAddImage={handleAddPostImage}
          onRemoveImage={handleRemovePostImage}
        />

        <TextField
          fullWidth
          label='내용'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
        />

        <Select
          color='primary'
          fullWidth
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          size='small'
          sx={{ color: "#545454" }}
        >
          <MenuItem value='3' sx={{ color: "#545454" }}>단일공개</MenuItem>
          <MenuItem value='2' sx={{ color: "#545454" }} color='primary'>개별공개</MenuItem>
          <MenuItem value='1' sx={{ color: "#545454" }} color='primary'>전체공개</MenuItem>
        </Select>

        <FeedRecommendations
          pathname={pathname}
          Feeds={productImgs}
          onAddFeed={addProduct}
          onRemoveFeed={removeProduct}
          onFeedsChange={handleProductChange}
        />

        <Button
          variant='contained'
          color='primary'
          size='small'
          fullWidth
          sx={{
            py: 1.0,
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: 2,
          }}
          onClick={handleSubmit}
        >
          {pathname.includes('update') ? '수정하기' : '등록하기'}
        </Button>
      </Stack>
    </Box>

  );
};

export default PostForm;
