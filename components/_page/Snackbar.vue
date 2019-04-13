<template>
  <v-snackbar v-model="show" :timeout="timeout" :color="color" top>
    {{message}}
    <v-btn flat color="cyan" @click.native="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    show: false,
    message: '',
    color: undefined,
    timeout:0
  }),
  created: function () {
    this.$store.watch(state => state.snackbar.snack, () => {
      const msg = this.$store.state.snackbar.snack;
      if (msg !== '') {
        this.show = true;
        this.message = this.$store.state.snackbar.snack;
        this.color = this.$store.state.snackbar.snackColor;
        this.timeout = this.$store.state.snackbar.snackTimeout;
        this.$store.commit('snackbar/setSnack', '');
      }
    })
  }
}
</script>
