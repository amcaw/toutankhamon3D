<script>
  import { onMount, onDestroy } from 'svelte';
  import ScrollyVideo from './ScrollyVideo.js';

  // Props with defaults
  export let src = undefined;
  export let videoPercentage = undefined;
  export let cover = true;
  export let sticky = true;
  export let full = true;
  export let trackScroll = true;
  export let lockScroll = true;
  export let transitionSpeed = 8;
  export let frameThreshold = 0.1;
  export let useWebCodecs = true;
  export let onReady = () => {};
  export let onChange = () => {};
  export let debug = false;

  let scrollyVideoContainer;
  let scrollyVideo;

  // Track previous props for efficient diffing
  let prevProps = {
    src,
    cover,
    sticky,
    full,
    trackScroll,
    lockScroll,
    transitionSpeed,
    frameThreshold,
    useWebCodecs,
    debug,
  };

  // Props that require full recreation
  const RECREATE_PROPS = ['src', 'useWebCodecs', 'trackScroll'];

  // Props that can be hot-updated
  const UPDATABLE_PROPS = ['transitionSpeed', 'frameThreshold', 'debug'];

  // Initialize ScrollyVideo directly on mount
  onMount(() => {
    if (!scrollyVideoContainer) return;

    try {
      scrollyVideo = new ScrollyVideo({
        src,
        scrollyVideoContainer,
        cover,
        sticky,
        full,
        trackScroll,
        lockScroll,
        transitionSpeed,
        frameThreshold,
        useWebCodecs,
        onReady,
        onChange,
        debug,
      });
    } catch (e) {
      console.error('ScrollyVideo initialization failed:', e);
    }
  });

  // Efficient prop diffing - only react to actual changes
  $: {
    if (scrollyVideo && scrollyVideoContainer) {
      const currentProps = {
        src,
        cover,
        sticky,
        full,
        trackScroll,
        lockScroll,
        transitionSpeed,
        frameThreshold,
        useWebCodecs,
        debug,
      };

      // Check if any props changed
      const changedProps = Object.keys(currentProps).filter(
        (key) => currentProps[key] !== prevProps[key]
      );

      if (changedProps.length > 0) {
        const needsRecreate = changedProps.some((prop) =>
          RECREATE_PROPS.includes(prop)
        );

        if (needsRecreate) {
          // Only recreate if critical props changed
          scrollyVideo.destroy();
          try {
            scrollyVideo = new ScrollyVideo({
              src,
              scrollyVideoContainer,
              cover,
              sticky,
              full,
              trackScroll,
              lockScroll,
              transitionSpeed,
              frameThreshold,
              useWebCodecs,
              onReady,
              onChange,
              debug,
            });
          } catch (e) {
            console.error('ScrollyVideo recreation failed:', e);
          }
        } else {
          // Hot-update props that don't need recreation
          changedProps.forEach((prop) => {
            if (UPDATABLE_PROPS.includes(prop)) {
              scrollyVideo[prop] = currentProps[prop];
            }
          });
        }

        prevProps = { ...currentProps };
      }
    }
  }

  // Separate reactive block for videoPercentage (performance critical)
  // Using $: with simple condition is faster than nested in complex reactive block
  $: if (
    scrollyVideo &&
    typeof videoPercentage === 'number' &&
    videoPercentage >= 0 &&
    videoPercentage <= 1
  ) {
    scrollyVideo.setVideoPercentage(videoPercentage);
  }

  // Export methods
  export function setVideoPercentage(...args) {
    if (scrollyVideo) {
      scrollyVideo.setVideoPercentage(...args);
    }
  }

  // Cleanup
  onDestroy(() => {
    if (scrollyVideo?.destroy) {
      scrollyVideo.destroy();
      scrollyVideo = null;
    }
  });
</script>

<div bind:this={scrollyVideoContainer} data-scrolly-container></div>
