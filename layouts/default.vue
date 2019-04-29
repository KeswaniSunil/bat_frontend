<template>
  <!-- <v-app class="primary login-layout"> -->
  <v-app class="white">
    <snack-bar/>
    <v-content>
      <v-container fluid fill-height>
        <!-- fill-height -->
        <!-- <v-layout align-center justify-center> -->
        <!-- <v-flex xs12 sm8 md4 lg4> -->
        <nuxt/>
        <!-- </v-flex> -->
        <!-- </v-layout> -->
      </v-container>
    </v-content>
  </v-app>
</template>

<style scoped lang="css">
.login-layout {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
</style>
<script>
import SnackBar from "~/components/_page/Snackbar";
export default {
  components: {
    SnackBar
  },
  
  data: () => ({})
};
</script>


<style scoped lang="css">
.login-layout {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
</style>