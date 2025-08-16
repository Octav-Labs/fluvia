import { NextApiRequest, NextApiResponse } from "next";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3005";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { label, recipientAddress } = req.body;

    // Validate required fields
    if (!label || !recipientAddress) {
      return res.status(400).json({
        error: "Bad Request",
        message: "label and recipientAddress are required",
      });
    }

    // Get access token from cookies
    const accessToken = req.cookies["privy-token"];

    if (!accessToken) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No access token found in cookies",
      });
    }

    // Prepare the request body for the backend
    const backendBody = {
      recipientAddress,
      label: label,
    };

    // Forward request to backend
    const backendResponse = await fetch(`${BACKEND_API_URL}/fluvias`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendBody),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return res.status(backendResponse.status).json({
        error: "Backend request failed",
        message: errorData.message || "Failed to create Fluvia",
        code: errorData.code,
        suggestion: errorData.suggestion,
      });
    }

    const data = await backendResponse.json();
    res.status(201).json(data);
  } catch (error) {
    console.error("Error in /api/fluvias/create:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to create Fluvia",
    });
  }
}
