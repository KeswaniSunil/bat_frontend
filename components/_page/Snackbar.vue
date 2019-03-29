<template>
  <v-snackbar v-model="show" :color="color" top>
    {{message}}
    <v-btn flat color="accent" @click.native="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    show: false,
    message: '',
    color: undefined
  }),
  created: function () {
    this.$store.watch(state => state.snackbar.snack, () => {
      const msg = this.$store.state.snackbar.snack;
      if (msg !== '') {
        this.show = true;
        this.message = this.$store.state.snackbar.snack;
        this.color = this.$store.state.snackbar.snackColor;
        this.$store.commit('snackbar/setSnack', '');
      }
    })
  }
}
</script>
