<!-- Main page component -->
<script lang="ts">
  import { onMount } from 'svelte';
  import ChatAssistant from '../components/ChatAssistant.svelte';
  import MenuViewer from '../components/MenuViewer.svelte';
  import NavBar from '../components/NavBar.svelte';
  import { cart } from '../stores/cart';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';

  // Sample menu data - replace with actual data from your backend
  const menuItems = [
    {
  id: 1,
  name: "Hotcakes",
  price: 12.99,
  description: "Three fluffy, golden-brown pancakes served with butter and sweet maple syrup.",
  image: "https://s7d1.scene7.com/is/image/mcdonaldsstage/DC_202405_0031_3HotCakes_1564x1564?wid=1564&hei=1564&dpr=off"
},
{
  id: 2,
  name: "Fruit & Maple Oatmeal",
  price: 8.99,
  description: "Warm oatmeal topped with diced apples, cranberries, and two varieties of raisins.",
  image: "https://s7d1.scene7.com/is/image/mcdonalds/DC_202002_1500_Oatmeal_Fruit_1564x1564-1?wid=1564&hei=1564&dpr=off"
},
{
  id: 3,
  name: "Bacon, Egg & Cheese Biscuit",
  price: 12.99,
  description: "A warm, flaky biscuit filled with crispy bacon, a fluffy folded egg, and melted cheese.",
  image: "https://s7d1.scene7.com/is/image/mcdonaldsstage/DC_202405_0085_BaconEggCheeseBiscuit_1564x1564?wid=1564&hei=1564&dpr=off"
},
{
  id: 4,
  name: "Sausage Burrito",
  price: 10.99,
  description: "A soft flour tortilla stuffed with savory sausage, scrambled eggs, melty cheese, onions, and peppers.",
  image: "https://s7d1.scene7.com/is/image/mcdonalds/DC_202411_0334_SausageBurrito_Alt_McValue_1564x1564?wid=1564&hei=1564&dpr=off"
},
{
  id: 5,
  name: "Big Mac",
  price: 6.99,
  description: "Two 100% beef patties, special sauce, lettuce, cheese, pickles, and onions on a sesame seed bun.",
  image: "https://s7d1.scene7.com/is/image/mcdonalds/DC_202302_0005-999_BigMac_1564x1564-1?wid=1564&hei=1564&dpr=off"
},
    // Add more menu items as needed
  ];

  $: cartItems = $cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  $: cartTotal = $cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  function handleCheckout() {
    if (get(cart).length > 0) {
      goto('/checkout');
    }
  }
</script>

<svelte:head>
  <title>AI Waiter - Restaurant Ordering</title>
</svelte:head>

<main class="app-container">
  <NavBar {cartTotal} {cartItems} on:checkout={handleCheckout} />
  
  <div class="content-wrapper">
    <div class="chat-section">
      <ChatAssistant {menuItems} />
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
