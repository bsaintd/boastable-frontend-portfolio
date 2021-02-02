<template>
  <section class="px-3">
    <div class="blue-titlebar pa-2 elevation-1">
      <h3>{{ title }}</h3>
    </div>
    <div class="white pa-3 mb-3 elevation-1">
      <slot/>
    </div>
  </section>
</template>
<script>
export default {
  name: 'BlockContainer',
  props: {
    title: String,
  },
};
</script>
