<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { browser } from '$app/environment';

  interface Props {
    images?: Array<{ src: string; caption: string; width?: number; height?: number }>;
    objectFit?: 'cover' | 'contain';
  }

  let { images = [], objectFit = 'cover' }: Props = $props();

  let loadedStates = $state<boolean[]>(untrack(() => images.map(() => false)));
  let container = $state<HTMLElement | undefined>(undefined);

  onMount(() => {
    if (!browser || !container) return;
        container.querySelectorAll<HTMLImageElement>('img.image').forEach((img, i) => {
      if (img.complete) loadedStates[i] = true;
    });
  });
</script>

<div class="image-grid" bind:this={container}>
  <div
    class="image-row"
    class:two-image-layout={images.length === 2}
    class:three-image-layout={images.length === 3}
    class:four-image-layout={images.length === 4}
  >
    {#each images as { src, caption, width, height }, index}
      <div
        class="image-container"
        class:single-image={images.length === 1}
        class:portrait-main={images.length === 3 && index === 0}
      >
        <div class="image-wrapper">
          <img
            {src}
            {width}
            {height}
            alt={caption}
            class="image"
            class:loaded={loadedStates[index]}
            decoding="async"
            loading={index >= 2 ? 'lazy' : 'eager'}
            fetchpriority={index < 2 ? 'high' : 'auto'}
            onload={() => { loadedStates[index] = true; }}
            style={images.length === 1 ? `object-fit: ${objectFit}` : undefined}
          />
          {#if !loadedStates[index]}
            <div class="media-shimmer"></div>
          {/if}
        </div>
        <div class="caption"><span class="caption-text">{@html caption}</span></div>
      </div>
    {/each}
  </div>
</div>

<style>
  .image-grid {
    width: var(--media-width);
    max-width: 100%;
    margin: var(--section-gap) auto;
    padding: 0 1em;
  }

  .image-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    width: 100%;
    align-items: start;
  }

  .image-row.two-image-layout .image-wrapper {
    aspect-ratio: 16 / 9;
    min-height: 0;
  }

  .image-row.two-image-layout .image {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover;
  }

  .image-row.three-image-layout {
    --three-gap: clamp(12px, 2vw, 20px);
    grid-template-columns: minmax(260px, 1fr) minmax(320px, 1fr);
    grid-template-rows: 1fr 1fr;
    max-width: 900px;
    margin: 0 auto;
    column-gap: var(--three-gap);
    row-gap: var(--three-gap);
  }

  .image-row.three-image-layout .image-container {
    display: grid;
    grid-template-rows: 1fr auto;
    min-height: 0;
  }

  .portrait-main {
    grid-row: 1 / span 2;
    align-self: stretch;
    height: 100%;
  }

  .portrait-main .image-wrapper {
    height: 100%;
    min-height: 0;
    aspect-ratio: unset;
  }

  .portrait-main .image {
    height: 100%;
    object-fit: cover;
  }

  .image-row.three-image-layout .caption {
    display: flex;
    align-items: flex-start;
    min-height: 3.9em;
  }

  .image-row.four-image-layout {
    grid-template-columns: repeat(2, minmax(260px, 1fr));
    grid-template-rows: repeat(2, auto);
    max-width: 900px;
    margin: 0 auto;
    gap: 20px;
  }

  .image-row.four-image-layout .image-wrapper {
    aspect-ratio: 16 / 9;
    min-height: 0;
  }

  .image-row.four-image-layout .image {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    object-fit: cover;
  }

  .image-container {
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  .single-image {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
  }

  .single-image .image {
    max-height: calc(100vh - 3em);
    object-fit: cover;
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: var(--radius);
    background: var(--color-surface);
  }

  .image-wrapper:not(:has(.image[width])) {
    min-height: 200px;
  }

  .image-wrapper:has(.image.loaded) {
    min-height: 0;
    background: transparent;
  }

  .image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    border-radius: var(--radius);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    position: relative;
    z-index: 2;
  }

  .image.loaded { opacity: 1; }

  .caption {
    text-align: left;
    font-size: 0.8em;
    margin-top: 8px;
    line-height: 1.3;
    color: var(--caption-color);
  }

  .caption-text {
    display: inline;
    border-left: var(--caption-border) solid var(--caption-accent);
    border-radius: var(--radius);
    padding-left: 8px;
  }

  @media screen and (max-width: 800px) {
    .image-row {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .single-image { width: 100%; max-width: 100%; }

    .image-row.two-image-layout,
    .image-row.three-image-layout,
    .image-row.four-image-layout {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
      max-width: 100%;
      row-gap: 16px;
    }

    .image-row.two-image-layout .image-wrapper,
    .image-row.two-image-layout .image {
      position: static;
      aspect-ratio: unset;
      width: 100%;
      height: auto;
    }

    .image-row.three-image-layout .caption {
      min-height: 0;
    }

    .portrait-main {
      grid-row: auto;
      height: auto;
    }

    .portrait-main .image-wrapper {
      height: auto;
      min-height: 250px;
    }

    .portrait-main .image { height: auto; }

    .image-wrapper { min-height: 250px; }
    .image-wrapper:has(.image.loaded) { min-height: 0; }
  }
</style>
