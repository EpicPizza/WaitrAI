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
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  }

  h2 {
    margin: 0 0 1.5rem 0;
    color: #333;
    font-size: 1.5rem;
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
    overflow-y: auto;
    padding-right: 0.5rem;
  }

  .menu-item {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1.5px solid #e5e7eb;
    min-width: 0;
  }

  .menu-item:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }

  .item-image {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
  }

  .item-details {
    padding: 1.25rem 1rem 1rem 1rem;
    width: 100%;
    text-align: left;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #222;
    font-size: 1.15rem;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    font-weight: 600;
  }

  .price {
    color: #222;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    font-size: 1.05rem;
  }

  .description {
    color: #666;
    font-size: 0.97rem;
    margin: 0;
    line-height: 1.5;
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
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