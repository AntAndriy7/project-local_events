import { http } from "../../../lib/http";

export function updateReview(reviewId, { rating, comment }) {
    return http.put(`/api/reviews/${reviewId}`, { rating, comment }, { auth: true });
}

export function deleteReview(reviewId) {
    return http.del(`/api/reviews/${reviewId}`, { auth: true });
}

export function createReview({ eventId, rating, comment, parentId, replyToId }) {
    return http.post("/api/reviews", { eventId, rating, comment, parentId, replyToId }, { auth: true });
}