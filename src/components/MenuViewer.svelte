<script lang="ts">
    import Icon from "@iconify/svelte";
    import { getContext } from "svelte";

    const add = getContext("add") as Function;

  interface Item {
    id: number,
    title: string,
    calories: string,
    description: string,
    health_information: string,
    image_url: string,
    price: number,
    ingredients: string[],
  };

  interface Category {
    items: Item[],
    name: string,
  }

  export let categories: Category[];
</script>

<div class="menu-container md:max-h-[calc(100dvh-9.5rem)] overflow-auto">
  <h2>Menu</h2>
  {#each categories as category}
    <h3 class="capitalize pt-8 pb-2 opacity-50">{category.name}</h3>
    <div class="menu-grid">
      {#each category.items as item}
        <div class="menu-item relative">
          <div class="item-image">
            <img src={item.image_url} alt={item.title} />
          </div>
          <div class="item-details">
            <h3>{item.title}</h3>
            <p class="price">{item.price}</p>
            <p class="description">{item.description}</p>
          </div>
          <button onclick={() => { add(item.id);  }} class="flex cursor-pointer **:items-center justify-around bg-black/10 rounded-lg p-3 absolute top-2 left-2">
            <Icon width=1.5rem icon=mdi:cart></Icon>
          </button>
        </div>
      {/each}
    </div>

  {/each}
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