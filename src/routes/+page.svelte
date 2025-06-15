<!-- Main page component -->
<script lang="ts">
  import { onMount } from 'svelte';
  import ChatAssistant from '../components/ChatAssistant.svelte';
  import MenuViewer from '../components/MenuViewer.svelte';
  import NavBar from '../components/NavBar.svelte';

  const { data } = $props();
</script>

<svelte:head>
  <title>AI Waiter - Restaurant Ordering</title>
</svelte:head>

<main class="app-container">
  
  <div class="content-wrapper">
    <div class="chat-section">
      <ChatAssistant currentInteraction={data.currentInteraction} interactions={data.interactions} sessionId={data.sessionId} />
    </div>
    <div class="menu-section">
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
