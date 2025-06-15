<script lang="ts">
  import { goto } from '$app/navigation';
  import { writable } from 'svelte/store';

  const { data } = $props();

  // Mock cart data
  const cartItems = data.cart as {
    title: string,
    quantity: number,
    price: number,
    id: string
  }[];



  let tip = $state(0)
  let subtotal = $derived(cartItems.reduce((sum, item) => sum + item.price, 0));
  let tax = 2.75;
  let total = $derived(subtotal + tax + tip);

  function handleCheckout() {
    // For demo, pass tip as query param. In real app, use a store or session.
    goto(`/checkout?tip=${tip}`);
  }
</script>

<div class="cart-bg">
  <div class="cart-container">
    <div class="cart-header">
      <span class="cart-title">Order</span>
      <button class="cart-close">Close</button>
    </div>
    <div class="cart-summary">
      <div class="cart-summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
      <div class="cart-summary-row"><span>Tax & Fees</span><span>${tax.toFixed(2)}</span></div>
      <div class="cart-summary-row">
        <span>Tip</span>
        <input type="number" min="0" class="cart-tip-input" bind:value={tip} placeholder="0.00" />
      </div>
      <div class="cart-summary-row cart-summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
    </div>
    <div class="cart-items">
      {#each cartItems as item}
        {@const menuItem = data.items.find(menuItem => menuItem.id == item.id)}
        <div class="cart-item">
          <img class="cart-item-img" src={menuItem?.image_url} alt={item.title} />
          <div class="cart-item-info">
            <div class="cart-item-name">{item.title}</div>
            <div class="cart-item-details">{menuItem?.description}</div>
            <div class="cart-item-price">${item.price.toFixed(2)}</div>
          </div>
        </div>
      {/each}
    </div>
    <button class="cart-checkout-btn" onclick={handleCheckout}>Checkout</button>
  </div>
</div>

<style>
.cart-bg {
  min-height: 100vh;
  background: #f6f6fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 0 0 24px 0;
  margin: 32px 0;
  display: flex;
  flex-direction: column;
}
.cart-header {
  background: linear-gradient(90deg, #ff5f7e 0%, #ff7e5f 100%);
  border-radius: 18px 18px 0 0;
  padding: 24px 24px 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cart-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
}
.cart-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
}
.cart-summary {
  padding: 18px 24px 0 24px;
  font-size: 1.08rem;
}
.cart-summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #444;
}
.cart-summary-total {
  font-weight: bold;
  font-size: 1.18rem;
  border-top: 1px solid #eee;
  padding-top: 8px;
  margin-top: 8px;
  color: #222;
}
.cart-items {
  padding: 18px 16px 0 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.cart-item {
  display: flex;
  background: #f8f8fb;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 10px 12px;
  align-items: center;
}
.cart-item-img {
  width: 54px;
  height: 54px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 14px;
}
.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.cart-item-name {
  font-weight: 600;
  font-size: 1.08rem;
  color: #222;
}
.cart-item-details {
  font-size: 0.97rem;
  color: #888;
  margin: 2px 0 4px 0;
}
.cart-item-price {
  color: #ff5f7e;
  font-weight: bold;
  font-size: 1.08rem;
}
.cart-checkout-btn {
  margin: 28px 24px 0 24px;
  padding: 14px 0;
  background: linear-gradient(90deg, #ff5f7e 0%, #ff7e5f 100%);
  color: #fff;
  font-size: 1.18rem;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255,95,126,0.08);
  transition: background 0.2s;
}
.cart-checkout-btn:hover {
  background: linear-gradient(90deg, #ff7e5f 0%, #ff5f7e 100%);
}
.cart-tip-input {
  width: 70px;
  padding: 4px 8px;
  border: 1px solid #eee;
  border-radius: 6px;
  font-size: 1rem;
  text-align: right;
  margin-left: 8px;
}
</style> 