import { useLocation, useNavigate } from "react-router-dom";
import { isAuthed } from "../../features/auth/authStorage.js";

export default function ProtectedButton({ children, onClick, ...props }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (!isAuthed()) {
            e.preventDefault();
            e.stopPropagation();

            navigate(location.pathname, {
                replace: true,
                state: { openLogin: true }
            });
            return;
        }

        if (onClick) onClick(e);
    };

    return (
        <button onClick={handleClick} {...props}>
            {children}
        </button>
    );
}