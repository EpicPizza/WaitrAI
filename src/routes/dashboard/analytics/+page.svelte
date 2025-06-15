<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);
  let chart: Chart;

  // Mock data
  const mostOrdered = [
    { item: 'Grilled Chicken', orders: 1480 },
    { item: 'Cheeseburger', orders: 1320 },
    { item: 'Caesar Salad', orders: 930 },
    { item: 'French Fries', orders: 860, up: true },
    { item: 'Margherita Pizza', orders: 810, up: true }
  ];
  const leastOrdered = [
    { item: 'Veggie Burger', orders: 120 },
    { item: 'Stir Fry', orders: 140 },
    { item: 'Tomato Soup', orders: 150 },
    { item: 'Pad Thai', orders: 170 },
    { item: 'Tiramisu', orders: 200 }
  ];

  const revenueData = {
    daily: [4000, 6000, 5500, 5000, 7000, 8000, 9000],
    weekly: [32000, 35000, 30000, 37000, 40000, 42000, 45000],
    monthly: [5000, 6000, 7000, 8000, 7500, 9000, 12000, 11000, 10000, 13000, 14000, 16000],
    sixMonths: [30000, 35000, 40000, 42000, 45000, 50000],
    yearly: [320000, 350000, 300000, 370000, 400000, 420000, 450000, 470000, 480000, 500000, 520000, 550000]
  };
  const labels = {
    daily: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekly: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    sixMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    yearly: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']
  };

  let selectedRange: keyof typeof revenueData = 'monthly';
  let chartCanvas: HTMLCanvasElement;

  function renderChart() {
    if (chart) chart.destroy();
    chart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: labels[selectedRange],
        datasets: [{
          label: 'Revenue',
          data: revenueData[selectedRange],
          borderColor: '#0e766e',
          backgroundColor: 'rgba(14, 118, 110, 0.1)',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#0e766e',
          fill: false
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: string | number) => typeof value === 'number' ? `$${value.toLocaleString()}` : value
            }
          }
        }
      }
    });
  }

  function setRange(range: string) {
    selectedRange = range as keyof typeof revenueData;
  }

  $: renderChart();
</script>

<div class="container mx-auto px-4 py-8">
  <div class="bg-white rounded-2xl shadow p-8 mb-8">
    <h1 class="text-3xl font-bold mb-6">Data Analytics</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-gray-50 rounded-xl p-6 shadow">
        <h2 class="text-xl font-semibold mb-4">Most Ordered</h2>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b">
              <th class="py-2 font-medium">Menu Item</th>
              <th class="py-2 font-medium">Orders</th>
            </tr>
          </thead>
          <tbody>
            {#each mostOrdered as entry}
              <tr class="border-b last:border-0">
                <td class="py-2">{entry.item}</td>
                <td class="py-2">
                  {entry.orders.toLocaleString()}
                  {#if entry.up}
                    <span class="text-green-600 ml-2">↑</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div class="bg-gray-50 rounded-xl p-6 shadow">
        <h2 class="text-xl font-semibold mb-4">Least Ordered</h2>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b">
              <th class="py-2 font-medium">Menu Item</th>
              <th class="py-2 font-medium">Orders</th>
            </tr>
          </thead>
          <tbody>
            {#each leastOrdered as entry}
              <tr class="border-b last:border-0">
                <td class="py-2">{entry.item}</td>
                <td class="py-2">{entry.orders.toLocaleString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    <div class="bg-gray-50 rounded-xl p-6 shadow">
      <h2 class="text-xl font-semibold mb-4">Revenue</h2>
      <div class="flex gap-2 mb-4">
        {#each Object.keys(revenueData) as range}
          <button
            class="px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none {selectedRange === range ? 'bg-teal-700 text-white' : 'bg-gray-200 text-gray-700'}"
            on:click={() => setRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1).replace('sixMonths', '6 Months')}
          </button>
        {/each}
      </div>
      <div class="w-full h-72">
        <canvas bind:this={chartCanvas}></canvas>
      </div>
    </div>
  </div>
</div>

<style>
  /* Add any additional custom styles here */
</style> 