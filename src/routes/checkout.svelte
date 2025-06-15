<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  let name = '';
  let selectedPayment = 'visa';
  let tip = 0;
  let total = 52.25; // For demo, you can pass this from cart or recalculate

  onMount(() => {
    const url = new URL(get(page).url);
    tip = +(url.searchParams.get('tip') || 0);
    // In a real app, recalculate total here using cart data and tip
  });

  function handlePayment() {
    alert(`Thank you, ${name || 'Guest'}! Your payment is being processed.`);
  }
</script>

<div class="checkout-bg">
  <div class="checkout-container">
    <div class="checkout-header">
      <button class="checkout-back">&lt; Back</button>
      <span class="checkout-title">Checkout</span>
    </div>
    <div class="checkout-form">
      <div class="checkout-label">YOUR NAME</div>
      <input class="checkout-input" type="text" bind:value={name} placeholder="Enter your name" />
      <div class="checkout-label mt">PAYMENT METHOD</div>
      <div class="checkout-payments">
        <label class="checkout-payment-option">
          <input type="radio" name="payment" value="visa" bind:group={selectedPayment} />
          <span class="checkout-payment-icon">💳</span>
          <span class="checkout-payment-text">**** **** **** 5967</span>
        </label>
        <label class="checkout-payment-option">
          <input type="radio" name="payment" value="paypal" bind:group={selectedPayment} />
          <span class="checkout-payment-icon">🅿️</span>
          <span class="checkout-payment-text">wilson.casper@bernice.info</span>
        </label>
        <label class="checkout-payment-option">
          <input type="radio" name="payment" value="mastercard" bind:group={selectedPayment} />
          <span class="checkout-payment-icon">💳</span>
          <span class="checkout-payment-text">**** **** **** 3461</span>
        </label>
      </div>
      <button class="checkout-pay-btn" on:click={handlePayment}>Payment</button>
    </div>
    <div class="checkout-touchid">Pay with Touch ID</div>
  </div>
</div>

<style>
.checkout-bg {
  min-height: 100vh;
  background: #f6f6fa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.checkout-container {
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
.checkout-header {
  background: linear-gradient(90deg, #ff5f7e 0%, #ff7e5f 100%);
  border-radius: 18px 18px 0 0;
  padding: 24px 24px 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.checkout-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
}
.checkout-back {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
}
.checkout-form {
  padding: 18px 24px 0 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.checkout-label {
  color: #ff5f7e;
  font-size: 0.98rem;
  font-weight: 600;
  margin-bottom: 4px;
}
.checkout-label.mt {
  margin-top: 18px;
}
.checkout-input {
  padding: 10px 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 1.08rem;
  margin-bottom: 4px;
}
.checkout-payments {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.checkout-payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f8fb;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 1.08rem;
  cursor: pointer;
}
.checkout-payment-icon {
  font-size: 1.3rem;
}
.checkout-payment-text {
  color: #222;
}
.checkout-pay-btn {
  margin-top: 18px;
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
.checkout-pay-btn:hover {
  background: linear-gradient(90deg, #ff7e5f 0%, #ff5f7e 100%);
}
.checkout-touchid {
  margin: 32px auto 0 auto;
  color: #bbb;
  font-size: 1.1rem;
  text-align: center;
}
</style> 