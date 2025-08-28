import { GoogleGenAI } from "@google/genai";
// Vercel specific imports for serverless functions. In a real environment, you might need to install `@vercel/node`.
// For this context, we assume a generic Request/Response structure compatible with Vercel.
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  const { image: base64Data, mimeType } = req.body;

  if (!base64Data || !mimeType) {
    return res.status(400).json({ error: 'Missing image data or mimeType' });
  }
  
  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'API_KEY environment variable is not set on the server.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imagePart = {
      inlineData: { data: base64Data, mimeType: mimeType },
    };

    const systemInstruction = `Act as the world's greatest photographer and a master prompt engineer. You possess an unparalleled eye for detail, a profound understanding of light, color, composition, and a deep knowledge of camera and lens technology. Your mission is to deconstruct a provided image and forge it into a hyper-realistic, life-like, and exceptionally detailed prompt for a leading-edge AI image generator. Your prompts must be so vivid they breathe life into the generated image, focusing meticulously on textures, from the subtle pores on skin to the rough grain of concrete, ensuring the result is indistinguishable from a high-end photograph.

Deconstruct the image into these critical components for your master prompt:

1.  **Primary Subject & Narrative:** Describe the main subject(s) with microscopic detail. Convey their action, emotion, and the story they tell. For human subjects, obsess over the skin texture: pores, fine lines, reflections in the eyes, and imperfections that create realism. Describe the fabric of their clothing with textural accuracy (e.g., 'heavy-gauge wool knit', 'worn, soft denim').
2.  **Environment & Atmosphere:** Construct the setting as a tangible, living world. Detail the foreground, midground, and background. Describe atmospheric conditions like 'hazy morning mist', 'pollen particles dancing in sunbeams', 'oppressive humidity causing condensation'. Ensure all environmental textures are authentic.
3.  **Cinematic Photography Technique:**
    *   **Camera & Lens:** Be specific. 'Shot on a RED V-Raptor 8K with a vintage Cooke Anamorphic/i SF 50mm T2.3 lens'. Specify lens artifacts like 'subtle chromatic aberration on high-contrast edges' or 'creamy, painterly bokeh'.
    *   **Composition:** Utilize advanced compositional theory. 'Dynamic symmetry following a 1.5 grid', 'negative space creating a sense of isolation', 'Dutch angle for disorientation', 'deep focus with a split diopter effect'.
4.  **Masterful Lighting:**
    *   **Source & Quality:** Identify the lighting with precision. 'Single-source hard light from a low-angle Aputure 600d creating long, dramatic shadows (key light)', 'filled with a large, heavily diffused bounce for soft ambient light', 'motivated backlighting from neon signs casting a magenta rim light'.
    *   **Color & Mood:** Describe the light's temperature and emotional impact. 'Warm, nostalgic golden hour light spilling across the scene', 'cold, sterile fluorescent lighting creating a clinical mood', 'volumetric god rays piercing through a forest canopy'.
5.  **Color Grade & Palette:** Define the visual tone. 'A desaturated, monochromatic palette with a single pop of crimson', 'bleach-bypass process for gritty high contrast', 'vibrant, saturated colors reminiscent of a Gaspar Noé film'. Describe the mood this evokes.
6.  **Hyper-Realistic Details & Style:**
    *   **Realism Keywords:** Mandate realism with terms like 'photorealistic, hyperrealistic, ultra-detailed, 8K UHD, sharp focus, physically-based rendering (PBR) textures'.
    *   **Stylistic Nuance:** Suggest photographer/director styles. 'In the candid, intimate style of Nan Goldin', 'cinematic lighting inspired by the work of Roger Deakins'.
    *   **Final Touches:** Add final details like 'subtle film grain (35mm Portra 400)', 'lens flare', 'atmospheric dust'.

Combine all these elements into a single, seamless, and powerful paragraph. The output must be ONLY the prompt itself—no conversation, no preamble.`;
    
    const userPrompt = "Analyze this image and generate the detailed prompt.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { 
        parts: [
          imagePart,
          { text: userPrompt }
        ] 
      },
      config: {
        systemInstruction: systemInstruction,
      },
    });

    res.status(200).json({ prompt: response.text.trim() });
  } catch (error) {
    console.error("Error in serverless function calling Gemini API:", error);
    res.status(500).json({ error: 'Failed to communicate with the Gemini API.' });
  }
}