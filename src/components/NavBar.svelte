<script lang="ts">
  export let cartTotal: number;
  export let cartItems: number;
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
</script>

<nav class="navbar">
  <div class="logo">
    <img src="file:///Users/ashishgupta/Downloads/20250614_1529_waitrAI_Logo_Design_simple_compose_01jxr8vfs3e42t115r2d8m3d5r-removebg-preview.png" alt="WaitrAI" class="logo-img" />
  </div>
  
  <button class="checkout-button" on:click={() => dispatch('checkout')} disabled={cartItems === 0}>
    <span class="cart-icon">🛒</span>
    <span class="cart-info">
      {#if cartItems > 0}
        <span class="cart-count">{cartItems}</span>
        <span class="cart-total">${cartTotal.toFixed(2)}</span>
      {:else}
        <span class="cart-empty">Checkout</span>
      {/if}
    </span>
  </button>
</nav>

<style>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo-img {
    height: 2.2rem;
    width: auto;
    background: transparent;
    display: block;
  }

  .logo-label {
    font-size: 1.35rem;
    font-weight: 700;
    color: #23404a;
    letter-spacing: 0.5px;
  }

  .checkout-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .checkout-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkout-button:hover:enabled {
    background-color: #45a049;
  }

  .cart-icon {
    font-size: 1.25rem;
  }

  .cart-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.2;
  }

  .cart-count {
    font-size: 0.875rem;
    opacity: 0.9;
  }

  .cart-total {
    font-size: 1.125rem;
    font-weight: 600;
  }

  .cart-empty {
    font-size: 1rem;
  }
</style> 