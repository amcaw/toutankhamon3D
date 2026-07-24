<script lang="ts">
  interface Props {
    src: string;
    alt?: string;
    width: number;
    height: number;
    caption?: string;
    mobileSrc?: string;
    mobileMedia?: string;
    eager?: boolean;
  }

  let {
    src,
    alt = '',
    width,
    height,
    caption = '',
    mobileSrc = '',
    mobileMedia = '(max-width: 549px)',
    eager = false
  }: Props = $props();
</script>

<div class="media-container">
  <figure class="figure" style="--aspect: {width / height}">
    {#if mobileSrc}
      <picture>
        <source media={mobileMedia} srcset={mobileSrc} />
        <img
          {src}
          {alt}
          {width}
          {height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </picture>
    {:else}
      <img {src} {alt} {width} {height} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    {/if}

    {#if caption}
      <figcaption><span class="caption-text">{@html caption}</span></figcaption>
    {/if}
  </figure>
</div>

<style>
  .figure {
    width: min(100%, calc(var(--media-max-height) * var(--aspect)));
    margin: 0 auto;
    align-items: stretch;
  }

  .figure :global(picture) {
    display: block;
  }

  .figure img {
    width: 100%;
  }
</style>
