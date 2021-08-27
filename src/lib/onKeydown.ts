import { onMount } from "svelte";

export function onKeydown(handler: (event: KeyboardEvent) => void) {
  onMount(() => {
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  });
}
