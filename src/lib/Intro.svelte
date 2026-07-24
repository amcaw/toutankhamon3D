<script lang="ts">
  import { typoAction } from '$lib/typo';

  let { children } = $props();
</script>

<div class="article" use:typoAction>
  {@render children?.()}
</div>
