import Layout from "../components/common/Layout";
import LoginPage from "../components/Auth/LoginForm";
import Register from "../components/Auth/Register";
import SocialLoginCallback from "../page/SocialLoginCallback";
import Main from "../page/Main";
import Write from "../page/Write";
import MyPage from "../page/MyPage";
import LikeList from "../components/MyPage/LikeList";
import FollowList from "../components/MyPage/FollowList";
import FeedList from "../components/MyPage/FeedList";
import Room from "../page/Room";
import NewChat from "../page/Chat";

import PaymentSuccess from '../components/Payment/PaymentSuccess';
import PaymentFail from '../components/Payment/PaymentFail';
import Payment from '../page/Payment';
import ManageMembership from '../components/MyPage/Membership/ManageMembership';
import Notification from '../page/NotificationPage';
import PrivateRoute from '../components/common/PrivateRoute';
import SearchPage from '../page/SearchPage';
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: "/", element: <Main />, index: true },
      { path: "/write", element: <Write />, index: true },
      { path: "/search", element: <SearchPage />, index: true },
      { path: "/room", element: <Room />, index: true },
      { path: "/chat/:roomId", element: <NewChat />, index: true },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <Register /> },
      { path: "/login/callback", element: <SocialLoginCallback /> },
      { path: "/update/:id", element: <Write />, index: true },
      { path: "/noti", element: <Notification /> },

      {
        path: '/mypage',
        element: (
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        ),
        children: [
          { path: ':userId/likes', element: <LikeList /> },
          { path: ':userId/follows', element: <FollowList /> },
          { path: ':userId/membership/manage', element: <ManageMembership /> },
          { path: ':userId/feeds', element: <FeedList /> },
          { path: ':userId/likes', element: <LikeList /> },
          { path: ':userId/follows', element: <FollowList /> },
          { path: ':userId/feeds', element: <FeedList /> },
          // {
          //   path: ':userId/membership',
          //   element: <MembershipTab />,
          // },
          { path: ':userId/membership/manage', element: <ManageMembership /> },
          { path: ':userId/feeds', element: <FeedList /> },
        ],
      },
      { path: '/payment', element: <Payment /> },
      { path: '/payment/success', element: <PaymentSuccess /> }, // 결제 성공 페이지
      { path: '/payment/fail', element: <PaymentFail /> }, // 결제 실패 페이지
    ],
  },
];
