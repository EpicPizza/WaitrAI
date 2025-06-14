<!-- Main page component -->
<script lang="ts">
  import { onMount, setContext } from 'svelte';
  import ChatAssistant from '../components/ChatAssistant.svelte';
  import MenuViewer from '../components/MenuViewer.svelte';
  import NavBar from '../components/NavBar.svelte';

  const { data } = $props();

  setContext('sessionId', data.sessionId);

  let itemCount = $state(data.cart.length);
  let cartTotal = $derived(data.cart.reduce((total: number, item: { price: number; quantity: number; }) => total + (item.price * item.quantity), 0));

  setContext('add', async (itemId: string) => {
    const response = await fetch("/cart?sessionId=" + data.sessionId , {
      method: "POST",
      body: JSON.stringify({
        quantity: 1,
        productId: itemId,
      })
    });

    itemCount++;
    // Find the item price from data.items using the itemId and add it to cartTotal
    const addedItem = data.items.find(item => item.id === itemId);
    if (addedItem) {
      cartTotal += addedItem.price;
    }
  })
</script>

<svelte:head>
  <title>AI Waiter - Restaurant Ordering</title>
</svelte:head>

<main class="app-container">
  <NavBar cartTotal={cartTotal} cartItems={itemCount}></NavBar>
  
  <div class="content-wrapper flex-col md:flex-row">
    <div class="chat-section w-full md:w-4/5">
      <ChatAssistant currentInteraction={data.currentInteraction} interactions={data.interactions} sessionId={data.sessionId} />
    </div>
    <div class="menu-section">
      <MenuViewer categories={data.categories}></MenuViewer>
    </div>
  </div>
</main>

<style>
  .app-container {
    min-height: 100vh;
    background-color: #f8f9fa;
  }

  .content-wrapper {
    display: flex;
    align-items: start;
    gap: 2rem;
    width: 100%;
    padding: 2rem;
    padding-bottom: 1rem;
    margin: 0 auto;
  }
  .mic-row {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 1rem 0 1.5rem 0;
  }
  .menu-section {
    width: 100%;
    margin-top: 0;
  }
</style>
