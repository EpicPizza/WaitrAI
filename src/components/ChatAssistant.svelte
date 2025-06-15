<script lang="ts">
  import { onMount } from 'svelte';
  import { cart } from '../stores/cart';
  import type { CartItem } from '../stores/cart';
  export let menuItems: CartItem[] = [];

  let messages: Array<{text: string, isUser: boolean, image?: string}> = [];
  let inputText = '';
  let isListening = false;
  let selectedLanguage = 'en';
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  function handleSubmit() {
    if (!inputText.trim()) return;
    messages = [...messages, { text: inputText, isUser: true }];
    // Try to match input to a menu item (simple case-insensitive substring match)
    const found = menuItems.find(item => inputText.toLowerCase().includes(item.name.toLowerCase()));
    if (found) {
      cart.update(items => {
        const existing = items.find(i => i.id === found.id);
        if (existing) {
          return items.map(i => i.id === found.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i);
        } else {
          return [...items, { ...found, quantity: 1 }];
        }
      });
      setTimeout(() => {
        messages = [...messages, {
          text: `I've added ${found.name} to your cart!`,
          isUser: false,
          image: found.image
        }];
      }, 500);
    } else {
      setTimeout(() => {
        messages = [...messages, {
          text: "Sorry, I couldn't find that item on the menu.",
          isUser: false
        }];
      }, 500);
    }
    inputText = '';
  }

  function toggleVoiceInput() {
    isListening = !isListening;
    // Add voice recognition logic here
  }
</script>

<div class="chat-container">
  <div class="language-selector">
    <select bind:value={selectedLanguage}>
      {#each languages as lang}
        <option value={lang.code}>{lang.name}</option>
      {/each}
    </select>
  </div>

  <div class="messages">
    {#each messages as message}
      <div class="message {message.isUser ? 'user' : 'ai'}">
        {#if message.image}
          <img src={message.image} alt="Item added" class="item-image" />
        {/if}
        <div class="message-content">
          <p>{message.text}</p>
          {#if !message.isUser && message.image}
            <span class="added-label">Added to Cart</span>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="input-area">
    <div class="mic-row">
      <button class="mic-btn" aria-label="Voice input">
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" fill="currentColor"/>
          <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="currentColor"/>
        </svg>
      </button>
    </div>
    <form on:submit|preventDefault={handleSubmit}>
      <input
        type="text"
        bind:value={inputText}
        placeholder="What would you like to order?"
      />
      <button type="submit">Send</button>
    </form>
  </div>
</div>

<style>
  .chat-container {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    height: 600px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  }

  .language-selector {
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }

  .language-selector select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1.5px solid #e5e7eb;
    background: #fff;
    color: #222;
    font-size: 1rem;
    font-family: inherit;
    font-weight: 500;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .message {
    display: flex;
    gap: 1rem;
    max-width: 80%;
  }

  .message.user {
    margin-left: auto;
    flex-direction: row-reverse;
  }

  .message-content {
    background: #f8f9fa;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    position: relative;
    color: #222;
  }

  .message.user .message-content {
    background: #222;
    color: #fff;
  }

  .item-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
  }

  .added-label {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    background: #4CAF50;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
  }

  .input-area {
    padding: 1rem;
    border-top: 1px solid #eee;
  }

  .input-area form {
    display: flex;
    gap: 0.5rem;
  }

  .input-area input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
  }

  .input-area button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    background: #222;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.2s;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  }

  .input-area button:hover {
    background: #333;
  }

  .mic-row {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.mic-btn {
  width: 72px;
  height: 72px;
  border-radius: 40%;
  background: #fff;
  color: #222;
  font-size: 2.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  border: 1.5px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

  .mic-btn:hover {
    background: #f3f4f6;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
</style> 