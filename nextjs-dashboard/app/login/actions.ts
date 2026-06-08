'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function authenticate(
    prevState: any,
    formData: FormData
) {
    // Safety fallback: detect the actual FormData regardless of argument position
    const data = (formData && typeof formData.get === 'function') ? formData : prevState;

    const extractedUsername = data.get('username') as string;
    const extractedPassword = data.get('password') as string;

    // --- Dual-Auth: Route to the correct backend based on username ---
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const isAdmin = extractedUsername === adminUsername;

    let shouldRedirect = false;

    try {
        let response: Response;

        if (isAdmin) {
            // Legacy Basekamp API — form-urlencoded
            console.log("🔑 Admin detected → routing to Basekamp API");
            response = await fetch(`${process.env.BASEKAMP_API_URL}/admin/auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    username: extractedUsername,
                    password: extractedPassword,
                }).toString(),
            });
        } else {
            // Local Express API — JSON
            console.log("🔑 Regular user → routing to Express API");
            response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: extractedUsername,
                    password: extractedPassword,
                }),
            });
        }

        let responseData;
        try {
            responseData = await response.json();
        } catch (parseError) {
            console.log("Login Error: Non-JSON response", parseError);
            responseData = {};
        }

        if (response.ok) {
            // Standardize the token extraction from either API shape
            // Basekamp returns: { data: { token } }
            // Express  returns: { token }
            const token = isAdmin
                ? responseData.data?.token
                : responseData.token;

            if (token) {
                console.log("✅ Login Successful! Setting cookie...");
                const cookieStore = await cookies();
                cookieStore.set('basekamp_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: 60 * 60, // 1 hour expiration
                });
                shouldRedirect = true;
            } else {
                return { message: "Login succeeded but no token was returned." };
            }

        } else {
            // Standardize the error message from either API shape
            const errorMsg = isAdmin
                ? (responseData.message?.en || "Invalid admin credentials.")
                : (responseData.message || responseData.error || "Invalid username or password.");
            console.log("Login Error State:", errorMsg);
            return { message: errorMsg };
        }

    } catch (error) {
        console.error("🔥 Network Error:", error);
        return { message: "Failed to connect to the server." };
    }

    // Redirect OUTSIDE of the try/catch block (Next.js redirect throws internally)
    if (shouldRedirect) {
        redirect('/dashboard');
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('basekamp_token');
    redirect('/login');
}