<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    content: string;
    children?: Snippet;
  }

  let { title, content, children }: Props = $props();
</script>

<div class="encadre">
  <div class="encadre-title">{@html title}</div>
  <div class="encadre-content">{@html content}</div>
  {#if children}
    {@render children()}
  {/if}
</div>

<style>
  .encadre {
    position: relative;
    border: 2px solid var(--color-accent);
    border-radius: var(--radius);
    padding: 1em;
    margin: 0.5rem 0;
  }

  .encadre-title {
    position: absolute;
    top: 0;
    left: 1em;
    transform: translateY(-50%);
    z-index: 1;
    background-color: var(--color-bg);
    padding: 0.1em 0.75em;
    line-height: 1.3;
    max-width: calc(100% - 2em);
    font-weight: 700;
  }

  @media screen and (max-width: 768px) {
    .encadre-title {
      font-size: 0.9em;
      left: 0.5em;
      max-width: calc(100% - 1em);
    }
  }
</style>
