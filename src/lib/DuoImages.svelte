<script lang="ts">
  interface Image {
    src: string;
    alt?: string;
    width: number;
    height: number;
    caption?: string;
  }

  interface Props {
    images: Image[];
    caption?: string;
  }

  let { images, caption = '' }: Props = $props();

  let totalAspect = $derived(images.reduce((sum, image) => sum + image.width / image.height, 0));
</script>

<div class="media-container">
  <div class="duo">
    <div class="duo-row" style="--total-aspect: {totalAspect}">
      {#each images as image}
        <figure class="duo-item" style="--aspect: {image.width / image.height}">
          <img
            src={image.src}
            alt={image.alt ?? image.caption ?? ''}
            width={image.width}
            height={image.height}
            loading="lazy"
            decoding="async"
          />
          {#if image.caption}
            <figcaption><span class="caption-text">{@html image.caption}</span></figcaption>
          {/if}
        </figure>
      {/each}
    </div>

    {#if caption}
      <p class="shared-caption"><span class="caption-text">{@html caption}</span></p>
    {/if}
  </div>
</div>

<style>
  .duo-row {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    max-width: calc(var(--media-max-height) * var(--total-aspect));
    margin: 0 auto;
  }

  .duo-item {
    flex: var(--aspect);
    min-width: 0;
    width: auto;
  }

  .duo-item img {
    width: 100%;
    height: auto;
    max-height: none;
  }

  .shared-caption {
    text-align: left;
    margin: 0.75rem 0 0;
    font-size: 0.8em;
    line-height: 1.3;
    color: var(--caption-color);
  }

  @media screen and (max-width: 800px) {
    .duo-row {
      flex-direction: column;
      gap: 16px;
      max-width: 100%;
    }

    .duo-item {
      flex: none;
      width: 100%;
    }
  }
</style>
