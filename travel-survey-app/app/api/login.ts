import type { NextApiRequest, NextApiResponse } from "next";

interface LoginRequest {
  email: string;
  password: string;
  packageId: string | null;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    email: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  // Ensure the request is POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, password, packageId }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Mock user validation (replace with real authentication, e.g., Firebase, Supabase, or database)
    // For demo purposes, accept any email/password and validate packageId
    const validPackageIds = ["basic", "premium", "luxury"];
    if (packageId && !validPackageIds.includes(packageId)) {
      return res.status(400).json({ success: false, message: "Invalid package ID" });
    }

    // Simulate successful login
    return res.status(200).json({
      success: true,
      user: { email },
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}