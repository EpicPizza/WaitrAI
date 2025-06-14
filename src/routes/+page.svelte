<!-- Main page component -->
<script lang="ts">
  import { onMount } from 'svelte';
  import ChatAssistant from '../components/ChatAssistant.svelte';
  import MenuViewer from '../components/MenuViewer.svelte';
  import NavBar from '../components/NavBar.svelte';
  import MicButton from '../components/MicButton.svelte';

  let cartTotal = 0;
  let cartItems = 0;
  
  // Sample menu data - replace with actual data from your backend
  const menuItems = [
    {
      id: 1,
      name: "Hotcakes",
      price: 12.99,
      description: "Juicy beef patty with fresh vegetables",
      image: "https://s7d1.scene7.com/is/image/mcdonaldsstage/DC_202405_0031_3HotCakes_1564x1564?wid=1564&hei=1564&dpr=off"
    },
    {
      id: 2,
      name: "Fruit & Maple Oatmeal",
      price: 8.99,
      description: "Crisp romaine lettuce with parmesan",
      image: "https://s7d1.scene7.com/is/image/mcdonalds/DC_202002_1500_Oatmeal_Fruit_1564x1564-1?wid=1564&hei=1564&dpr=off"
    },
    {
      id: 3,
      name: "Bacon, Egg & Cheese Biscuit",
      price: 12.99,
      description: "Crisp romaine lettuce with parmesan",
      image: "https://s7d1.scene7.com/is/image/mcdonaldsstage/DC_202405_0085_BaconEggCheeseBiscuit_1564x1564?wid=1564&hei=1564&dpr=off"
    },
    {
      id: 4,
      name: "Sausage Burrito",
      price: 10.99,
      description: "Crisp romaine lettuce with parmesan",
      image: "https://s7d1.scene7.com/is/image/mcdonalds/DC_202411_0334_SausageBurrito_Alt_McValue_1564x1564?wid=1564&hei=1564&dpr=off"
    },
    {
      id: 5,
      name: "Big Mac",
      price: 6.99,
      description: "Crisp romaine lettuce with parmesan",
      image: "https://s7d1.scene7.com/is/image/mcdonalds/DC_202302_0005-999_BigMac_1564x1564-1?wid=1564&hei=1564&dpr=off"
    },
    // Add more menu items as needed
  ];
</script>

<svelte:head>
  <title>AI Waiter - Restaurant Ordering</title>
</svelte:head>

<main class="app-container">
  <NavBar cartTotal={cartTotal} cartItems={cartItems} />
  
  <div class="content-wrapper">
    <div class="chat-section">
      <ChatAssistant />
    </div>
    <div class="menu-section">
      <MenuViewer items={menuItems} />
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
    flex-direction: column;
    align-items: center;
    gap: 0;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
  .chat-section {
    width: 100%;
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
