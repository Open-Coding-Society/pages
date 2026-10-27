// A student whose verification has lapsed verifies again with school Google sign-in.
// Flask's login response says when (user.verification_required) and who does it
// (user.verified_by_google: Google for students, a Teacher or Admin for everyone else).

export function reverifyNeeded(loginBody) {
    const user = loginBody && loginBody.user;
    return Boolean(user && user.verification_required && user.verified_by_google);
}

export function staffMustVerify(loginBody) {
    const user = loginBody && loginBody.user;
    return Boolean(user && user.verification_required && !user.verified_by_google);
}

// Send the Google ID token to Flask, which checks it. Resolves to { ok, message }; never throws.
export async function reverify(pythonURI, fetchOptions, idToken) {
    try {
        const response = await fetch(`${pythonURI}/api/user/reverify`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ idToken }),
        });
        const body = await response.json().catch(() => ({}));
        // 409 means no verification is due: already verified, for example from another tab
        return { ok: response.ok || response.status === 409, message: body.message || `Verification failed (${response.status})` };
    } catch (error) {
        return { ok: false, message: 'Could not reach the server. Please try again.' };
    }
}
