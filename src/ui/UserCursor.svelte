<script lang="ts">
  import { usersStore } from "../lib/stores/usersStore";

  import type { UserId } from "../lib/userId";
  import PencilPath from "./icons/PencilPath.svelte";
  import PointerPath from "./icons/PointerPath.svelte";
  import IconSvg from "./icons/IconSvg.svelte";

  export let userId: UserId;

  $: user = $usersStore[userId];
</script>

{#if user.cursorPos}
  <IconSvg
    style={`transform: translate3d(calc(${user.cursorPos.x}px - 2px), calc(${user.cursorPos.y}px - 20px), 0)`}
    stroke={user.color}
  >
    {#if user.activity === "pencil"}
      <PencilPath />
    {:else if user.activity === "pointer"}
      <PointerPath />
    {/if}
    <!-- todo: grabbing -->
  </IconSvg>
{/if}

<style>
  svg {
    pointer-events: none;
  }
</style>
