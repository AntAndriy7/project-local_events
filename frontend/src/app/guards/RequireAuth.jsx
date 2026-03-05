import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthed } from "../../features/auth/authStorage";

export default function RequireAuth() {
    const loc = useLocation();

    if (!isAuthed()) {
        return <Navigate to="/" replace state={{ openLogin: true, from: loc.pathname }} />;
    }

    return <Outlet />;
}
