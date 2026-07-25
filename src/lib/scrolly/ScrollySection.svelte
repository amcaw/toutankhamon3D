<script lang="ts">
  import ScrollyVideo from './ScrollyVideo.svelte';
  import { isMemoryConstrained } from './utils';

  interface Props {
    src: string;
    poster?: string;
    steps?: string[];
    transitionSpeed?: number;
    frameThreshold?: number;
    useWebCodecs?: boolean;
    debug?: boolean;
  }

  let {
    src,
    poster = '',
    steps = [],
    transitionSpeed = 12,
    frameThreshold = 0.05,
    useWebCodecs = true,
    debug = false
  }: Props = $props();

  let foreground = $state<HTMLElement | undefined>(undefined);
  let section = $state<HTMLElement | undefined>(undefined);
  let measured = $state<string | null>(null);
  let active = $state(false);
  let constrained = $state(false);

  let webCodecs = $derived(useWebCodecs && !constrained);

  $effect(() => {
    constrained = isMemoryConstrained();
  });

  $effect(() => {
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
      },
      { rootMargin: '150% 0px' }
    );

    observer.observe(section);

    return () => observer.disconnect();
  });

  let scrollHeight = $derived(measured ?? `${60 + steps.length * 130}vh`);

  $effect(() => {
    if (!foreground) return;

    const element = foreground;
    let lastWidth = window.innerWidth;

    const measure = () => {
      measured = `${element.offsetHeight}px`;
    };

    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      measure();
    };

    measure();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  });
</script>

<section
  class="scrollytelling-container"
  style="--scroll-height: {scrollHeight}"
  bind:this={section}
>
  <div class="video-scroll-container">
    {#if active}
      <ScrollyVideo
        {src}
        {transitionSpeed}
        {frameThreshold}
        {debug}
        useWebCodecs={webCodecs}
      />
    {:else}
      <div
        class="video-placeholder"
        style={poster ? `background-image: url(${poster})` : undefined}
      ></div>
    {/if}
  </div>

  <div class="foreground" bind:this={foreground}>
    {#each steps as step, index}
      <div class="step" data-step={index}>
        <p class="step-text">{@html step}</p>
      </div>
    {/each}
  </div>
</section>

<style>
  .scrollytelling-container {
    position: relative;
    min-height: 100vh;
  }

  .video-scroll-container {
    height: var(--scroll-height);
    position: relative;
    will-change: transform;
  }

  .video-scroll-container :global([data-scrolly-container]) {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .video-placeholder {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    background-color: #000;
    background-position: center center;
    background-size: cover;
  }

  .foreground {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    pointer-events: none;
    transform: translateZ(0);
    will-change: transform;
  }

  .step {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 130vh;
  }

  .step:first-child {
    margin-top: 60vh;
  }

  .step:last-child {
    margin-bottom: 90vh;
  }

  .step-text {
    margin: 0;
    color: #fff;
    font-weight: 500;
    max-width: 380px;
    border-radius: var(--radius);
    line-height: 150%;
    font-size: calc(24px + 2 * (100vw - 1250px) / 3750);
    text-shadow: 0 1px 12px rgba(0, 0, 0, 0.55);
    pointer-events: auto;
    contain: layout paint;
  }

  @media (max-width: 500px) {
    .step {
      justify-content: center;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style>
