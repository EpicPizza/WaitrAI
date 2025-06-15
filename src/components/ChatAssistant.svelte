<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { cart } from '../stores/cart';
  import type { CartItem } from '../stores/cart';
    import { invalidate, invalidateAll } from '$app/navigation';
    import SvelteMarkdown from 'svelte-markdown';
    import Icon from '@iconify/svelte';

    const { sessionId, interactions, currentInteraction }: { sessionId: string, interactions: any, currentInteraction: any } = $props();

  const add = getContext("add") as Function;

  async function submit() {
    messages.push({
          text: inputText,
          items: undefined,
          isUser: true
        });



    const result = await fetch("./?sessionId=" + sessionId, {
      method: "POST",
      body: JSON.stringify({
        message: inputText,
      })
    });

      inputText = "";

    const response = await result.json();
    console.log(response);
    
    if (result.ok && response.messageId)  {
      // Update the URL with the new messageId
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('messageId', response.messageId);
      window.history.pushState({}, '', newUrl);

      invalidateAll();
    }
  }

  let messages: Array<{text: string, isUser: boolean, image?: string, items: undefined | any[] }> = $state([]);

  messages = interactions.map((interaction: { content: any; type: string; menuItems: undefined | any[] }) => ({ text: interaction.content, isUser: interaction.type == "user", image: undefined, items: interaction.menuItems ?? [] }));

  let inputText = $state('');
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

  let loading = $state(false);

  let agentInteraction = $state("");
  let items = $state([]) as any[];

  $effect(() => {
    console.log(currentInteraction);
    
    if(currentInteraction.status) {
      loading = true;

      (async () => {
        const response = await currentInteraction.status;

        loading = false;

        messages.push({
          text: response.response as string,
          items: response.items,
          isUser: false
        });
        
      })();
    }
  })
  

  function toggleVoiceInput() {
    isListening = !isListening;
    // Add voice recognition logic here
  }
</script>

<div class="chat-container h-[calc(100dvh-9.5rem)] sticky top-0">
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
          <p><SvelteMarkdown source={message.text}/></p>
          
          {#if message.items}
             {#each message.items as item}
                <div class="border border-zinc-300 rounded-lg p-4 mt-4 flex items-center gap-4">
                  <div class="w-full">
                    <p class="mb-2 font-bold">{item.title}</p>
                    <div class="flex items-center text-sm justify-between">
                      <p>{item.calories}</p>
                      <p>{item.price}</p>
                    </div>
                  </div>
                  <button onclick={() => { add(item.id);  }} class="flex cursor-pointer **:items-center justify-around bg-black/10 rounded-lg p-3">
                    <Icon width=1.5rem icon=mdi:cart></Icon>
                  </button>
               </div>
            {/each}
          {/if}
        </div>
      </div>
    {/each}

    {#if loading == true}
      <div class="flex items-center gap-3">
        <div class="border-2 border-t-black border-l-black border-white w-5 h-5 rounded-full animate-spin"></div>
        <p class="font-bold">Loading Response</p>
        
      </div>
    {/if}
    </div>

  <div class="input-area">
    <div class="mic-row">
    </div>
      <input
      type="text"
      onkeydown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submit();
        }
      }}
      bind:value={inputText}
      placeholder="What would you like to order?"
      name="message"
      class="w-[calc(100%-6rem)]"
      />
      <button onclick={submit} type="submit">Send</button>
  </div>
</div>

<style>
  .chat-container {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    /*height: 600px;*/
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