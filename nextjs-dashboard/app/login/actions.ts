'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function authenticate(formData: FormData) {
    const extractedUsername = formData.get('username') as string;
    const extractedPassword = formData.get('password') as string;
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

        const responseData = await response.json();

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
            console.log("🚨 Login Failed:", responseData.message?.en);
            return;
        }

    } catch (error) {
        console.error("🔥 Network Error:", error);
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