import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavBar from './NavBar';
import userImg from '../../assets/userIcon.png';

const NavBarWrapper = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout, user } = useAuth();
    
    // Función para manejar el cambio de sección
    const handleSectionChange = (section: string) => {
        console.log('🎯 NavBarWrapper - Cambiar a sección:', section);
        
        switch (section) {
            case 'messages':
                navigate('/messages');
                break;
            case 'dashboard':
                navigate('/dashboard');
                break;
            case 'home':
                navigate('/home');
                break;
            default:
                console.log(`Sección no manejada: ${section}`);
        }
    };

    const handleSelectConversation = (conversationId: number) => {
        if (conversationId > 0) {
            navigate(`/messages?conversationId=${conversationId}`);
        } else {
            navigate('/messages');
        }
    };

    const navLinks = isLoggedIn 
    ? [
        {
            label: "Inicio",
            url: "/home"
        },
        {
            label: "Dashboard",
            url: "/dashboard"
        },
        {
            label: "Cerrar Sesión",
            url: "/",
            onClick: (e?: React.MouseEvent) => {
                e?.preventDefault();
                logout();
                navigate('/');
            },
        },
    ]: [];

    return (
        <NavBar
            userIcon={userImg}
            links={navLinks}
            onSectionChange={handleSectionChange}
            onSelectConversation={handleSelectConversation}
        />
    );
};

export default NavBarWrapper;