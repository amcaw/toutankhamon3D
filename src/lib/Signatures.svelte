<script lang="ts">
  interface Credits {
    label: string;
    names: string[];
  }

  interface Props {
    credits: Credits[];
  }

  let { credits }: Props = $props();
</script>

<div class="signature-container">
  {#each credits as group, i}
    {#if i > 0}
      <div class="signature-divider"></div>
    {/if}
    <div
      class="signature-section"
      class:left={credits.length > 1 && i === 0}
      class:right={credits.length > 1 && i === credits.length - 1}
    >
      <h6 class="signature-author">{group.label}</h6>
      {#each group.names as name}
        <p class="signature-description">{name}</p>
      {/each}
    </div>
  {/each}
</div>

<style>
  .signature-container {
    display: flex;
    justify-content: center;
    align-items: stretch;
    margin: 0 auto;
    padding: 20px 0;
    width: 100%;
    max-width: 600px;
    position: relative;
    margin-bottom: 50px;
  }

  .signature-section {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    padding: 0 20px;
    align-items: center;
    text-align: center;
  }

  .signature-section.left {
    align-items: flex-end;
    text-align: right;
  }

  .signature-section.right {
    align-items: flex-start;
    text-align: left;
  }

  .signature-author {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-accent);
    margin: 0 0 4px 0;
  }

  .signature-description {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
  }

  .signature-divider {
    width: 1px;
    align-self: stretch;
    background-color: var(--color-accent);
  }

  @media (max-width: 480px) {
    .signature-author {
      font-size: 0.7rem;
    }

    .signature-description {
      font-size: 0.65rem;
    }

    .signature-section {
      padding: 0 10px;
    }
  }
</style>
