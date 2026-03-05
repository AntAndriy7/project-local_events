export async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "event_images");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/ddnykzohe/image/upload",
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
