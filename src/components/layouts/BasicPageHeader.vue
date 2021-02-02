<template>
  <div class="px-3 py-2 elevation-3 white fixed-titlebar">
    <h1>
      <slot name="page-title"></slot>
    </h1>
  </div>
</template>

<script>
export default {
  name: 'BasicPageHeader',
};
</script>

<style>
.fixed-titlebar {
  width: 100%;
  position: fixed;
  z-index: 1;
}
.fixed-titlebar h1{
    letter-spacing: -.035em;
    font-size: 1.7em;
  }
</style>

