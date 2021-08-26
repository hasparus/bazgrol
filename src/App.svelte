<script lang="ts">
  import { onMount } from "svelte";

  import { dispatch, marksStore, usersStore } from "./lib/stores";
  import { registerEvents } from "./lib/user-events";

  import ColorPicker from "./ui/ColorPicker.svelte";
  import MarkPath from "./ui/MarkPath.svelte";
  import UserCursors from "./ui/UserCursors.svelte";
  import UsersList from "./ui/UsersList.svelte";

  const pointer = registerEvents(dispatch);

  onMount(() => {
    const clearPointerEvents = pointer.onMount();

    return () => {
      clearPointerEvents();
    };
  });
</script>

<main>
  <svg
    on:pointerdown={pointer.onPointerDown}
    on:pointermove={pointer.onPointerMove}
    on:pointerup={pointer.onPointerUp}
    on:touchstart={pointer.onTouch}
    on:touchmove={pointer.onTouch}
    on:touchend={pointer.onTouch}
  >
    {#each Object.values($marksStore) as mark (mark.id)}
      <MarkPath {mark} />
    {/each}
    {#each Object.values($usersStore) as user}
      {#if user.currentMark}
        <MarkPath mark={user.currentMark} />
      {/if}
    {/each}
  </svg>
  <UserCursors />
  <pre>
    <!--  -->
  </pre>
  <section class="toolbar">
    <ColorPicker />
  </section>
  <div class="top-right">
    <UsersList />
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

    overflow: hidden;
  }

  pre {
    font-family: monospace;

    position: absolute;
    pointer-events: none;
    user-select: none;
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    touch-action: none;

    cursor: none;
  }

  .toolbar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4em;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .top-right {
    position: absolute;
    top: 0;
    right: 0;
  }

  :global(body) {
    margin: 0;
  }
</style>
