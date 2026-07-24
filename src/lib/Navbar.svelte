<script lang="ts">
  import Share from './Share.svelte';

  interface Props {
    url?: string;
  }

  let { url = '' }: Props = $props();

  let scrollY = $state(0);
  let innerHeight = $state(0);
  let documentHeight = $state(0);

  let progress = $derived.by(() => {
    const scrollable = documentHeight - innerHeight;
    if (scrollable <= 0) return 0;
    return Math.min(Math.max(scrollY / scrollable, 0), 1);
  });

  $effect(() => {
    const measure = () => {
      documentHeight = document.documentElement.scrollHeight;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    return () => observer.disconnect();
  });
</script>

<svelte:window bind:scrollY bind:innerHeight />

<nav class="fixed-nav-bar">
  <Share {url} compact size={26} />
</nav>

<div
  class="progress-bar"
  style="--scroll-amount: {progress * 100}%"
  role="progressbar"
  aria-label="Progression de lecture"
  aria-valuenow={Math.round(progress * 100)}
  aria-valuemin="0"
  aria-valuemax="100"
></div>

<style>
  .fixed-nav-bar {
    position: fixed;
    align-items: center;
    justify-content: flex-end;
    top: 0;
    left: 0;
    z-index: 9998;
    width: 100%;
    height: var(--navbar-height);
    padding-right: 20px;
    background-color: var(--color-bg);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    display: flex;
  }

  .progress-bar {
    --scroll-amount: 0%;
    position: fixed;
    top: calc(var(--navbar-height) - 5px);
    left: 0;
    width: var(--scroll-amount);
    height: 5px;
    background-color: var(--color-accent);
    z-index: 10000;
  }
</style>
