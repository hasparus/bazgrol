<script lang="ts">
  import { onKeydown } from "../lib/onKeydown";

  import { currentUserStore, dispatch } from "../lib/stores";
  import type { UserActivity } from "../lib/stores";

  import ColorPicker from "./ColorPicker.svelte";
  import IconSvg from "./icons/IconSvg.svelte";
  import PencilPath from "./icons/PencilPath.svelte";
  import PointerPath from "./icons/PointerPath.svelte";

  import ToolbarButton from "./ToolbarButton.svelte";

  type ToolbarState = "toolbar" | "color-picker";
  let state: ToolbarState = "toolbar";

  $: currentColor = $currentUserStore.color;
  $: activity = $currentUserStore.activity;

  const shortcuts: Record<string, UserActivity | ToolbarState> = {
    1: "pointer",
    2: "pencil",
    c: "color-picker",
    Escape: "toolbar",
  };

  onKeydown((event: KeyboardEvent) => {
    const key = event.key;
    const action = shortcuts[key];
    if (action) {
      switch (action) {
        case "pencil":
        case "pointer":
          if (state !== "color-picker") {
            dispatch({ t: "SET_ACTIVITY", activity: action });
          }
          break;
        case "color-picker":
        case "toolbar":
          state = action;
          break;
      }
    }
  });
</script>

<section class="toolbar">
  {#if state === "toolbar"}
    <ul>
      <li>
        <ToolbarButton
          on:click={() => dispatch({ t: "SET_ACTIVITY", activity: "pointer" })}
          shortcut="1"
          aria-label="pick pointer"
          aria-selected={activity === "pointer"}
        >
          <IconSvg>
            <PointerPath />
          </IconSvg>
        </ToolbarButton>
      </li>
      <li>
        <ToolbarButton
          on:click={() => dispatch({ t: "SET_ACTIVITY", activity: "pencil" })}
          aria-label="pick pencil"
          aria-selected={activity === "pencil"}
          shortcut="2"
        >
          <IconSvg>
            <PencilPath />
          </IconSvg>
        </ToolbarButton>
      </li>
      <li>
        <ToolbarButton
          on:click={() => (state = "color-picker")}
          aria-label="open color picker"
          class="color-picker-button"
          shortcut="c"
        >
          <div
            class="color-circle"
            style={`background-color: ${currentColor};`}
          />
        </ToolbarButton>
      </li>
    </ul>
  {:else if state === "color-picker"}
    <ColorPicker on:close={() => (state = "toolbar")} />
  {/if}
</section>

<style lang="scss">
  .toolbar {
    position: absolute;
    bottom: 1em;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 5px;
    padding: 4px;

    background: white;
    box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.09),
      0px 2px 4px -1px rgba(0, 0, 0, 0.05);
    border: 1px solid #f3f4f6;
  }

  ul {
    list-style: none;

    display: flex;

    gap: 4px;
  }

  .toolbar :global(.color-picker-button) {
    background-color: transparent;
  }
  .color-circle {
    border-radius: 50%;
    width: 24px;
    height: 24px;
    margin: auto;
  }
</style>
