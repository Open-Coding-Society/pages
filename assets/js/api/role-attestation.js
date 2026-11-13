// Spring cannot see which mentors a Teacher or Admin has verified: that is kept in Flask. At login Flask signs a
// short statement about the account (login response field `role_attestation`) and Spring gives the person the role,
// or takes it away, when it is handed the statement. Spring checks the signature, so nothing here is trusted.

// Hand Flask's statement to Spring. Resolves to { sent, ok, status }; never throws, so a failure here cannot stop
// the login: the person just keeps the roles they had.
export async function confirmRoleAttestation(javaURI, fetchOptions, attestation, fetchFn = fetch) {
    if (typeof attestation !== 'string' || attestation === '') {
        return { sent: false, ok: false, status: 0 };  // Flask signed nothing (no shared secret set)
    }
    try {
        const response = await fetchFn(`${javaURI}/api/person/mentor/confirm`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ attestation }),
        });
        if (!response.ok) {
            console.warn('Spring did not accept the role statement from Flask:', response.status);
        }
        return { sent: true, ok: response.ok, status: response.status };
    } catch (error) {
        console.warn('Could not send the role statement to Spring:', error.message);
        return { sent: true, ok: false, status: 0 };
    }
}
