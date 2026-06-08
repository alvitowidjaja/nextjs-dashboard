'use server';

export async function registerUser(
    prevState: any,
    formData: FormData
) {
    // Safety fallback: detect the actual FormData regardless of argument position
    const data = (formData && typeof formData.get === 'function') ? formData : prevState;

    const extractedUsername = data.get('username') as string;
    const extractedPassword = data.get('password') as string;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`;

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
            console.log("✅ Signup Successful!");
            return {
                success: true,
                message: "Account created successfully! Redirecting to login...",
            };

        } else {
            // Handle specific error messages from the backend
            const errorMsg = responseData.message
                || responseData.error
                || "Registration failed. Please try again.";
            console.log("Signup Error State:", errorMsg);
            return { success: false, message: errorMsg };
        }

    } catch (error) {
        console.error("🔥 Network Error:", error);
        return { success: false, message: "Failed to connect to the server. Is the backend running?" };
    }
}

