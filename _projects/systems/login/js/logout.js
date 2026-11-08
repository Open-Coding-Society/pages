// Signs out of Flask, and of Spring on a site that has it. Callers pass the page's session
// (createSession from session.js), since this script is published apart from it.
export async function handleLogout(session) {
    await session.signOut();
}
