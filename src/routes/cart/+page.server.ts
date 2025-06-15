import { firebaseAdmin } from '$lib/Firebase/firebase.server.js';
import { redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';
import {QdrantClient} from '@qdrant/js-client-rest';
import { QdrantVectorStore } from '@llamaindex/qdrant';
import z from 'zod';
import { Document, Settings, storageContextFromDefaults, VectorStoreIndex, type ChatMessage } from "llamaindex";
import { type ContentListUnion, type GenerateContentConfig, GoogleGenAI, Type } from '@google/genai';
import { Gemini, GEMINI_EMBEDDING_MODEL, GEMINI_MODEL, GeminiEmbedding } from "@llamaindex/google";
import dotenv from "dotenv";
import { agent } from "@llamaindex/workflow";
import { QDRANT_KEY, QDRANT_URL } from '$env/static/private';

dotenv.config();

export async function load({ url }) {
    // Check if there's already a session ID in the URL
    const currentSessionId = url.searchParams.get('sessionId');

    if (!currentSessionId) {
        throw redirect(303, `/`);
    } 

    // If there is a session ID, fetch the session data
    const db = firebaseAdmin.getFirestore();
    const sessionRef = db.collection('sessions').doc(currentSessionId);
    const sessionDoc = await sessionRef.get();

    // Get the session data
    const sessionData = sessionDoc.data();
    const interactions = sessionData?.interactions || [];

    console.log(sessionData?.cart);

    // Get cart items from the session data, defaulting to empty array if not found
    const cartItems = sessionData?.cart ?? [];

    // Fetch all menu items
    const menuSnapshot = await db.collection('menu').get();
    const allMenuItems = menuSnapshot.docs
        .filter((doc: { id: string; }) => doc.id !== 'info')
        .map(doc => ({
            id: doc.id,
            ...doc.data() as {
                category: string,
                price: number,
                title: string,
                image_url: string,
                description: string,
            },
        }));

    // All categories in the menu
    const menuInfo = await db.collection('menu').doc('info').get();
    const categories = menuInfo.exists ? (menuInfo.data()?.categories || []) : [];

    // Group menu items by category for better organization
    const menuItemsByCategory = categories.map((category: string) => ({
        name: category,
        items: allMenuItems.filter(item => item.category === category)
    }));

    // Keep the full menu items list as well
    const menuItems = allMenuItems;

    // If we already ahave a session ID, just return it
    return {
        categories: menuItemsByCategory,
        items: menuItems,
        cart: cartItems,
        sessionId: currentSessionId,
    }
}

