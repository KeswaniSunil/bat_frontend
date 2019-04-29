<style scoped lang="css">
.login-page {
  width: 100%;
  display: flex;
}
.left-img {
  /* width: 100%; */
  width: 80%;
  height: auto;
}
.heading {
  font-weight: 300;
  color: rgba(0, 0, 0, 0.7);
}
.heading-strong {
  font-weight: 400;
}
.sub-heading {
  color: rgba(0, 0, 0, 0.5);
  font-weight: 300;
  font-size: 12px;
  margin-top: 8px;
}
.form-box {
  max-width: 500px;
  width: 80%;
}
</style>

<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-layout row wrap justify-end align-center>
        <h4>Don't have an account?</h4>
        <v-btn
          round
          outline
          color="accent"
          class="transform-capitalize"
          @click="handleSignupClick()"
        >Create account</v-btn>
      </v-layout>
    </v-flex>

    <!-- <div class="login-page"> -->
    <v-flex xs12 sm6 md6 lg6>
      <v-layout justify-center align-center>
        <img src="/login_img.png" class="left-img">
      </v-layout>
    </v-flex>
    <v-flex xs12 sm6 md6 lg6>
      <v-layout justify-center>
        <div class="form-box">
          <h2 class="heading">
            Sign in to
            <span class="heading-strong">Bussiness Automation Tool</span>
          </h2>
          <p class="sub-heading">Enter your details below</p>
          <login-container @onLoginSuccess="handleLoginSuccess()" @onLoginError="handleLoginError()"/>
        </div>
      </v-layout>
    </v-flex>
    <!-- </div> -->
  </v-layout>
</template>
<script>
import LoginContainer from "~/components/auth/LoginContainer";
export default {
  layout: "login",
  middleware: "notAuthenticated",
  title: "Login",
  components: {
    LoginContainer
  },
  async asyncData ({ params,$axios,error }) {
    let { data } = await $axios.get("/" + params.username + "/api/Configs?filter[where][name]=" + params.username)
    if(data.length > 0);
    else {
      return error({ statusCode: 404, message: "Page Not Found" })
    }
  },
  data: () => ({}),
  methods: {
    handleLoginSuccess() {
      const path = "Dashboard";
      // $nuxt.$router.push(path);
      setTimeout(() => {
        // this.$router.push('/dashboard');
        window.location = path; //Just to Refresh Request i have done this. - *Do Not Remove this*
      }, 1000);
      this.$store.commit("snackbar/setSnack", "Logged In.");
    },
    handleLoginError() {
      //console.log("handleLoginError()");
      this.$store.commit("snackbar/setSnack", "Logged In Fail.");
    },
    handleSignupClick() {
      //$nuxt.$router.push("/dashboard/signup");
    }
  }
};
</script>
