const API_URL = "http://localhost:8000/api";

export async function uploadPDF(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Upload failed");
    }

    return response.json();
}

export async function generateSummary(fileId: string, mode: string) {
    // Note: In a real app, use Server-Sent Events (SSE) or streaming for progress.
    // For MVP, we wait for the response (could take time).
    const response = await fetch(`${API_URL}/summarize?file_id=${fileId}&mode=${mode}`, {
        method: "POST",
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Summarization failed");
    }

    return response.json();
}
