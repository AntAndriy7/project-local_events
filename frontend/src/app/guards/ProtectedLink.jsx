import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAuthed } from "../../features/auth/authStorage.js";

export default function ProtectedLink({ to, children, onClick, ...props }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (onClick) onClick(e);

        if (!isAuthed()) {
            e.preventDefault();

            navigate(location.pathname, {
                replace: true,
                state: { openLogin: true, from: to }
            });
        }
    };

    return (
        <Link to={to} onClick={handleClick} {...props}>
            {children}
        </Link>
    );
}
