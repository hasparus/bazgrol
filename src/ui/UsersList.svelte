<script lang="ts">
  import { usersStore, UserState } from "../lib/stores";
  import { userId } from "../lib/userId";

  type UserListItemData = {
    color: UserState["color"];
  };

  let currentUser: UserListItemData = {
    color: UserState.get().color,
  };
  let otherUsers: UserListItemData[] = [];

  $: {
    for (const [key, userData] of Object.entries($usersStore)) {
      const user = { color: userData.color };

      if (key === userId) {
        currentUser = user;
      } else {
        otherUsers.push(user);
      }
    }
  }
</script>

<ul>
  <!-- todo: name (currently selected tool / pointer : color) -->
  <li>
    <div
      class="current-color-marker"
      style={`background-color: ${currentUser.color}`}
    />
  </li>
  {#each otherUsers as user}
    <li>
      <div
        class="current-color-marker"
        style={`background-color: ${user.color}`}
      />
    </li>
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    padding: 1em;

    font-size: 0.75em;
  }

  li:not(:first-of-type) {
    margin-top: 0.25em;
  }

  .current-color-marker {
    border-radius: 50%;
    width: 0.75em;
    height: 0.75em;
  }
</style>
