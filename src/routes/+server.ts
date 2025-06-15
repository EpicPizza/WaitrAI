import { firebaseAdmin } from "$lib/Firebase/firebase.server";
import { redirect } from "@sveltejs/kit";
import { FieldValue } from "firebase-admin/firestore";

export async function POST({ request, url }) {
    const data = await request.json();
    const message = data.message || '';
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
        return new Response(JSON.stringify({ success: false, error: 'No session ID found' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (!message.trim()) {
        return new Response(JSON.stringify({ success: false, error: 'Message cannot be empty' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const db = firebaseAdmin.getFirestore();
    const sessionRef = db.collection('sessions').doc(sessionId);

    // Generate a unique ID for the message
    const messageId = crypto.randomUUID();
    
    // Add the user message to the interactions array
    await sessionRef.update({
        interactions: FieldValue.arrayUnion({
            type: 'user',
            content: message,
            timestamp: new Date().valueOf(),
            id: messageId
        })
    });

    // Return success response with the messageId
    return new Response(JSON.stringify({ 
        success: true, 
        messageId: messageId 
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}