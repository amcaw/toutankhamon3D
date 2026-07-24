<script lang="ts">
  import Share from './Share.svelte';
  import { typo } from '$lib/typo';

  interface Props {
    category?: string;
    title: string;
    journalists?: string[];
    developers?: string[];
    date?: string;
    url?: string;
  }

  let {
    category = '',
    title,
    journalists = [],
    developers = [],
    date = '',
    url = ''
  }: Props = $props();

  function joinNames(names: string[]): string {
    if (names.length <= 1) return names[0] ?? '';
    return names.slice(0, -1).join(', ') + ' et ' + names[names.length - 1];
  }
</script>

<div class="article">
  <div id="headline-container">
    <div class="headline-wrapper">
      <div class="article-block headline">
        <header class="relative">
          {#if category}
            <div class="pre-title">{category}</div>
          {/if}
          <div class="title-wrap">
            <h1 class="text-3xl">{@html typo(title)}</h1>
          </div>
          <div class="article-block byline-container">
            <aside class="article-metadata">
              {#if journalists.length > 0}
                <div class="byline body-caption">
                  {journalists.length > 1 ? 'Journalistes' : 'Journaliste'}&nbsp;: <span class="author-name">{joinNames(journalists)}</span>
                </div>
              {/if}
              {#if developers.length > 0}
                <div class="byline body-caption">
                  Développement web&nbsp;: <span class="author-name">{joinNames(developers)}</span>
                </div>
              {/if}
              {#if date}
                <div class="dateline body-caption"><p>{date}</p></div>
              {/if}
            </aside>
          </div>
        </header>
      </div>
    </div>
  </div>

  <Share {url} />
</div>

<style>
  .headline-wrapper {
    display: contents;
  }

  .article-block {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .headline {
    margin-top: 1.75rem;
  }

  .pre-title {
    text-transform: uppercase;
    font-weight: bold;
    margin: 1rem 0;
    color: var(--color-accent);
  }

  .text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

  .byline-container {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .byline {
    margin-bottom: 0.25rem;
  }

  .body-caption {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .author-name {
    text-decoration: none;

    font-weight: bold;
  }
</style>
