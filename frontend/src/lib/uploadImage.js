import { fetchImageSignature } from "../features/events/api/eventsApi";

export async function uploadToCloudinary(file) {
    const signatureData = await fetchImageSignature();

    if (!signatureData || !signatureData.signature) {
        throw new Error("Unable to obtain permission to upload photo");
    }

    const { signature, timestamp, folder, apiKey } = signatureData;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/local-events/image/upload",
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error?.message || "Upload failed");
    }

    return data.secure_url;
}