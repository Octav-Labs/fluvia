import { NextApiRequest, NextApiResponse } from "next";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:3005";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get the access token from cookies
    const accessToken = req.cookies["privy-token"];

    if (!accessToken) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No access token found in cookies",
      });
    }

    // Call the backend API
    const backendResponse = await fetch(`${BACKEND_API_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return res.status(backendResponse.status).json({
        error: "Backend request failed",
        message: errorData.message || "Failed to fetch user data",
        status: backendResponse.status,
      });
    }

    const userData = await backendResponse.json();

    // Return the user data
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error in /api/fluvia/me:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch user data",
    });
  }
}
