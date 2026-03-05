import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "../pages/Home/HomePage";
import EventDetailsPage from "../pages/EventDetails/EventDetailsPage";
import CreateEventPage from "../pages/CreateEvent/CreateEventPage";
import MyEventsPage from "../pages/MyEvents/MyEventsPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AdminEventsPage from "../pages/Admin/AdminEventsPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

import RequireAuth from "./guards/RequireAuth";
import RequireRole from "./guards/RequireRole";

export const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <NotFoundPage />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/events/:id", element: <EventDetailsPage /> },

            {
                element: <RequireAuth />,
                children: [
                    { path: "/create", element: <CreateEventPage /> },
                    { path: "/my-events", element: <MyEventsPage /> },
                    { path: "/profile", element: <ProfilePage /> },
                ],
            },

            {
                element: <RequireRole role="ADMIN" />,
                children: [
                    { path: "/admin", element: <AdminEventsPage /> },
                ],
            },
        ],
    },
]);
