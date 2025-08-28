export const generatePromptFromImage = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Data,
        mimeType: mimeType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.prompt;
  } catch (error) {
    console.error("Error communicating with the backend service:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate prompt: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
};
