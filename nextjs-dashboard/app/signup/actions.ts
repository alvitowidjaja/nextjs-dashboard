'use server';

import { redirect } from 'next/navigation';

export async function registerUser(
    prevState: any,
    formData: FormData
) {
    // Safety fallback: detect the actual FormData regardless of argument position
    const data = (formData && typeof formData.get === 'function') ? formData : prevState;

    const extractedUsername = data.get('username') as string;
    const extractedPassword = data.get('password') as string;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`;

    // Flag to track if we should redirect (must happen outside try/catch)
    let shouldRedirect = false;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: extractedUsername,
                password: extractedPassword,
            }),
        });

        let responseData;
        try {
            responseData = await response.json();
        } catch (parseError) {
            console.log("Signup Error: Non-JSON response", parseError);
            responseData = {};
        }

        if (response.ok && responseData.success) {
            console.log("✅ Signup Successful! Redirecting to login...");
            shouldRedirect = true;

        } else {
            // Handle specific error messages from the backend
            const errorMsg = responseData.message
                || responseData.error
                || "Registration failed. Please try again.";
            console.log("Signup Error State:", errorMsg);
            return { message: errorMsg };
        }

    } catch (error) {
        console.error("🔥 Network Error:", error);
        return { message: "Failed to connect to the server. Is the backend running?" };
    }

    // Redirect OUTSIDE of the try/catch block (Next.js redirect throws internally)
    if (shouldRedirect) {
        redirect('/login');
    }
}
