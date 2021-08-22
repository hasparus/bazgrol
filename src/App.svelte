<script lang="ts">
  import { onMount } from "svelte";

  import { cursor } from "./lib/cursorStore";
  import { drawingStore } from "./lib/drawingStore";
  import { registerEvents } from "./lib/pointer";

  import ColorPicker from "./ui/ColorPicker.svelte";
  import MarkPath from "./ui/MarkPath.svelte";

  const pointer = registerEvents(drawingStore.dispatch);

  onMount(() => {
    const updateCursor = (event: MouseEvent) => {
      $cursor = { x: event.x, y: event.y };
    };

    window.addEventListener("mousemove", updateCursor);

    const clearPointerEvents = pointer.onMount();

    return () => {
      window.removeEventListener("mousemove", updateCursor);

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
    {#each Object.values($drawingStore.marks) as mark (mark.id)}
      <MarkPath {mark} />
    {/each}
    {#each Object.values($drawingStore.users) as user}
      {#if user.currentMark}
        <MarkPath mark={user.currentMark} />
      {/if}
    {/each}
  </svg>
  <pre>
    {JSON.stringify({ x: $cursor.x, y: $cursor.y }, null, 2)}
  </pre>
  <section class="toolbar">
    <ColorPicker />
  </section>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
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

  :global(body) {
    margin: 0;
  }
</style>
