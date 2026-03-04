import { useAuth } from '../../context/AuthContext';
import OTPLogin from '../../components/auth/OTPLogin';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLoginSuccess = (mobile: string, role: string, token: string) => {
        // Log the user into Context with their determined role and token
        login(role as any, mobile, token);

        // Route them to the appropriate dashboard
        const redirectMap: Record<string, string> = {
            admin: '/admin',
            technician: '/technician',
            customer: '/customer',
        };
        navigate(redirectMap[role] || '/', { replace: true });
    };

    return (
        <OTPLogin onLoginSuccess={handleLoginSuccess} />
    );
};

export default Login;
