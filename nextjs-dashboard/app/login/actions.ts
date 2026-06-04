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
    const apiUrl = `${process.env.BASEKAMP_API_URL}/admin/auth`;

    // 1. We create a flag to track if we should let them in
    let shouldRedirect = false;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: extractedUsername,
                password: extractedPassword,
            }).toString(),
        });

        let responseData;
        try {
            responseData = await response.json();
        } catch (parseError) {
            console.log("Login Error State: Non-JSON response", parseError);
            responseData = {};
        }

        if (response.ok) {
            console.log("✅ Login Successful! Setting cookies...");
            const token = responseData.data.token;

            if (token) {
                const cookieStore = await cookies();
                cookieStore.set('basekamp_token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                });
            }

            // 2. Flip the flag to true instead of redirecting right now
            shouldRedirect = true;

        } else {
            const errorMsg = responseData.message?.en || "Invalid username or password. Please try again.";
            console.log("Login Error State:", errorMsg);
            return { message: errorMsg };
        }

    } catch (error) {
        console.error("🔥 Network Error:", error);
        return { message: "Failed to connect to the server." };
    }

    // 3. Teleport OUTSIDE of the try/catch block!
    if (shouldRedirect) {
        redirect('/dashboard');
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('basekamp_token');
    redirect('/login');
}