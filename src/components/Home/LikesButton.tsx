import React from "react";
import { ReactComponent as BrightLikesActivate } from "../../assets/BrightLikes.svg";
import { ReactComponent as BrightLikesDeactivate } from "../../assets/BrightLikesDeactivate.svg";
import ParticleEffect from "../../assets/effect3.svg";
import { Button } from "@mui/material";

interface LikesButtonProps {
  isLiking: boolean; // 현재 팔로우 상태
  onToggleLike: () => void; // 팔로우 상태를 변경하는 함수
}
const LikesButton: React.FC<LikesButtonProps> = ({ isLiking, onToggleLike }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleEffect(e);
    onToggleLike(); // 상태 변경
  }

  //Add effects in here
  let amount = 10;
  let particleSizeMultiple = 10;// 최소 사이즈에서 최대 얼마나 커질 수 있는지 가중치
  let particleSizeMinimum = 5; //최소 사이즈

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

    // Scroll 이벤트로 파티클 위치 업데이트
    const initialScroll = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const updatedY = initialScroll - currentScroll; // 뷰포트 내 위치 유지
      particle.style.top = `${updatedY}px`;
    };
    window.addEventListener("scroll", handleScroll);

    animation.onfinish = () => {
      window.removeEventListener("scroll", handleScroll);
      particle.remove();
    };
  }

  return (
    <Button
      onClick={handleClick}
      sx={{
        width: 'auto',
        height: 'auto',
        margin: 0,
        border: 0,
        padding: 0,
        minWidth: 'unset', // MUI 기본 최소 너비 제거
        minHeight: 'unset', // MUI 기본 최소 높이 제거
      }}>
      {isLiking ? (
        <BrightLikesActivate />
      ) : (
        <BrightLikesDeactivate />
      )}
    </Button>
  );
};

export default LikesButton;