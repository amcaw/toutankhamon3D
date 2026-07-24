<script lang="ts">
  import { onMount } from 'svelte';

  interface TextAnnotation {
    id: string;
    type: 'text';
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontWeight: number;
    textAlign: 'left' | 'center' | 'right';
    lineHeight: number;
  }

  interface CircleAnnotation {
    id: string;
    type: 'circle';
    x: number;
    y: number;
    radius: number;
    stroke: string;
    strokeWidth: number;
    fill: string;
    fillOpacity: number;
  }

  interface DotAnnotation {
    id: string;
    type: 'dot';
    x: number;
    y: number;
    radius: number;
    fill: string;
  }

  interface ArrowAnnotation {
    id: string;
    type: 'arrow';
    x: number;
    y: number;
    x2: number;
    y2: number;
    cx: number;
    cy: number;
    stroke: string;
    strokeWidth: number;
  }

  interface LineAnnotation {
    id: string;
    type: 'line';
    x: number;
    y: number;
    x2: number;
    y2: number;
    stroke: string;
    strokeWidth: number;
  }

  interface RectAnnotation {
    id: string;
    type: 'rect';
    x: number;
    y: number;
    w: number;
    h: number;
    stroke: string;
    strokeWidth: number;
    fill: string;
    fillOpacity: number;
  }

  type Annotation = TextAnnotation | CircleAnnotation | DotAnnotation | ArrowAnnotation | LineAnnotation | RectAnnotation;

  interface Props {
    src: string;
    alt?: string;
    annotations: Annotation[];
    width: number;
    height: number;
    caption?: string;
  }

  let { src, alt = '', annotations, width, height, caption }: Props = $props();

  let img = $state<HTMLImageElement>();
  let loaded = $state(false);

  onMount(() => {
    if (img?.complete) loaded = true;
  });
</script>

<div class="media-container">
<div class="image-container" style="max-width: min(100%, calc(85vh * {width} / {height}));">
  <div class="image-wrapper" style="aspect-ratio: {width} / {height};">
    <img
      {src}
      {alt}
      {width}
      {height}
      bind:this={img}
      class:loaded
      decoding="async"
      onload={() => { loaded = true; }}
    />

  <svg
    class="overlay"
    class:loaded
    viewBox="0 0 {width} {height}"
    preserveAspectRatio="xMinYMin meet"
  >
    <defs>
      {#each annotations.filter(a => a.type === 'arrow') as a (a.id)}
        <marker
          id="ah-{a.id}"
          viewBox="0 0 12 12"
          refX="10.5" refY="6"
          markerWidth="6" markerHeight="6"
          markerUnits="strokeWidth"
          orient="auto"
        >
          <path
            d="M 1.5 1 L 10.5 6 L 1.5 11"
            fill="none"
            stroke={a.stroke}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </marker>
      {/each}
    </defs>
    {#each annotations as a (a.id)}
      {#if a.type === 'circle'}
        <circle
          cx={a.x}
          cy={a.y}
          r={a.radius}
          stroke={a.stroke}
          stroke-width={a.strokeWidth}
          fill={a.fill}
          fill-opacity={a.fillOpacity}
        />
      {:else if a.type === 'dot'}
        <circle cx={a.x} cy={a.y} r={a.radius} fill={a.fill} />
      {:else if a.type === 'arrow'}
        <path
          d="M {a.x} {a.y} Q {a.cx} {a.cy} {a.x2} {a.y2}"
          stroke={a.stroke}
          stroke-width={a.strokeWidth}
          stroke-linecap="round"
          fill="none"
          marker-end="url(#ah-{a.id})"
        />
      {:else if a.type === 'line'}
        <line x1={a.x} y1={a.y} x2={a.x2} y2={a.y2} stroke={a.stroke} stroke-width={a.strokeWidth} />
      {:else if a.type === 'rect'}
        <rect x={a.x} y={a.y} width={a.w} height={a.h} stroke={a.stroke} stroke-width={a.strokeWidth} fill={a.fill} fill-opacity={a.fillOpacity} />
      {/if}
    {/each}
  </svg>

  <div class="text-layer" class:loaded>
    {#each annotations as a (a.id)}
      {#if a.type === 'text'}
        <p
          class="text-ann"
          style:left="{(a.x / width) * 100}%"
          style:top="{(a.y / height) * 100}%"
          style:font-size="{(a.fontSize / width) * 100}cqw"
          style:color={a.color}
          style:font-weight={a.fontWeight}
          style:text-align={a.textAlign}
          style:line-height={a.lineHeight}
          style:transform="translate({a.textAlign === 'center' ? '-50%' : a.textAlign === 'right' ? '-100%' : '0'}, {(1 - a.lineHeight) / 2}em)"
        >{a.text}</p>
      {/if}
    {/each}
  </div>

    {#if !loaded}
      <div class="media-shimmer"></div>
    {/if}
  </div>

  {#if caption}
    <div class="caption">{@html caption}</div>
  {/if}
</div>
</div>

<style>
  .image-container {
    width: 100%;
    margin: 0 auto;
  }

  .image-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: var(--radius);
    background: var(--color-surface);
    container-type: inline-size;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: var(--radius);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    position: relative;
    z-index: 2;
  }

  img.loaded {
    opacity: 1;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 3;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .overlay.loaded {
    opacity: 1;
  }

  .text-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 4;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  .text-layer.loaded {
    opacity: 1;
  }

  .text-ann {
    position: absolute;
    margin: 0;
    white-space: pre;
    font-family: 'Montserrat', sans-serif;
    pointer-events: auto;
  }

  .caption {
    text-align: left;
    font-size: 0.8em;
    margin-top: 8px;
    line-height: 1.3;
    color: var(--caption-color);
    border-left: var(--caption-border) solid var(--caption-accent);
    border-radius: var(--radius);
    padding-left: 8px;
  }
</style>
