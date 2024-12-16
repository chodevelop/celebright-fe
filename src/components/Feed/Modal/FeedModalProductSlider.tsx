import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import Chip from '@mui/material/Chip';
import { ProductsProps } from '../../../types/FeedType';

const ProductSlider = ({ products }: { products: ProductsProps[] }) => {
  // const products = [1, 2, 3]; // 샘플 데이터

  return (
    <Box
      sx={{
        width: '100%',
        position: 'absolute',
        bottom: '10px',
      }}
    >
      <Swiper
        spaceBetween={10} // 슬라이드 간격
        slidesPerView={2} // 슬라이드 수가 적다면 더 작은 값 사용
        slidesPerGroup={1}
        style={{

          width: '100%',
          // height: '230px', // Swiper의 높이 명시적으로 설정
        }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 10 },
          768: { slidesPerView: 2, spaceBetween: 10 },
        }}
      >
        {products.map((item, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{

                border: '1px solid #ddd',
                borderRadius: 2,
                bgcolor: '#fff',
                p: 1,
                width: '230px', // 슬라이드 크기 조정

                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',

              }}
            >
              <img
                src={item.img}
                alt={`Product ${index + 1}`}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: "4px"
                }}
              />

              <Button fullWidth
                variant='outlined' color='primary' onClick={() => window.open(item.link)}
                sx={{
                  mt: 1,
                  // position: "absolute",
                  fontWeight: "bold",
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    border: 'none',
                  },
                }}>
                {item.title}
              </Button>

            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ProductSlider;
