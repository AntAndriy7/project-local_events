import { useCallback, useEffect, useState } from "react";
import { fetchUser, updateUser, changeUserPassword } from "../api/usersApi";
import { getUser, setAuth, getToken } from "../../auth/authStorage";

export function useProfile() {
    const token = getToken();
    const cachedUser = getUser();

    const [user, setUser] = useState(cachedUser);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reload = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const fresh = await fetchUser();
            setUser(fresh);
            setAuth({ token, user: fresh });
        } catch (e) {
            setError(e.message || "Помилка завантаження профілю");
        } finally {
            setLoading(false);
        }
    }, [token]);

    const update = async (formData) => {
        try {
            const updated = await updateUser(formData);
            setUser(updated);
            if (token) setAuth({ token, user: updated });
            return { success: true };
        } catch (e) {
            console.error("Update failed:", e);
            return { success: false, error: e.message };
        }
    };

    const changePassword = async (passwords) => {
        try {
            await changeUserPassword(passwords);
            return { success: true };
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    useEffect(() => { reload(); }, [reload]);

    return { user, loading, error, reload, update, changePassword };
}