<script lang="ts">
  export let style: string | undefined = undefined;
  export let stroke: string = "black";
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  width="24px"
  height="24px"
  stroke-linecap="round"
  stroke-linejoin="round"
  stroke-width="2"
  {style}
  {stroke}
  {...$$props}
>
  <slot />
</svg>
