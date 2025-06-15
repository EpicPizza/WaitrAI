import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
    await locals.getUser();

    const currentSessionId = url.searchParams.get('sessionId');

    return {
        preload: locals.user,
        sessionId: currentSessionId,
    }
}

