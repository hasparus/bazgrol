<script lang="ts">
  import { getStrokePath, PATH_COMPLETE } from "../lib/drawing";

  import { NumberDict } from "../lib/types";
  import type { Mark } from "../lib/types";

  export let mark: Mark;

  $: points = mark.points;
  $: complete = mark.complete;

  $: {
    console.log({ mark, points });
  }

  $: d = getStrokePath(
    NumberDict.toArray(points),
    complete ? PATH_COMPLETE : undefined
  );
</script>

<path {d} fill={mark.color} />
