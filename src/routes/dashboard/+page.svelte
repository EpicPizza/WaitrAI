<script lang="ts">
  import type { Order } from '$lib/types';
  import './dashboard.css';

  // Mock data for initial development
  let orders: Order[] = [
    {
      id: '101',
      tableNumber: 7,
      timestamp: '10:45 AM',
      items: [
        { name: 'Margherita Pizza', quantity: 1 },
        { name: 'Caesar Salad', quantity: 1 }
      ],
      preferences: [],
      status: 'new'
    },
    {
      id: '102',
      tableNumber: 4,
      timestamp: '10:47 AM',
      items: [
        { name: 'Cheeseburger', quantity: 2 },
        { name: 'Fries', quantity: 2 }
      ],
      preferences: [],
      status: 'new'
    },
    {
      id: '103',
      tableNumber: 3,
      timestamp: '10:49 AM',
      items: [
        { name: 'Pepperoni Pizza', quantity: 1 },
        { name: 'Garlic Bread', quantity: 2 }
      ],
      preferences: [],
      status: 'preparing'
    },
    {
      id: '104',
      tableNumber: 5,
      timestamp: '10:52 AM',
      items: [
        { name: 'Tacos', quantity: 3 },
        { name: 'Quesadilla', quantity: 1 }
      ],
      preferences: [],
      status: 'preparing'
    }
  ];

  function updateOrderStatus(orderId: string, newStatus: Order['status']) {
    orders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
  }

  $: newOrders = orders.filter(o => o.status === 'new');
  $: preparingOrders = orders.filter(o => o.status === 'preparing');
</script>

<div class="dashboard-bg">
  <div class="dashboard-container">
    <div class="dashboard-columns">
      <!-- New Orders Column -->
      <div style="flex:1">
        <div class="dashboard-header-yellow">New</div>
        <div class="dashboard-body-yellow">
          {#each newOrders as order}
            <div class="dashboard-card">
              <div class="dashboard-order-id">#{order.id}</div>
              <div class="dashboard-items">
                {#each order.items as item}
                  <div>{item.quantity}x {item.name}</div>
                {/each}
              </div>
              <div class="dashboard-time">{order.timestamp}</div>
              <button
                class="dashboard-btn"
                on:click={() => updateOrderStatus(order.id, 'preparing')}
              >
                Mark as ready
              </button>
            </div>
          {/each}
        </div>
      </div>
      <!-- Preparing Orders Column -->
      <div style="flex:1">
        <div class="dashboard-header-blue">Preparing</div>
        <div class="dashboard-body-blue">
          {#each preparingOrders as order}
            <div class="dashboard-card dashboard-card-blue">
              <div class="dashboard-order-id">#{order.id}</div>
              <div class="dashboard-items">
                {#each order.items as item}
                  <div>{item.quantity}x {item.name}</div>
                {/each}
              </div>
              <div class="dashboard-time">{order.timestamp}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* No extra styles needed, all handled by Tailwind */
</style> 