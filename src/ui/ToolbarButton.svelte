<script lang="ts">
  import ShortcutText from "./ShortcutText.svelte";

  export let shortcut: string;
</script>

<button on:click {...$$props}>
  <slot />
  <ShortcutText>{shortcut}</ShortcutText>
</button>

<style lang="scss">
  button {
    cursor: pointer;
    outline-color: skyblue;

    font-family: monospace;
    font-size: 0.75rem;

    width: 32px;
    height: 32px;
    border-radius: 4px;

    color: black;

    background-color: #f3f4f6;

    position: relative;
    overflow: visible;

    :global(svg) {
      opacity: 0.8;
    }
  }

  button:hover,
  button:focus {
    background-color: #e5e7eb;

    :global(svg) {
      opacity: 0.9;
    }
  }
  button:active {
    border-width: 0px;
  }
  button[aria-selected="true"] {
    border-width: 0px;
    opacity: 1;

    background-color: #e5e7eb;
  }
</style>
