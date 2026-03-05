import { useState, useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import LoginModal from "../features/auth/components/LoginModal";
import RegisterModal from "../features/auth/components/RegisterModal";

export default function Layout() {
    const [modalType, setModalType] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.openLogin) {
            const timer = setTimeout(() => {
                setModalType("login");

                const newState = { ...location.state };
                delete newState.openLogin;
                navigate(location.pathname, { replace: true, state: newState });
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [location.state, location.pathname, navigate]);

    const closeModals = () => setModalType(null);

    return (
        <>
            <Header
                onOpenLogin={() => setModalType("login")}
                onOpenRegister={() => setModalType("register")}
            />
            <Outlet />
            <Footer />
            <ScrollRestoration />

            {modalType === "login" && (
                <LoginModal
                    onClose={closeModals}
                    onSwitchToRegister={() => setModalType("register")}
                />
            )}

            {modalType === "register" && (
                <RegisterModal
                    onClose={closeModals}
                    onSwitchToLogin={() => setModalType("login")}
                />
            )}
        </>
    );
}
