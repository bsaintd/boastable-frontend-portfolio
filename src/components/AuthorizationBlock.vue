<!--
Component Name: AuthorizationBlock
Description : Displays email address (will eventually do email and password change)
-->
<template>
<section class="px-3">
  <div class="blue-titlebar pa-2 elevation-1">
    <h3>Login Email</h3>
  </div>
  <div class="white pa-3 mb-3 elevation-1">
    <h3>Email</h3>
    <p>{{ email }}</p>
  </div>
</section>
</template>

<script>
export default {
  name: 'AuthorizationBlock',
  computed: {
    email() {
      return this.$store.state.auth.payload.email;
    },
  },
};
</script>
