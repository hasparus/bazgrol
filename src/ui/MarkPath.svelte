<script lang="ts">
  import { getStrokePath, PATH_COMPLETE } from "../lib/drawing";

  import type { Mark } from "../lib/types";

  export let mark: Mark;

  $: points = mark.points;
  $: complete = mark.complete;

  $: d = getStrokePath(points, complete ? PATH_COMPLETE : undefined);
</script>

<path {d} fill={mark.color} />
