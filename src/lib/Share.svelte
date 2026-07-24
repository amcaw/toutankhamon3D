<script lang="ts">
  interface Props {
    url?: string;
    compact?: boolean;
    size?: number;
  }

  let { url = '', compact = false, size = 30 }: Props = $props();

  let shareUrl = $derived(url || (typeof window !== 'undefined' ? window.location.href : ''));

  let facebook = $derived(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  let twitter  = $derived(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareUrl)}`);
  let linkedin = $derived(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareUrl)}+%23NewPost`);
  let whatsapp = $derived(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`);
</script>

<div class="share" class:compact>
  <a href={facebook} rel="noreferrer" target="_blank" aria-label="Share on Facebook">
    <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="share-logo" aria-hidden="true">
      <path fill="currentColor" d="M10 .4C4.698.4.4 4.698.4 10s4.298 9.6 9.6 9.6s9.6-4.298 9.6-9.6S15.302.4 10 .4m2.274 6.634h-1.443c-.171 0-.361.225-.361.524V8.6h1.805l-.273 1.486H10.47v4.461H8.767v-4.461H7.222V8.6h1.545v-.874c0-1.254.87-2.273 2.064-2.273h1.443z"/>
    </svg>
  </a>
  <a href={twitter} rel="noreferrer" target="_blank" aria-label="Share on X (Twitter)">
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="share-logo" aria-hidden="true">
      <path fill="currentColor" d="M8 2H1l8.26 11.015L1.45 22H4.1l6.388-7.349L16 22h7l-8.608-11.478L21.8 2h-2.65l-5.986 6.886zm9 18L5 4h2l12 16z"/>
    </svg>
  </a>
  <a href={linkedin} rel="noreferrer" target="_blank" aria-label="Share on LinkedIn">
    <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="share-logo" aria-hidden="true">
      <path fill="currentColor" d="M10 .4C4.698.4.4 4.698.4 10s4.298 9.6 9.6 9.6s9.6-4.298 9.6-9.6S15.302.4 10 .4M7.65 13.979H5.706V7.723H7.65zm-.984-7.024c-.614 0-1.011-.435-1.011-.973c0-.549.409-.971 1.036-.971s1.011.422 1.023.971c0 .538-.396.973-1.048.973m8.084 7.024h-1.944v-3.467c0-.807-.282-1.355-.985-1.355c-.537 0-.856.371-.997.728c-.052.127-.065.307-.065.486v3.607H8.814v-4.26c0-.781-.025-1.434-.051-1.996h1.689l.089.869h.039c.256-.408.883-1.01 1.932-1.01c1.279 0 2.238.857 2.238 2.699z"/>
    </svg>
  </a>
  <a href={whatsapp} rel="noreferrer" target="_blank" aria-label="Share on WhatsApp">
    <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="share-logo" aria-hidden="true">
      <path fill="currentColor" d="M13.95 4.24C11.86 1 7.58.04 4.27 2.05C1.04 4.06 0 8.44 2.09 11.67l.17.26l-.7 2.62l2.62-.7l.26.17c1.13.61 2.36.96 3.58.96c1.31 0 2.62-.35 3.75-1.05c3.23-2.1 4.19-6.39 2.18-9.71Zm-1.83 6.74c-.35.52-.79.87-1.4.96c-.35 0-.79.17-2.53-.52c-1.48-.7-2.71-1.84-3.58-3.15c-.52-.61-.79-1.4-.87-2.19c0-.7.26-1.31.7-1.75c.17-.17.35-.26.52-.26h.44c.17 0 .35 0 .44.35c.17.44.61 1.49.61 1.58c.09.09.05.76-.35 1.14c-.22.25-.26.26-.17.44c.35.52.79 1.05 1.22 1.49c.52.44 1.05.79 1.66 1.05c.17.09.35.09.44-.09c.09-.17.52-.61.7-.79c.17-.17.26-.17.44-.09l1.4.7c.17.09.35.17.44.26c.09.26.09.61-.09.87Z"/>
    </svg>
  </a>
</div>

{#if !compact}
  <p class="sep-line">—</p>
{/if}

<style>
  .share {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 1em;
    padding-top: 1em;
  }

  .share.compact {
    margin-top: 0;
    padding-top: 0;
    gap: 4px;
  }

  .share-logo {
    display: block;
    color: var(--color-text);
    transition: opacity 0.15s;
  }

  a:hover .share-logo {
    opacity: 0.6;
  }

  .sep-line {
    text-align: center;
  }
</style>
