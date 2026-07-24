<script lang="ts">
  import ScrollyVideo from './ScrollyVideo.svelte';

  interface Props {
    src: string;
    steps?: string[];
    transitionSpeed?: number;
    frameThreshold?: number;
    useWebCodecs?: boolean;
    debug?: boolean;
  }

  let {
    src,
    steps = [],
    transitionSpeed = 12,
    frameThreshold = 0.05,
    useWebCodecs = true,
    debug = false
  }: Props = $props();

  let foreground = $state<HTMLElement | undefined>(undefined);
  let measured = $state<string | null>(null);

  let scrollHeight = $derived(measured ?? `${60 + steps.length * 130}vh`);

  $effect(() => {
    if (!foreground) return;

    const element = foreground;
    const measure = () => {
      measured = `${element.offsetHeight}px`;
    };

    measure();
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  });
</script>

<section class="scrollytelling-container" style="--scroll-height: {scrollHeight}">
  <div class="video-scroll-container">
    <ScrollyVideo {src} {transitionSpeed} {frameThreshold} {useWebCodecs} {debug} />
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
  }

  @media (max-width: 500px) {
    .step {
      justify-content: center;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style>
