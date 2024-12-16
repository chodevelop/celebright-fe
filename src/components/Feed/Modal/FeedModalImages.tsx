import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar, Navigation } from 'swiper/modules';
import 'swiper/css';
import ProductSlider from './FeedModalProductSlider';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { ProductsProps } from '../../../types/FeedType';

type ImagesProps = {
  images: string[];
  products: ProductsProps[];
};

const FeedModalImages = ({ images, products }: ImagesProps) => {
  const [isShowProduct, setIsShowProduct] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null); // Swiper 인스턴스 참조

  const onShowProduct = () => {
    setIsShowProduct((prev) => !prev);
  };

  return (
    <Box sx={{ position: 'relative', p: 0 }}>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        // pagination={{ clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[Pagination, Scrollbar, Navigation]}
        loop={false}
        onSwiper={(swiper: any) => {
          swiperRef.current = swiper; // Swiper 인스턴스 저장
        }}
        onSlideChange={(swiper: any) => {
          setActiveIndex(swiper.activeIndex); // 슬라이드 변경 시 상태 업데이트
        }}
        style={{ width: '100%', height: '700px' }}
      >
        {images.map((src, index) => (
          <SwiperSlide
            key={index}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Box
              sx={{
                // borderRadius: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: 'black',
                width: '100%',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              <img
                src={src}
                alt={`Slide ${index}`}
                style={{
                  width: '100%',
                }}
                onClick={() => setIsShowProduct(false)}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 왼쪽 버튼 */}
      {activeIndex > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
          onClick={() => {
            swiperRef.current?.slidePrev(); // 이전 슬라이드로 이동
          }}
          className='swiper-button-prev'
        >
          <ArrowBackIosIcon
            sx={{
              color: '#fff',
              fontSize: '14px',
              position: 'relative',
              left: '3px',
            }}
          />
        </Box>
      )}

      {/* 오른쪽 버튼 */}
      {activeIndex < images.length - 1 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
          onClick={() => {
            swiperRef.current?.slideNext(); // 다음 슬라이드로 이동
          }}
          className='swiper-button-next'
        >
          <ArrowForwardIosIcon
            sx={{
              color: '#fff',
              fontSize: '14px',
              position: 'relative',
              left: '1px',
            }}
          />
        </Box>
      )}
      {/* 쇼핑 카트 버튼 */}
      {!isShowProduct && products.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // 반투명 배경
            color: '#fff', // 아이콘 색상
            borderRadius: '50%', // 동그란 버튼
            width: '50px',
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // hover 효과
            },
          }}
          onClick={onShowProduct}
        >
          <LocalMallIcon color='primary' sx={{ fontSize: '30px' }} />
        </Box>
      )}

      {/* 닫기 버튼 */}
      {isShowProduct && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '24px',
            right: '25px',
            backgroundColor: 'rgba(168,142,255,0.6)', // 닫기 버튼 배경
            color: '#fff',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'rgba(168,142,255,0.8)'
            },
          }}
          onClick={onShowProduct}
        >
          <CloseIcon sx={{ fontSize: '30px' }} />
        </Box>
      )}
      {/* Product Slider */}
      {isShowProduct && <ProductSlider products={products} />}
    </Box>
  );
};

export default FeedModalImages;
