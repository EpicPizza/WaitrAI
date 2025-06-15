import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { firebaseAdmin } from '$lib/Firebase/firebase.server';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const item = await request.json();

        // Extract currentSessionId from URL query parameters
        const url = new URL(request.url);
        const currentSessionId = url.searchParams.get('sessionId');

        if (!currentSessionId) {
            return json({ success: false, message: 'Session ID is required' }, { status: 400 });
        }

        const db = firebaseAdmin.getFirestore();
        const sessionRef = db.collection('sessions').doc(currentSessionId);
        const sessionDoc = await sessionRef.get();
    
        // Get the session data
        const sessionData = sessionDoc.data();

        // Check if session exists
        if (!sessionDoc.exists) {
            return json({ success: false, message: 'Session not found' }, { status: 404 });
        }

        // Check if cart exists in session, if not create it
        if (!sessionData?.cart) {
            await sessionRef.update({
                cart: []
            });
        }
        
        // Validate required fields
        if (!item.productId || !item.quantity) {
            return json({ success: false, message: 'Product ID and quantity are required' }, { status: 400 });
        }

        // Check if the product exists in the menu collection
        const menuRef = db.collection('menu').doc(item.productId);
        const menuItem = await menuRef.get();

        if (!menuItem.exists) {
            return json({ success: false, message: 'Product not found in menu' }, { status: 404 });
        }

        // Product exists, add to cart
        const productData = menuItem.data();
        const cartItem = {
            id: item.productId,
            quantity: item.quantity,
            title: productData?.title,
            price: productData?.price,
            // Add any other relevant product details
        };

        // Update the cart in the session document
        await sessionRef.update({
            cart: FieldValue.arrayUnion(cartItem)
        });

        
        // Here you would typically:
        // 1. Check if the product exists in your database
        // 2. Verify product availability/inventory
        // 3. Add the item to the user's cart in your database or session
        
        // For now, we'll just return the item as if it was added
        return json({
            success: true,
            message: 'Item added to cart',
            item
        }, { status: 200 });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return json({ 
            success: false, 
            message: 'Failed to add item to cart' 
        }, { status: 500 });
    }
};