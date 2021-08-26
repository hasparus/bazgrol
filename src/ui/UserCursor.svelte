<script lang="ts">
  import { usersStore } from "../lib/stores/usersStore";

  import type { UserId } from "../lib/userId";

  export let userId: UserId;

  $: user = $usersStore[userId];

  $: {
    console.log(">>", user.cursorPosition);
  }
</script>

{#if user.cursorPosition}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    width="24px"
    height="24px"
    stroke={user.currentColor}
    style={`transform: translate3d(calc(${user.cursorPosition.x}px - 2px), calc(${user.cursorPosition.y}px - 20px), 0)`}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
{/if}

<style>
  svg {
    pointer-events: none;
  }
</style>
