<div class="separator" role="separator">
  <span class="rule"></span>
  <svg class="ankh" viewBox="0 0 24 38" width="20" height="32" aria-hidden="true">
    <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
      <ellipse cx="12" cy="9" rx="6" ry="7.6" />
      <path d="M12 16.6V35.5" />
      <path d="M3 21h18" />
    </g>
  </svg>
  <span class="rule"></span>
</div>

<style>
  .separator {
    display: flex;
    align-items: center;
    gap: 1.1rem;
    max-width: var(--article-width);
    margin: 3rem auto;
    padding: 0 1em;
    color: var(--color-accent);
  }

  .rule {
    flex: 1;
    height: 1px;
    background-image: linear-gradient(to right, transparent, var(--color-muted));
  }

  .rule:last-child {
    background-image: linear-gradient(to left, transparent, var(--color-muted));
  }

  .ankh {
    flex: none;
    display: block;
  }
</style>
