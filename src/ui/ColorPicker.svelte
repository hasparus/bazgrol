<script lang="ts">
  import { onMount } from "svelte";

  import { colors } from "../lib/colors";

  import { drawingStore } from "../lib/drawingStore";

  // prettier-ignore
  const colorShortcuts = [
    '1', '2', '3', '4', '5',
    'q', 'w', 'e', 'r', 't',
    'a', 's', 'd', 'f', 'g',
  ]

  onMount(() => {
    const onKeydown = (event: KeyboardEvent) => {
      const index = colorShortcuts.indexOf(event.key);
      if (index !== -1) {
        drawingStore.dispatch({ t: "SELECTED_COLOR", color: colors[index] });
      }
    };

    window.addEventListener("keydown", onKeydown);
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  });
</script>

<ul>
  {#each colors as color, i (color)}
    <li>
      <button
        aria-label={`Pick color ${colorShortcuts[i]}`}
        class="colorCircle"
        style={`background-color: ${color}`}
        on:click={() => {
          drawingStore.dispatch({ t: "SELECTED_COLOR", color });
        }}
        aria-selected={$drawingStore.currentColor === color}
      >
        {colorShortcuts[i]}
      </button>
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;

    display: flex;
  }

  .colorCircle {
    outline: none;
    cursor: pointer;

    font-family: monospace;
    font-size: 0.75rem;

    width: 32px;
    height: 32px;
    border-radius: 50%;

    color: white;
    border-color: white;
    border-style: solid;
    border-width: 2px;

    opacity: 0.9;
  }

  .colorCircle:hover,
  .colorCircle:focus {
    border-width: 1px;
  }
  .colorCircle:active {
    border-width: 0px;
  }
  .colorCircle[aria-selected="true"] {
    border-width: 0px;
    opacity: 1;
  }
</style>
