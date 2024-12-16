import React, { useState } from "react";
import { ReactComponent as BrightLogo } from "../../assets/BrightLogo.svg";
import ParticleEffect from "../../assets/effect3.svg";
import { Box, Button } from "@mui/material";

interface FollowButtonProps {
  isFollowing: number; // 현재 팔로우 상태
  onToggleFollow: () => void; // 팔로우 상태를 변경하는 함수
}

const FollowButton: React.FC<FollowButtonProps> = ({ isFollowing, onToggleFollow }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const button = e.currentTarget; // 버튼 참조 저장
    if (!isFollowing) {
      button.disabled = true; // 버튼 비활성화
      handleEffect(e);
      setTimeout(() => {
        button.disabled = false;
        onToggleFollow(); // 상태 변경
      }, 500); // 500ms 후 활성화
    } else {
      onToggleFollow(); // 상태 변경
    }
  }

  //Add effects in here
  let amount = 30;
  let particleSizeMultiple = 20;// 최소 사이즈에서 최대 얼마나 커질 수 있는지 가중치
  let particleSizeMinimum = 8; //최소 사이즈

  const handleEffect = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    const bbox = e.currentTarget.getBoundingClientRect();
    const x = bbox.left + bbox.width / 2;
    const y = bbox.top + bbox.height / 2;
    for (let i = 0; i < amount; i++) {
      // We call the function createParticle 30 times
      // We pass the coordinates of the button for x & y values
      console.log(x, y);
      createParticle(x, y);
    }
  }

  function createParticle(x: any, y: any) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // const particle = document.createElement('particle');
    document.body.appendChild(particle);

    let width = Math.floor(Math.random() * particleSizeMultiple + particleSizeMinimum);
    let height = width;
    let destinationX = (Math.random() - 0.5) * 300;
    let destinationY = (Math.random() - 0.5) * 300;
    let rotation = Math.random() * 520;
    let delay = Math.random() * 200;

    particle.style.backgroundImage = `url(${ParticleEffect})`;
    particle.style.width = `${width}px`;
    particle.style.height = `${height}px`;

    particle.style.position = "fixed";
    particle.style.left = "0";
    particle.style.top = "0";
    // particle.style.left = `${x}px`;
    // particle.style.top = `${y}px`;
    particle.style.opacity = "0";
    particle.style.pointerEvents = "none";
    particle.style.backgroundRepeat = "no-repeat";
    particle.style.backgroundSize = "contain";
    particle.style.zIndex = "9999";

    const animation = particle.animate([
      {
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
        opacity: 1
      },
      {
        transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${y + destinationY}px) rotate(${rotation}deg)`,
        opacity: 0
      }
    ], {
      duration: Math.random() * 1000 + 5000,
      easing: 'cubic-bezier(0, .9, .57, 1)',
      delay: delay
    });

    const initialScroll = window.scrollY;

    // Scroll 이벤트로 파티클 위치 업데이트
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const updatedY = initialScroll - currentScroll; // 뷰포트 내 위치 유지
      particle.style.top = `${updatedY}px`;
    };

    window.addEventListener("scroll", handleScroll);

    // animation.onfinish = removeParticle;
    animation.onfinish = () => {
      window.removeEventListener("scroll", handleScroll);
      particle.remove();
    };
  }

  return (
    <Button
      onClick={handleClick}
      variant="contained"
      size="small"
      disabled={isFollowing > 1 ? true : false}
      sx={{
        position: "relative",
        width: "75px",
        height: "24px",
        background: "linear-gradient(180deg, #9252E7 33.82%, #FF3CE5 100%)", // 전체 그라데이션 처리
        borderRadius: "12px",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none", // Hover 상태에서도 boxShadow 제거
        },
        "&:active": {
          boxShadow: "none", // 클릭 상태에서도 boxShadow 제거
        },
      }}>
      <Box sx={{
        position: "absolute",
        top: 1,
        left: 1,
        width: "73px",
        height: "22px",
        background: "rgba(249, 249, 249, 1)", // 전체 그라데이션 처리
        borderRadius: "12px",
        "&:hover": {
          background: "rgba(249, 249, 249, 0.9)", // 글씨 배경 톤다운
        },
        "&:active": {
          background: "rgba(249, 249, 249, 0.7)", // 글씨 배경 톤다운
        },
      }}>
        <BrightLogo
          style={{
            position: "absolute",
            top: "3px",
            left: "4px",
            width: "16px",
            height: "16px",
          }} />
        <Box sx={{
          position: "absolute",
          left: "27px",
          color: "transparent",
          background: "linear-gradient(180deg, #9252E7 33.82%, #FF3CE5 100%)", // 전체 그라데이션 처리
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
        }}>
          {
          isFollowing > 1 ? ( "멤버쉽" ) 
          : isFollowing === 1 ? ( "팔로잉" )
          : ( "팔로우" )
          }
        </Box>
      </Box>
    </Button>
  );
};

export default FollowButton;