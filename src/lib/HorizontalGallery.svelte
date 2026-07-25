<script lang="ts">
  interface Slide {
    src: string;
    caption: string;
    alt?: string;
    width?: number;
    height?: number;
  }

  interface Props {
    slides?: Slide[];
  }

  let { slides = [] }: Props = $props();

  let maxAspect = $derived(
    slides.reduce((max, slide) => Math.max(max, (slide.width ?? 4) / (slide.height ?? 3)), 0.1)
  );

  let spaceHolder = $state<HTMLElement | undefined>(undefined);
  let sticky = $state<HTMLElement | undefined>(undefined);
  let horizontal = $state<HTMLElement | undefined>(undefined);

  $effect(() => {
    if (!spaceHolder || !sticky || !horizontal) return;

    const holder = spaceHolder;
    const track = horizontal;
    const pin = sticky;

    const setHeight = () => {
      const travel = track.scrollWidth - window.innerWidth + window.innerWidth / 2;
      holder.style.height = `${Math.max(travel, 0) + window.innerHeight}px`;
    };

    const onScroll = () => {
      track.style.transform = `translateX(-${pin.offsetTop}px)`;
    };

    setHeight();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', setHeight);

    const observer = new ResizeObserver(setHeight);
    observer.observe(track);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', setHeight);
      observer.disconnect();
    };
  });
</script>

<section class="container">
  <div class="space-holder" bind:this={spaceHolder}>
    <div class="sticky" bind:this={sticky}>
      <div class="horizontal" bind:this={horizontal}>
        <section role="feed" class="cards" style="--max-aspect: {maxAspect}">
          {#each slides as slide}
            <figure
              class="card"
              style="--aspect: {(slide.width ?? 4) / (slide.height ?? 3)}"
            >
              <img
                src={slide.src}
                alt={slide.alt ?? ''}
                width={slide.width}
                height={slide.height}
                loading="lazy"
                decoding="async"
              />
              <figcaption>{@html slide.caption}</figcaption>
            </figure>
          {/each}
        </section>
      </div>
    </div>
  </div>
</section>

<style>
  .container {
    position: relative;
    width: 100%;
    min-height: 100vh;
  }

  .space-holder {
    position: relative;
    width: 100%;
  }

  .sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  .horizontal {
    position: absolute;
    height: 100vh;
    will-change: transform;
  }

  .cards {
    --card-width-limit: 80vw;
    --card-height: min(48vh, 440px, calc(var(--card-width-limit) / var(--max-aspect)));
    --caption-space: 7rem;
    position: relative;
    height: 100%;
    padding: calc((100vh - var(--card-height) - var(--caption-space)) / 2) 0 0 150px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: calc(var(--card-height) * var(--aspect));
    margin: 0 75px 0 0;
    flex-shrink: 0;
  }

  .card img {
    width: 100%;
    height: var(--card-height);
    max-height: none;
    object-fit: cover;
    border-radius: var(--radius);
  }

  figcaption {
    width: 100%;
    max-width: 100%;
    color: var(--color-muted);
    font-size: 0.85rem;
    line-height: 1.35;
    text-align: left;
    margin-top: 0.75rem;
  }

  @media (max-width: 800px) {
    .cards {
      padding-left: 20px;
    }

    .cards {
      --card-width-limit: 86vw;
      --card-height: min(40vh, 340px, calc(var(--card-width-limit) / var(--max-aspect)));
      --caption-space: 9rem;
    }

    .card {
      margin-right: 40px;
    }

    figcaption {
      font-size: 0.8rem;
    }
  }
</style>
