import { useEffect } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { logout } from '../api/requests/authApi';

const Login = () => {
  return (
    <div>
      <LoginForm/>
    </div>
  );
};

export default Login;
