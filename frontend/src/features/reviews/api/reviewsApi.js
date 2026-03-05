import { http } from "../../../lib/http";

export function updateReview(reviewId, { rating, comment }) {
    return http.put(`/api/reviews/${reviewId}`, { rating, comment }, { auth: true });
}

export function deleteReview(reviewId) {
    return http.del(`/api/reviews/${reviewId}`, { auth: true });
}

export function createReview({ event_id, rating, comment }) {
    return http.post("/api/reviews", { event_id, rating, comment }, { auth: true });
}