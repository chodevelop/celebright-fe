import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Grid } from '@mui/material';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import CancelIcon from '@mui/icons-material/Cancel';
import 'swiper/css';

type FeedImagesProps = {
  feedImages: Array<File | string>;
  onAddImage: (file: File) => void;
  onRemoveImage: (index: number) => void;
};

const FeedImages: React.FC<FeedImagesProps> = ({
  feedImages,
  onAddImage,
  onRemoveImage,
}) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    // 이미지 미리보기 URL 생성
    const urls = feedImages.map((file) =>
      typeof file === 'string' ? file : URL.createObjectURL(file)
    );
    setPreviewUrls(urls);

    // 메모리 정리
    return () => {
      urls.forEach((url) => {
        if (!feedImages.includes(url)) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [feedImages]);

  return (
    <>
      <Swiper
        spaceBetween={10}
        slidesPerView={'auto'}
        grabCursor={true}
        loop={false}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 2 },
        }}
      >
        {previewUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <Grid
              container
              sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}
            >
              <Grid
                item
                xs={12}
                sx={{
                  width: "100%",
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >


                <CancelIcon
                  color='primary'
                  sx={{
                    position: 'absolute',
                    right: "5%",
                    top: "2%",
                    width: '25px',
                    height: '25px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                  }}
                  onClick={() => onRemoveImage(index)}
                />


                <img
                  src={url}
                  alt={`preview-${index}`}
                  style={{
                    width: '250px',       // 원하는 고정 너비
                    height: '250px',
                    // height: 'auto',
                    objectFit: "cover",
                    borderRadius: 6
                  }}
                />
              </Grid>
            </Grid>
          </SwiperSlide>
        ))}
      </Swiper >

      <Button
        variant='outlined'
        component='label'
        fullWidth
        startIcon={<AddSharpIcon />}
        sx={{ mb: 2 }}
      >
        이미지 추가
        <input
          hidden
          type='file'
          accept='image/*'
          onChange={(e) => e.target.files && onAddImage(e.target.files[0])}
        />
      </Button>
    </>
  );
};

export default FeedImages;
