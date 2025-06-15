<script lang="ts">
    import Icon from '@iconify/svelte';
    import { getContext } from 'svelte';
  export let cartTotal: number;
  export let cartItems: number;

  const sessionId = getContext('sessionId');
</script>

<nav class="navbar">
  <div class="flex items-center gap-3">
    <div class="logo w-30">
      <img src="./logo.png" alt="WaitrAI" class="logo-img" />
    </div>
    <p class="text-3xl font-bold mb-1">/</p>
    <p class="text-xl">Restaurant</p>
  </div>
  
  {#if cartItems == 0}
    <div class="checkout-button opacity-50">
      <Icon width=1.5rem icon=mdi:cart></Icon>
      <span class="cart-info">
        <span class="cart-empty">Checkout</span>
      </span>
    </div>
  {:else}
    <a class="checkout-button" href="/cart?sessionId={sessionId}">
    <Icon width=1.5rem icon=mdi:cart></Icon>
    <span class="cart-info">
      {#if cartItems > 0}
        <span class="cart-total">${cartTotal.toFixed(2)}</span>
        <span class="cart-count">{cartItems} item{cartItems == 1 ? "": "s"}</span>
      {:else}
        <span class="cart-empty">Checkout</span>
      {/if}
    </span>
  </a>
  {/if}
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
    height: 4rem;
    width: auto;
    background: transparent;
    display: block;
    position:absolute;
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