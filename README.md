# AI Waiter – Conversational Restaurant Ordering Assistant

WaitrAI is an intelligent, voice-first restaurant ordering assistant designed to replace the traditional human cashier or waiter. Built with a large language model (LLM) at its core, AI Waiter creates a seamless and intuitive customer experience where users can order food by simply talking to an AI — just like they would with a real waiter.

This project is built with a minimal, clean user interface and is designed to be deployed in both casual and sit-down restaurant environments. AI Waiter helps customers make personalized food decisions, handles the entire ordering process via conversation, and supports dietary preferences and multilingual interactions.

## 🧠 Core Features

- **Conversational AI Ordering**  
  Users can order food entirely through a chat or voice-based assistant.  
  Example: _“I want something spicy but vegetarian”_ → AI recommends appropriate dishes.

- **Voice + Chat Input Support**  
  Users can either type or speak to the assistant. Voice is enabled through a floating mic button on the main interface.

- **Menu Knowledge**  
  The agent has full access to the restaurant’s menu, including:
  - Ingredients
  - Dietary tags (vegetarian, gluten-free, etc.)
  - Pricing
  - Specials

- **Two-Page Application (Minimal UX)**  
  1. **Main Page** – AI chat/voice interface + scrollable visual menu below  
     - Cart items are added via AI interaction only  
     - Menu is for visual reference (non-clickable)
     - “Checkout” button is always visible (top-right)
  2. **Checkout Page** – Cart summary, manual deletion of items, and payment options  
     - Supports Zelle/Venmo-style payment or “Mark as Paid” for demo purposes

- **Multilingual Support**  
  User can select their preferred language at the start of the interaction.

- **Dietary Preferences Handling**  
  The AI understands user dietary restrictions and filters recommendations accordingly.

---

## 🖥️ Technical Overview

- **Frontend**: HTML, CSS, JavaScript (React preferred for dynamic flow)
- **AI Engine**: OpenAI GPT-4o or equivalent LLM via API
- **Voice Integration**: Web Speech API (for browser-based voice input)
- **Database (Optional)**: Firebase or Supabase to store menu and orders
- **Deployment**: Vercel / Netlify / Custom Domain

---

## 📱 User Experience Flow

1. **User lands on main page** → greeted by AI Waiter
2. **User speaks or types order request** → AI responds with suggestions
3. **User confirms choice(s)** → Items are added to cart by AI
4. **User clicks “Checkout”** (top right)
5. **Checkout Page** shows items → User can delete or pay via Venmo/Zelle
6. **Order is sent to restaurant dashboard or logged**

---

## 🧾 Restaurant Dashboard (Future Scope)

In this MVP, orders are viewable by the restaurant via:
- Shared Google Sheet (using Google Sheets API)
- Email/SMS notifications
- Future versions may include:
  - Real-time dashboard (React/Firebase)
  - Order status tracking
  - Table number integration

---

## 🧪 Hackathon Ready

This project is optimized for quick setup, fast iteration, and demo-ready deployment. No user logins or complex setup required. Voice and chat ordering simulate a real-world experience using a test menu (e.g., In-N-Out or Chick-fil-A).

## 🚀 Future Enhancements

- Full restaurant dashboard
- Multi-restaurant support
- Table QR integration
- Payment processing (Stripe integration)
- Feedback and tip flow
- POS (Point-of-Sale) system compatibility

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
