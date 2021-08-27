<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { colors } from "../lib/colors";
  import { currentUserStore, dispatch } from "../lib/stores";
  import { onKeydown } from "../lib/onKeydown";

  import ToolbarButton from "./ToolbarButton.svelte";

  // prettier-ignore
  const colorShortcuts = [
    '1', '2', '3', '4', '5',
    'q', 'w', 'e', 'r', 't',
    'a', 's', 'd', 'f', 'g',
  ]

  const dispatchEvent = createEventDispatcher();

  onKeydown((event: KeyboardEvent) => {
    const index = colorShortcuts.indexOf(event.key);
    if (index !== -1) {
      dispatch({ t: "SELECTED_COLOR", color: colors[index] });
    }
  });
</script>

<ul class="color-picker">
  {#each colors as color, i (color)}
    <li>
      <button
        aria-label={`pick color ${colorShortcuts[i]}`}
        class="color-circle"
        style={`background-color: ${color}`}
        on:click={() => {
          dispatch({ t: "SELECTED_COLOR", color });
        }}
        aria-selected={$currentUserStore.color === color}
      >
        {colorShortcuts[i]}
      </button>
    </li>
  {/each}
  <ToolbarButton
    aria-label="return to toolbar"
    class="back-to-toolbar"
    on:click={() => dispatchEvent("close")}
    shortcut="Esc"
  >
    T
  </ToolbarButton>
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

  .color-picker :global(.back-to-toolbar) {
    margin-left: 4px;
  }
</style>
