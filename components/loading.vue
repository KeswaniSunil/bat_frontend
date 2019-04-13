<template>
  <div class="loading-page body-background" v-if="loading">
    <v-layout align-center justify-center>
      <v-progress-circular
        :size="60"
        :width="5"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-layout>
  </div>
</template>

<script>
export default {
  layout:'dashboard',
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  z-index:2;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items:center;
}
</style>