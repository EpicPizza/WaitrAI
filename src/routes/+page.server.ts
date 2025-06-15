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

 if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Please set the GOOGLE_API_KEY environment variable.");
}


const embedModel = new GeminiEmbedding({
    model: GEMINI_EMBEDDING_MODEL.EMBEDDING_001,
});

Settings.embedModel = embedModel;

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
});

const gemini = new Gemini({
    model: GEMINI_MODEL.GEMINI_2_0_FLASH,
});

Settings.llm = gemini;

const Keywords = z.object({
    keywords: z.string().array(),
    categories: z.string().array(),
});

const DatabaseEntry = z.object({
    title: z.string(),
    description: z.string(),
    ingredients: z.string().array(),
    calories: z.string(),
    health_information: z.string(),
    price: z.string(),
    category: z.string(),
    image_url: z.string(),
});

export async function load({ url }) {
    // Check if there's already a session ID in the URL
    const currentSessionId = url.searchParams.get('sessionId');

    if (!currentSessionId) {
        // Generate a new random session ID
        const sessionId = randomUUID();

        const db = firebaseAdmin.getFirestore();

        // Create a new session document in Firestore
        const sessionRef = db.collection('sessions').doc(sessionId);
        await sessionRef.set({
            createdAt: new Date().valueOf(),
            status: 'new',
            interactions: []
        });
        
        // Redirect to the same page but with the session ID in search params
        throw redirect(303, `${url.pathname}?sessionId=${sessionId}`);
    } 

    // If there is a session ID, fetch the session data
    const db = firebaseAdmin.getFirestore();
    const sessionRef = db.collection('sessions').doc(currentSessionId);
    const sessionDoc = await sessionRef.get();

    // Get the session data
    const sessionData = sessionDoc.data();
    const interactions = sessionData?.interactions || [];

    // Fetch all menu items
    const menuSnapshot = await db.collection('menu').get();
    const allMenuItems = menuSnapshot.docs
        .filter(doc => doc.id !== 'info')
        .map(doc => ({
            id: doc.id,
            ...doc.data() as {
                category: string,

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
        sessionId: currentSessionId,
        interactions: interactions,
        currentInteraction: {
            status: (async () => {
                // Check if we have any interactions
                // Exit early if we don't have interactions or last one wasn't from user
                if (interactions.length === 0) {
                    console.log("No interactions yet");
                    return "no_interactions";
                }
                
                // Get the most recent interaction
                const lastInteraction = interactions[interactions.length - 1];
                
                // Check if it's NOT from the user
                if (lastInteraction.type !== 'user') {
                    console.log("Last interaction was not from user");
                    return "last_interaction_not_from_user";
                }
                
                const input = lastInteraction.content;

                const db = firebaseAdmin.getFirestore();

                const categories = (await db.collection('menu').doc('info').get()).data()?.categories as string[];

                const docs = (await db.collection('menu').get()).docs.filter(doc => doc.id != "info");
                
                const items = docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as (z.infer<typeof DatabaseEntry> & { id: string })[];

                // Group items by category
                const itemsByCategory = categories.reduce((acc, category) => {
                    acc[category] = items.filter(item => item.category === category);
                    return acc;
                }, {} as Record<string, (z.infer<typeof DatabaseEntry> & { id: string })[]>);

                // Log each category and its items count
                console.log("Items grouped by category:");
                for (const category in itemsByCategory) {
                    console.log(`${category}: ${itemsByCategory[category].length} items`);
                }

                // Items without a matching category
                const uncategorizedItems = items.filter(item => !categories.includes(item.category));
                if (uncategorizedItems.length > 0) {
                    console.log(`Uncategorized items: ${uncategorizedItems.length}`);
                }

                // Generate descriptions for each category
                const categoryDescriptions = await Promise.all(categories.map(async (category) => {
                    return {
                        category,
                        title: category,
                        description: "Menu items in this category.",
                        items: itemsByCategory[category],
                    };
                }));


                console.log("Category descriptions generated and stored:");
                console.log(categoryDescriptions);
            
                const client = new QdrantClient({
                    url: QDRANT_URL,
                    apiKey: QDRANT_KEY,
                });

                // Create vector store indices for each category
                console.log("Creating vector store indices for each category...");

                // Create document objects from menu items
                const categoryIndices: Record<string, any> = {};

                const collectionNames = (await client.getCollections()).collections.map((collection) => collection.name);

                for (const category of categories) {
                    const categoryItems = itemsByCategory[category];

                    // Check if collection already exists for this category
                    const collectionName = `category_${category}`;
                    if (collectionNames.includes(collectionName)) {
                        try {
                            // Try to fetch existing index if it's already been created
                            const vectorStore = new QdrantVectorStore({
                                client: client,
                                collectionName: collectionName,
                            });
                            
                            const storageContext = await storageContextFromDefaults({
                                vectorStore
                            });
                            
                            const categoryIndex = await VectorStoreIndex.fromVectorStore(vectorStore);
                            categoryIndices[category] = categoryIndex;
                            console.log(`Fetched existing index for ${category}`);

                            continue;
                        } catch (error) {
                            console.error(`Error fetching index for ${category}:`, error);
                        }
                
                    } else {
                        console.log(`No items found for category: ${category}, skipping index creation`);
                    }
                }

                // Create a general index for all menu items
                console.log("Creating general menu index...");

                // Create documents from menu items for the general index
                const menuDocuments = items.map(item => {
                    const content = `${item.title}\nCategory: ${item.category}\nID: ${item.id}`;
                    
                    return new Document({
                        text: content,
                        metadata: {
                            id: item.id,
                            title: item.title,
                            category: item.category
                        }
                    });
                });

                console.log(menuDocuments);

                // Create tools for each category
                const searchTools = Object.entries(categoryIndices).map(([category, index]) => {
                    return index.queryTool({
                        metadata: {
                            name: `search_${category}_items`,
                            description: `Search for menu items in the ${category} category. Use this when the user asks about ${category} items or products.`,
                        },
                        options: { similarityTopK: 10 },
                    })
                });

                console.log(searchTools);



                const menuAgent = agent({
                    llm: gemini,
                    tools: searchTools,
                    description: "I can help you find items on the menu across different categories",
                });

                // Example of using the agent
                    console.log("Creating menu search agent...");
                    // Prepare chat history from previous interactions
                    const chatHistory = [
                        {
                            role: "system",
                            content: `You are a helpful menu assistant for a restaurant. Your job is to help customers find items on the menu based on their preferences and queries.

                    When responding to user queries:
                    1. Be friendly, concise, and helpful
                    2. Recommend specific items from the menu that match their criteria
                    3. Provide brief descriptions of recommended items including price and calories when available
                    4. Group recommendations by category when appropriate
                    5. If there are no matches, suggest alternative items`
                        }
                    ] satisfies ChatMessage[];
                    
                    // Add previous interactions to chat history if available
                    if (interactions.length > 0) {
                        // Convert previous interactions to the format expected by the agent
                        const previousMessages = interactions.map((interaction: { type: string; content: any; }) => ({
                            role: interaction.type === 'user' ? "user" : "assistant",
                            content: interaction.content
                        } satisfies ChatMessage));
                        
                        // Add all previous interactions except the most recent user message
                        chatHistory.push(...previousMessages.slice(0, -1));
                    }

                    const response = await menuAgent.run(input, { chatHistory: chatHistory   });
                    console.log("Agent response:", response.data.result);
                    // Create a separate agent using only the generalMenuSearchTool

                    const ResponseSchema = z.object({
                        entries: z.array(
                            z.object({
                                id: z.string(),
                                title: z.string()
                            })
                        )
                    });

                    const config = {
                        responseMimeType: 'application/json',
                        responseSchema: {
                            "type": Type.OBJECT,
                            "properties": {
                                "entries": {
                                    "type": Type.ARRAY,
                                    "items": {
                                        "type": Type.OBJECT,
                                        "properties": {
                                            "id": {
                                                "type": Type.STRING
                                            },
                                            "title": {
                                                "type": Type.STRING
                                            }
                                        },
                                        "required": [ "id", "title" ]
                                    }
                                }
                            }
                        }
                    } satisfies GenerateContentConfig;

                    const model = 'gemini-2.0-flash';

                    const contents = [
                            {
                                role: "assistant",
                                parts: [{ text: "You are a menu matching assistant. Your job is to identify menu items mentioned in a response and match them with their corresponding IDs from our database."
                            }]},
                            {
                                role: "user",
                                parts: [{ text: `Here is a list of all menu items with their IDs:\n${menuDocuments.map(doc => 
                                    `ID: ${doc.metadata.id}, Title: ${doc.metadata.title}, Category: ${doc.metadata.category}`
                                ).join('\n')}\n\nPlease analyze this previous response and identify which menu items were mentioned. Match them with their correct IDs:\n${response.data.result}`
                                }]}
                        ] satisfies ContentListUnion;
                    
                    const finalResult = await ai.models.generateContent({
                        config,
                        model,
                        contents
                    });
                        
                    const ids = ResponseSchema.parse(JSON.parse(finalResult.text ?? ""));

                    // Fetch complete menu items data for the identified menu items
                    const menuItems = await Promise.all(ids.entries.map(async (entry) => {
                        const docRef = db.collection('menu').doc(entry.id);
                        const docSnap = await docRef.get();
                        
                        if (docSnap.exists) {
                            return {
                                id: entry.id,
                                ...docSnap.data()
                            };
                        } else {
                            console.log(`Menu item with ID ${entry.id} not found`);
                            return null;
                        }
                    }));

                    const validMenuItems = menuItems.filter(item => item !== null);

                    // Update the session document with new assistant interaction
                    await sessionRef.update({
                        interactions: FieldValue.arrayUnion({
                            type: 'assistant',
                            content: response.data.result,
                            timestamp: new Date().valueOf(),
                            menuItems: validMenuItems
                        })
                    });

                    // Log the interaction
                    console.log("Added assistant interaction to database");

                    return {
                        items: validMenuItems,
                        response: response.data.result
                    };
            })()
        }
    };
}

/**
 * Creates a promise that resolves after a specified delay
 * @param ms Time to wait in milliseconds
 * @returns Promise that resolves after the specified delay
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}