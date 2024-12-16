//사용자가 room 에 들어가거나 나갈때 동적으로 웹 소켓을 연결 생성하고 해제한다.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Card,
    Chip,
    CardContent,
    Button,
    Rating,
    AvatarGroup,
} from "@mui/material";
import { getUserId } from '../../util/getUser';

interface RoomList {
    room_name: string;
    influencer_id: string;
    influencer_profile: string;
    influencer_name: string;
    subscriptionInfo: {
        about_me?: string;
        benefits?: string;
        influencerName?: string;
        influencerProfile?: string;
        price?: string;
        productId?: string;
        productName?: string;
    }

}

interface myRoom {
    room_name: string;
    influencer_id: string;
    about_me: string;
    profile_picture: string;
}

const RoomForm: React.FC = () => {

    const getLoginData = async () => {
        let loginId = getUserId();
        if (loginId) {
            let getUserInfo = async () => {
                try {

                    const response = await axios.get(`http://localhost:4000/user/${loginId}`)
                    setUser_id(loginId);
                    setUser_name(response.data.username);
                    setUser_profile(response.data.profile_picture);



                    if (response.data.influencer.id) {

                        setMyRoom({
                            room_name: response.data.username,
                            influencer_id: response.data.influencer.id,
                            profile_picture: response.data.profile_picture,
                            about_me: response.data.about_me,
                        })
                    }
                }
                catch (err) {
                    console.log("로그인 유저 정보 조회 실패");
                }
            }
            getUserInfo();
            const roomResponse = await fetchMappedRoomData(loginId); //구독된 인플루언서와 방의 정보를 매핑하여 가져온다


            setRooms(roomResponse);

        } else {
            alert('로그인 정보가 없습니다. 로그인해주세요');
        }
    }

    //채팅방 목록
    const [rooms, setRooms] = useState<RoomList[]>([]); //생성된 방 리스트

    //채팅방 입장할때 채팅방에 넘길 유저의 정보
    const [user_id, setUser_id] = useState<string>('');
    const [user_name, setUser_name] = useState<string>('');
    const [user_profile, setUser_profile] = useState<string>('');
    const [followings, setFollwings] = useState<object>([]);
    const [myRoom, setMyRoom] = useState<myRoom>(
        {
            room_name: '',
            influencer_id: '',
            about_me: '',
            profile_picture: '',
        }
    );

    useEffect(() => {

        getLoginData(); //로그인 정보를 가져온다.

    }, []);


    //1.구독정보 매핑해서 인플정보 가져오기
    const getMappingSubscribe = async (userId: any) => {
        try {

            //0. 팔로워 정보 가져옴
            const followings = await axios.get(`http://localhost:4000/room/follwing/${userId}`)
            setFollwings(followings.data);

            //1.구독정보 가져오기
            const subscription = await getSubscriptions(userId);

            // 2.각 구독 아이템의 influencerId로 인플루언서 정보 가져오기
            const mappedData = await Promise.all(
                subscription.map(async (subscription: any) => {
                    const influencerInfo = await getInfluencerInfo(subscription.product.influencer_id);

                    console.log("influencerInfo---", influencerInfo);

                    return {
                        about_me: influencerInfo.User.about_me,
                        productId: subscription.id,
                        productName: subscription.product.name,
                        price: subscription.product.price,
                        benefits: subscription.product.benefits[0],
                        userId: influencerInfo.user_id,
                        influencerId: influencerInfo.id,
                        influencerProfile: influencerInfo.User.profile_picture,
                        influencerName: influencerInfo.User.username,
                    }
                })
            );

            console.log("mappedData-----------", mappedData);

            return mappedData; //매핑된 최종 데이터 반환
        } catch (err) {
            console.log("매핑에러", err);
            return [];
        }
    }

    //2.룸에 존재하는 influencer만 매핑(최종매핑)
    const fetchMappedRoomData = async (userId: any) => {
        //1.룸정보 가져오기
        const roomReponse = await axios.get('http://localhost:4000/room');
        const rooms = roomReponse.data // room배열

        //2.구독정보 매핑해서 인플정보 가져오기
        const subscriptions = await getMappingSubscribe(userId);

        //3.룸과 구독정보 매핑(룸에 존재하는 influencer만 필터링)
        const filteredData = rooms.
            filter((room: any) => subscriptions.some((sub: any) => {

                return sub.influencerId === room.influencer_id
            }))
            .map((room: any) => {
                const matchingSubscription = subscriptions.find((sub: any) => sub.influencerId === room.influencer_id)

                console.log("matchingSubscription-----", matchingSubscription);

                return {
                    room_name: room.room_name,
                    room_id: room.id,
                    influencer_id: room.influencer_id,
                    visibility_level: room.visibility_level,
                    subscriptionInfo: {
                        about_me: matchingSubscription.about_me,
                        productId: matchingSubscription.productId,
                        productName: matchingSubscription.productName,
                        price: matchingSubscription.price,
                        benefits: matchingSubscription.benefits,
                        influencerProfile: matchingSubscription.influencerProfile,
                        influencerName: matchingSubscription.influencerName,
                    },
                };
            });

        return filteredData;
    }


    //사용자가 구독하고 있는 인플루언루언서의 상품을 가져온다.
    const getSubscriptions = async (userId: string) => {
        try {
            const response = await axios.get(`http://localhost:4000/membership/subscriptions/${userId}`);
            return response.data;

        } catch (err) {
            console.error(err);
        }

    }

    //구독된 인플루언서의 프로필사진과 닉네임을 가져오는 함수
    const getInfluencerInfo = async (influencerId: any) => {
        try {
            const response = await axios.get(`http://localhost:4000/room/influencer/${influencerId}`);
            return response.data;

        } catch (err) {
            console.error("error by getInfinfo", err);
            return alert('error by getInfinfo');
        }
    }

    // 채팅 페이지 이동은 네비게이트를 이용함
    const navigate = useNavigate();

    // 채팅 방에 들어갈때 사용되는 함수 //유저정보를 같이 넘김
    const enterRoom = (infId: string) => {

        navigate(`/chat/${infId}`, { state: { user_id, user_name, user_profile, followings } });
    }

    return (
        <Box sx={{
            flex: 1, display: "flex", flexDirection: "column",
            margin: "0 5%",
            marginTop: "32px",
            // height: "100vh",

        }}>
            <Box
                sx={{
                    padding: "36px",
                    border: "none",
                    borderRadius: "18px",
                    backgroundColor: "white",
                    boxShadow: "rgba(153, 129, 172, 0.3) 0px 7px 29px 0px",
                    minHeight: "81vh"
                }}
            >


                <List>
                    {
                        myRoom.influencer_id ?
                            (
                                <ListItem
                                    alignItems="flex-start"
                                    onClick={() => enterRoom(myRoom.influencer_id)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: '#f7f5ff' },
                                        padding: '16px',
                                        borderRadius: '12px',
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        border: "1px solid #A88EFF"

                                    }}
                                >
                                    <Box display="flex" alignItems="center" width="100%">
                                        <ListItemAvatar>
                                            <Avatar
                                                alt="inflProfile"
                                                src={myRoom.profile_picture}
                                                sx={{ width: 80, height: 80 }}
                                            />
                                        </ListItemAvatar>
                                        <Box flexGrow={1} ml={2}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {myRoom.room_name}
                                                </Typography>
                                                <Chip label="나의 채팅방" color="primary" size="small" />
                                            </Box>
                                            <Typography variant="body2" color="textSecondary">
                                                {myRoom.about_me}
                                            </Typography>

                                        </Box>
                                    </Box>

                                </ListItem>


                            )
                            : null

                    }

                    {rooms.map((room, index) => (
                        <React.Fragment key={index}>

                            <ListItem
                                alignItems="flex-start"
                                onClick={() => enterRoom(room.influencer_id)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: '#f7f5ff' },
                                    padding: '16px',
                                    borderRadius: '12px',
                                    boxShadow: "0 3px 4px rgba(0, 0, 0, 0.1)",
                                    display: 'flex',
                                    flexDirection: 'column',
                                    marginTop: "5%",
                                }}
                            >
                                <Box display="flex" alignItems="center" width="100%" >
                                    <ListItemAvatar>
                                        <Avatar
                                            alt="inflProfile"
                                            src={room.subscriptionInfo.influencerProfile}
                                            sx={{ width: 80, height: 80 }}
                                        />
                                    </ListItemAvatar>
                                    <Box flexGrow={1} ml={2}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {room.subscriptionInfo.influencerName}
                                            </Typography>
                                            <Chip label={room.subscriptionInfo.productName} color="primary" size="small" />

                                        </Box>
                                        <Typography variant="body2" color="textSecondary">
                                            {room.subscriptionInfo.about_me}
                                        </Typography>
                                    </Box>
                                </Box>

                            </ListItem>



                        </React.Fragment>
                    ))}
                </List>

            </Box>
        </Box>
    );
};

export default RoomForm;