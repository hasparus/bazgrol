<script lang="ts">
  import { usersStore } from "../lib/stores/usersStore";

  import type { UserId } from "../lib/userId";
  import { userId as viewerId } from "../lib/userId";
  import PencilPath from "./icons/PencilPath.svelte";
  import ViewerPointerCursorPath from "./ViewerPointerCursorPath.svelte";
  import IconSvg from "./icons/IconSvg.svelte";
  import PointerPath from "./icons/PointerPath.svelte";

  export let userId: UserId;

  $: user = $usersStore[userId];

  const isViewer = userId === viewerId;
</script>

{#if user.cursorPos}
  <IconSvg
    style={`transform: translate3d(calc(${user.cursorPos.x}px - 2px), calc(${user.cursorPos.y}px - 20px), 0);` +
      "overflow: visible;" +
      "pointer-events: none;"}
    stroke={user.color}
    class="UserCursor-cursor"
  >
    {#if user.activity === "pencil"}
      <PencilPath />
    {:else if user.activity === "pointer"}
      <svg x="-5" y="12">
        {#if isViewer}
          <ViewerPointerCursorPath />
        {:else}
          <PointerPath />
        {/if}
      </svg>
    {/if}
    <!-- todo: grabbing -->
  </IconSvg>
{/if}
