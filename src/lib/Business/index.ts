
import { agent } from "@llamaindex/workflow";
import { Document, Settings, storageContextFromDefaults, VectorStoreIndex } from "llamaindex";
import { HuggingFaceEmbedding, HuggingFaceEmbeddingModelType } from "@llamaindex/huggingface";
import { OpenAI } from '@llamaindex/openai';
import { Gemini, GEMINI_EMBEDDING_MODEL, GEMINI_MODEL, GeminiEmbedding } from "@llamaindex/google";
import { z } from 'zod';
import {QdrantClient} from '@qdrant/js-client-rest';
import { QdrantVectorStore } from '@llamaindex/qdrant';
import * as fs from 'fs';
import FirecrawlApp from '@mendable/firecrawl-js';
import dotenv from "dotenv";
import { SimpleDirectoryReader } from "@llamaindex/readers/directory";
import { ContentListUnion, GenerateContentConfig, GoogleGenAI, Type } from '@google/genai';
import admin from 'firebase-admin'
import FirebaseAdmin from 'firebase-admin';
const firebaseAuth = FirebaseAdmin.auth;
import type { Auth, DecodedIdToken, UserRecord } from 'firebase-admin/auth';
import { type Firestore, getFirestore as getFirebaseFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const firebaseAdmin = getFirebaseAdmin();

function getFirebaseAdmin() {
    let app: admin.app.App | undefined = undefined;
    let auth: Auth | undefined = undefined;
    let firestore: Firestore | undefined = undefined;

    const getFirebaseApp = (): admin.app.App => {
        if(app == undefined) { // When using hot reload in dev mode, initializing app may be recalled when it doesn't need to be.
            if(admin.apps == null) {
                app = admin.initializeApp({
                    credential: admin.credential.cert(
                        JSON.parse(process.env.FIREBASE_ADMIN ?? "") as admin.ServiceAccount,
                    ),
                }, "Server");
            } else if(admin.apps.length == 0) {
                app = admin.initializeApp({
                    credential: admin.credential.cert(
                        JSON.parse(process.env.FIREBASE_ADMIN ?? "") as admin.ServiceAccount,
                    ),
                }, "Server");
            } else {
                var found = false;
                for(var i = 0; i < admin.apps.length; i++) {
                    if(admin.apps[i] != null && (admin.apps[i] as admin.app.App).name == "Server") {
                        app = admin.apps[i] as admin.app.App;
                        found = true;
                    }
                }
                if(found == false) {
                    throw new Error("Firebase Admin is being goofy again");
                }
            }
        }
    
        return app as admin.app.App;
    }

    const getAuth = (): Auth => {
        if(auth == undefined) {
            auth = firebaseAuth(getFirebaseApp());
        }

        return auth;
    }

    const getFirestore = (): Firestore => {
        if(firestore == undefined) {
            firestore = getFirebaseFirestore(getFirebaseApp());
        }

        return firestore;
    }

    return {
        getApp: getFirebaseApp,
        getAuth: getAuth,
        getFirestore: getFirestore,
    }
}


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


(async () => {
    const app = new FirecrawlApp({apiKey: 'fc-ed9035bda57d4e159291d68fe5405750'});

    const mapResult = await app.mapUrl("https://www.mcds-menu.com/", {
        includeSubdomains: true
    });

    console.log(mapResult);

    if(mapResult.success != true) return;

    const links = JSON.stringify(mapResult.links, null, "\t");

    const prompt = "Below are a list of urls from a restaurant. Your goal is to filter through these URLs and only obtain the urls that link to a menu or a product on the menu. You need to filter though these urls, find a list of key words from the url pathway to filter out the pages to only ones that relate to menu or products on the menu. You also find the general categories of items. Your output should ONLY be a formatted JSON parsable array such as this { \"keywords\": [\"menu\", \"item\", \"product\", \"drinks\"], categories: [\"lunch\", \"breakfast\", \"drinks\"] }. No explanation or any fluff is necessary, keep it to main paths, no individual items, should only be a maximum of 10 paths. Only the final JSON parsable array. Here is the list of urls:\n\n" + links;

    const response = await gemini.chat({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        responseFormat: Keywords,
    });

    const content = response.message.content.toString();

    console.log(content);

    const keywords = Keywords.parse(JSON.parse(content.substring(7, content.length - 3)));

    console.log(keywords);

    const crawlResult = await app.crawlUrl('https://www.mcds-menu.com/', {
        limit: 500,
        scrapeOptions: {
            formats: [ "markdown" ],
            onlyMainContent: true,
            maxAge: 1000000000,
        }
    });


    if (!crawlResult.success) {
        throw new Error(`Failed to crawl: ${crawlResult.error}`)
    }

    console.log(crawlResult);

    const db = firebaseAdmin.getFirestore();

    const DatabaseEntry = z.object({
        title: z.string(),
        description: z.string(),
        ingredients: z.string().array(),
        calories: z.string(),
        health_information: z.string(),
        price: z.number(),
        category: z.string(),
        image_url: z.string(),
    });

    const FullResponse = z.object({
        valid: z.boolean(),
        entry: DatabaseEntry.optional(),
    });

    const config = {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            required: ["valid"],
            properties: {
                valid: {
                    type: Type.BOOLEAN,
                },
                entry: {
                    type: Type.OBJECT,
                    required: ["title", "description", "ingredients", "calories", "health_information", "price", "category", "image_url"],
                    properties: {
                        title: {
                            type: Type.STRING,
                        },
                        description: {
                            type: Type.STRING,
                        },
                        image_url: {
                            type: Type.STRING,
                        },
                        ingredients: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                            },
                        },
                        calories: {
                            type: Type.STRING,
                        },
                        health_information: {
                            type: Type.STRING,
                        },
                        price: {
                            type: Type.NUMBER,
                        },
                        category: {
                            type: Type.STRING,
                        },
                    },
                },
            },
        },
    } satisfies GenerateContentConfig;

    const model = 'gemini-2.0-flash';

    const promises = crawlResult.data.map((item) => {
        return (async () => {
            const contents = [
                {
                    role: "user",
                    parts: [
                        {
                            text: `The next user response will contain parsed text from a resturant page, your job is to determine if this is a valid menu item, do not confuse categories of items as a valid menu item. Then, you should parse the information into the valid entry format. Pull -1 as price if price is not found. Here is the list of valid categories: ${JSON.stringify(keywords.categories)}`,
                        }
                    ] 
                },
                {
                    role: "model",
                    parts: [
                        {
                            text: `Okay, I understand. I'm ready to receive the parsed text from the restaurant page. I will analyze it to determine if it represents a valid menu item based on the provided categories. If valid, I will then parse the information into the correct entry format. Please provide the text!`,
                        },
                    ],
                },
                {
                    role: 'user',
                    parts: [
                        {
                            text: '----------------\n' +
                            `URL: ${item.metadata?.ogUrl}\n` +
                            `Title: ${item.metadata?.title}\n` + 
                            `Description: ${item.metadata?.description}\n` +
                            `Content: ${item.markdown}\n` +
                            '----------------\n\n\n\n\n\n'
                        },
                    ],
                }
            ] satisfies ContentListUnion;

            const response = await ai.models.generateContent({
                model,
                config,
                contents,
            });

            const content = response.text;

            if(content == undefined) {
                console.log("Undefined content.");

                return;
            }

            console.log(content);

            let structuredResponse: undefined | z.infer<typeof FullResponse> = undefined;

            try {
                structuredResponse = FullResponse.parse(JSON.parse(content));
            } catch(e) {
                console.log(e);

                return;
            }

            if(structuredResponse.valid) {
                await db.collection('menu').add({
                    ...structuredResponse.entry
                });
            }
        })();
    });

    await db.collection('menu').doc("info").set({
        ...keywords
    });

    const settled = await Promise.allSettled(promises);
    
    console.log(settled);

    /*const db = firebaseAdmin.getFirestore();

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
        url: 'https://4cd757ea-d659-4e3f-b824-9cc875403e6a.us-east4-0.gcp.cloud.qdrant.io:6333',
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.HZS7M_MK7fbxoX8-lm_7R35zPWr8FgAZv8muatllGMU',
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
        } 
        
        console.log(`Collection for ${category} doesn't exist yet, will create it`);
        
        if (categoryItems && categoryItems.length > 0) {
            // Format items into documents with appropriate metadata
            const documents = categoryItems.map(item => {
                const content = `${item.title}\n${item.description}\nIngredients: ${item.ingredients.join(', ')}\nCalories: ${item.calories}\nHealth Information: ${item.health_information}\nPrice: ${item.price}`;
                
                console.log(item);

                return new Document({
                    text: content,
                    metadata: {
                        id: item.id,
                        title: item.title,
                        category: item.category,
                        price: item.price,
                        calories: item.calories,
                        image_url: item.image_url
                    }
                });
            });

            const vectorStore = new QdrantVectorStore({
                client: client,
                collectionName: `category_${category}`, // The name of your collection in Qdrant
            });

            const storageContext = await storageContextFromDefaults({
                vectorStore
            });
    
            
            const response = await ai.models.embedContent({
                model: 'gemini-embedding-exp-03-07',
                contents: documents,
            });

            if(response.embeddings == undefined) {
                console.log("Embedding Undefined");
                continue;
            }
            
            categoryIndices[category] = response.embeddings[0].values;
            console.log(`Created index for ${category}`);
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
        const response = await menuAgent.run("Find me something with cheese in the burgers category", {
            chatHistory: [
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
            ]
        });
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

        console.log(ResponseSchema.parse(JSON.parse(finalResult.text ?? "")));*/
})();