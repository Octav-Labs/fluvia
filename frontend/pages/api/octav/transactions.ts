import { NextApiRequest, NextApiResponse } from "next";

const OCTAV_API_BASE_URL = "https://api.octav.fi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      addresses,
      limit = "50",
      offset = "0",
      initialSearchText,
      interactingAddresses,
      networks,
      txTypes,
      protocols,
      hideSpam = "true",
      sort = "DESC",
      tokenId,
      startDate,
      endDate,
    } = req.query;

    // Validate required parameters
    if (!addresses) {
      return res.status(400).json({
        error: "addresses parameter is required",
      });
    }

    // Build query parameters
    const queryParams = new URLSearchParams();

    // Required parameters
    queryParams.append("addresses", addresses as string);
    queryParams.append("limit", limit as string);
    queryParams.append("offset", offset as string);

    // Optional parameters
    if (initialSearchText) {
      queryParams.append("initialSearchText", initialSearchText as string);
    }
    if (interactingAddresses) {
      queryParams.append(
        "interactingAddresses",
        interactingAddresses as string
      );
    }
    if (networks) {
      queryParams.append("networks", networks as string);
    }
    if (txTypes) {
      queryParams.append("txTypes", txTypes as string);
    }
    if (protocols) {
      queryParams.append("protocols", protocols as string);
    }
    if (hideSpam) {
      queryParams.append("hideSpam", hideSpam as string);
    }
    if (sort) {
      queryParams.append("sort", sort as string);
    }
    if (tokenId) {
      queryParams.append("tokenId", tokenId as string);
    }
    if (startDate) {
      queryParams.append("startDate", startDate as string);
    }
    if (endDate) {
      queryParams.append("endDate", endDate as string);
    }

    // Get API key from environment variable
    const apiKey = process.env.OCTAV_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Octav API key not configured",
      });
    }

    // Make request to Octav API
    const response = await fetch(
      `${OCTAV_API_BASE_URL}/v1/transactions?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response?.ok) {
      const errorText = await response.text();
      console.error("Octav API error:", response.status, errorText);
      return res.status(response.status).json({
        error: `Octav API error: ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();

    // Return the transactions data
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
