<script lang="ts">
  import { onMount } from "svelte";

  import { colors } from "../lib/colors";
  import { currentUserStore, dispatch } from "../lib/stores";

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
        dispatch({ t: "SELECTED_COLOR", color: colors[index] });
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
        class="color-circle"
        style={`background-color: ${color}`}
        on:click={() => {
          dispatch({ t: "SELECTED_COLOR", color });
        }}
        aria-selected={$currentUserStore.currentColor === color}
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

  .color-circle {
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

  .color-circle:hover,
  .color-circle:focus {
    border-width: 1px;
  }
  .color-circle:active {
    border-width: 0px;
  }
  .color-circle[aria-selected="true"] {
    border-width: 0px;
    opacity: 1;
  }
</style>
