<script lang="ts">
  import { userIdsStore } from "../lib/stores/usersStore";

  import UserCursor from "./UserCursor.svelte";
</script>

{#each $userIdsStore as id}
  <UserCursor userId={id} />
{/each}
