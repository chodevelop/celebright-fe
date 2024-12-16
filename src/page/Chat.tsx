import { useParams } from 'react-router-dom';
import ChatDesign from '../components/chat/ChatDesign';

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>(); // URL에서 roomId 추출

  if (!roomId) {
    return <div>Error: Room ID is missing</div>;
  }

  return (
    <>
      <ChatDesign roomId={roomId}></ChatDesign>
    </>
  );
};

export default Room;
