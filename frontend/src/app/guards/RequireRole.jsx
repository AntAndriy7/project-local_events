import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getUser } from "../../features/auth/authStorage";

export default function RequireRole({ role }) {
    const loc = useLocation();
    const user = getUser();

    if (!user) {
        return <Navigate to="/" replace state={{ openLogin: true, from: loc.pathname }} />;
    }

    if (user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
