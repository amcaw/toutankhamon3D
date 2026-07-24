<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    src?: string;
    caption?: string;
    placeholder?: string;
    poster?: string;
    width?: number;
    height?: number;
  }

      let { src = '', caption = '', placeholder = '', poster = '', width = 0, height = 0 }: Props = $props();
  let effectivePlaceholder = $derived(placeholder || poster);

        let measuredRatio = $state('');
  let ratio = $derived(width && height ? `${width} / ${height}` : measuredRatio || '16 / 9');

  let video = $state<HTMLVideoElement>();
  let observer: IntersectionObserver | undefined;
  let isLoading = $state(true);
  let isError = $state(false);

  function handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0.5 && video && !isError) {
        playVideo();
      } else {
        if (video) video.pause();
      }
    });
  }

  function playVideo() {
    if (!video || !src) return;
    setTimeout(() => {
      if (!video) return;
      video.play().catch(() => {});
    }, 100);
  }

  function handleLoadedMetadata() {
    isLoading = false;
    isError = false;
    if (!(width && height) && video?.videoWidth && video?.videoHeight) {
      measuredRatio = `${video.videoWidth} / ${video.videoHeight}`;
    }
  }

  function handleError() {
    isLoading = false;
    isError = true;
  }

  onMount(() => {
    if (!video) return;

    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      });
      observer.observe(video);
    }

        if (video.readyState >= 1) isLoading = false;

    return () => {
      if (observer) observer.disconnect();
    };
  });
</script>

<div class="container media-container">
  <div class="report" style="aspect-ratio: {ratio};">
    {#if isLoading}
      <div class="placeholder-wrap">
        {#if effectivePlaceholder}
          <img src={effectivePlaceholder} alt="" />
        {:else}
          <div class="default-placeholder">
            <div class="loading-spinner"></div>
          </div>
        {/if}
      </div>
    {/if}

    <video
      playsinline
      autoplay
      preload="metadata"
      muted
      loop
      src={src}
      poster={poster || undefined}
      bind:this={video}
      class:hidden={isLoading}
      onloadedmetadata={handleLoadedMetadata}
      onerror={handleError}
    >
    </video>

    {#if isError}
      <div class="error-message">
        Problème de chargement de la vidéo.
        <button onclick={() => window.location.reload()}>Recharger</button>
      </div>
    {/if}
  </div>

  {#if caption}
    <div class="caption"><span class="caption-text">{@html caption}</span></div>
  {/if}
</div>

<style>

  .report {
    width: 100%;
    display: grid;
    max-height: calc(100vh - 3em);
  }

  video {
    grid-area: 1 / 1;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: var(--radius);
    pointer-events: none;
    display: block;
    transition: opacity 0.3s ease-in-out;
  }

  .hidden {
    opacity: 0;
    pointer-events: none;
  }

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

  .placeholder-wrap {
    grid-area: 1 / 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-surface);
    border-radius: var(--radius);
    z-index: 1;
  }

  .placeholder-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius);
  }

  .default-placeholder {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-surface);
    border-radius: var(--radius);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: var(--color-text);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .error-message {
    grid-area: 1 / 1;
    place-self: center;
    background-color: rgba(200, 0, 0, 0.8);
    color: white;
    padding: 10px 15px;
    border-radius: var(--radius);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .error-message button {
    padding: 5px 10px;
    background-color: white;
    color: red;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

</style>
