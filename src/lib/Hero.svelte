<script lang="ts">
  interface Credit {
    label: string;
    value: string;
  }

  interface Props {
    title: string;
    description: string;
    image: string;
    imageCredit?: string;
    credits?: Credit[];
  }

  let { title, description, image, imageCredit = '', credits = [] }: Props = $props();
</script>

<section class="hero">
  <div class="wrapper hero__wrapper">
    <div class="hero__content">
      <h1 class="hero__headline">{title}</h1>
      <div class="flow">
        <p class="hero__standfirst">{description}</p>
        {#if credits.length > 0}
          <p class="hero__credits">
            {#each credits as credit, i}
              {credit.label} : {credit.value}{#if i < credits.length - 1}<br />{/if}
            {/each}
          </p>
        {/if}
      </div>
    </div>

    {#if imageCredit}
      <span class="image-credit">{imageCredit}</span>
    {/if}
    <img src={image} alt="" fetchpriority="high" />
  </div>

  <div class="mouse_wheel">
    <div class="anim-scroll">
      <div class="anim-scroll--wheel"></div>
    </div>
  </div>
</section>

<style>
  .hero {
    --gradient-dir: to top;
    position: relative;
    min-height: calc(300px + 15vw);
    display: grid;
  }

  .hero:after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.9;
    background: linear-gradient(var(--gradient-dir), black 0%, rgba(0, 0, 0, 0.995) 8.2%, rgba(0, 0, 0, 0.981) 16%, rgba(0, 0, 0, 0.958) 23.4%, rgba(0, 0, 0, 0.926) 30.4%, rgba(0, 0, 0, 0.885) 37.3%, rgba(0, 0, 0, 0.835) 43.8%, rgba(0, 0, 0, 0.776) 50.2%, rgba(0, 0, 0, 0.709) 56.5%, rgba(0, 0, 0, 0.633) 62.6%, rgba(0, 0, 0, 0.548) 68.7%, rgba(0, 0, 0, 0.455) 74.8%, rgba(0, 0, 0, 0.354) 81%, rgba(0, 0, 0, 0.244) 87.2%, rgba(0, 0, 0, 0.126) 93.5%, rgba(0, 0, 0, 0) 100%) left center/100% no-repeat;
  }

  .hero img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    object-fit: cover;
  }

  @media (min-width: 800px) {
    .hero {
      --gradient-dir: to right;
    }
  }

  .hero__wrapper {
    flex: 1;
    display: grid;
    place-content: end start;
    width: 100%;
    height: 100vh;
    padding-left: 0;
    padding-right: 0;
    margin-top: -5em;
  }

  @media (min-width: 800px) {
    .hero__wrapper {
      place-content: center start;
    }

    .hero__content {
      margin-top: 7em;
    }
  }

  @media (max-width: 550px) {
    .hero__wrapper {
      place-content: center start;
    }

    .mouse_wheel {
      margin-top: -10em;
    }
  }

  .hero__content {
    flex: 1;
    z-index: 2;
    padding: 1rem clamp(1rem, 4vw, 2rem);
    max-width: 34ch;
  }

  .hero__content p {
    color: #fff;
  }

  .hero__headline {
    color: #fff;
    font-size: clamp(2rem, 7vw, 4rem);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.015em;
    text-wrap: balance;
    margin: 0;
  }

  .hero__standfirst {
    font-size: clamp(1.0625rem, 2.6vw, 1.5rem);
    font-weight: 300;
    line-height: 1.45;
    text-wrap: pretty;
    margin: 0;
  }

  .hero__credits {
    font-size: clamp(0.75rem, 1.6vw, 0.875rem);
    font-weight: 300;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.72);
    margin: clamp(2rem, 6vh, 4rem) 0 0;
  }

  .flow {
    margin-top: clamp(1.25rem, 3.5vh, 2.25rem);
  }

  .flow > * + * {
    margin-top: var(--flow-space, 1rem);
  }

  @media (min-width: 800px) {
    .hero__content {
      max-width: 40ch;
    }
  }

  .wrapper {
    max-width: 1170px;
    margin-left: auto;
    margin-right: auto;
  }

  .mouse_wheel {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1em;
    z-index: 1;
  }

  .anim-scroll {
    border: 2px solid #fff;
    border-radius: 22px;
    height: 40px;
    position: relative;
    width: 20px;
    z-index: 1;
  }

  .anim-scroll--wheel {
    animation: scroll 2.5s ease infinite;
    background: #fff;
    border-radius: 30px;
    height: 8px;
    left: calc(50% - 1.5px);
    position: absolute;
    right: 50%;
    top: 8px;
    width: 3px;
  }

  @keyframes scroll {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(16px);
    }
    51% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .anim-scroll--wheel {
      animation: none;
    }
  }

  .image-credit {
    color: #fff;
    display: inline-block;
    font-size: 11px;
    font-weight: 300;
    padding: 5px 8px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 3;
  }
</style>
