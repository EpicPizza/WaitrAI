<script lang="ts">
  export let items: Array<{
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
  }>;
</script>

<div class="menu-container">
  <h2>Menu</h2>
  <div class="menu-grid">
    {#each items as item}
      <div class="menu-item">
        <div class="item-image">
          <img src={item.image} alt={item.name} />
        </div>
        <div class="item-details">
          <h3>{item.name}</h3>
          <p class="price">${item.price.toFixed(2)}</p>
          <p class="description">{item.description}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .menu-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    height: 600px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  h2 {
    margin: 0 0 1.5rem 0;
    color: #333;
    font-size: 1.5rem;
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .menu-item {
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
  }

  .menu-item:hover {
    transform: translateY(-2px);
  }

  .item-image {
    width: 100%;
    height: 160px;
    overflow: hidden;
  }

  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .item-details {
    padding: 1rem;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.1rem;
  }

  .price {
    color: #4CAF50;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  .description {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.4;
  }

  /* Scrollbar styling */
  .menu-grid::-webkit-scrollbar {
    width: 6px;
  }

  .menu-grid::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .menu-grid::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  .menu-grid::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
</style> 