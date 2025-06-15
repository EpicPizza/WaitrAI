import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    // Check if the 'finish' parameter exists in the search params
    const finishParam = url.searchParams.get('finish');
    
    if (finishParam !== null) {
        // Redirect to the root path if 'finish' parameter exists
        throw redirect(303, '/');
    }
    
    // Continue with normal loading if 'finish' parameter doesn't exist
    return {};
};