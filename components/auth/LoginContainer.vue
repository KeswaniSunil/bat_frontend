<style >
.input-box .v-input__control .v-input__slot {
  border: 1px solid #ececec !important;
}
.default-category {
  box-shadow: none;
  border: 1px solid #ececec;
}
.default-category .v-btn {
  opacity: 1;
}

.login-btn-active {
  padding-left: 65px;
  padding-right: 65px;
  background: #ff4430; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #ff4430,
    #ff2e56
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #ff4430,
    #ff2e56
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  color: white !important;
}
</style>

<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Email Address</h4>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="atik@gmail"
          single-line
          solo
          flat
          required
          class="input-box"
        ></v-text-field>
      </v-card-text>
    </v-flex>

    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Password</h4>
        <v-text-field
          v-model="password"
          type="password"
          label="Enter your password"
          :rules="passwordRules"
          single-line
          solo
          flat
          required
          class="input-box"
          @keypress.enter="login"
        ></v-text-field>
      </v-card-text>
    </v-flex>
    <v-flex xs12 style="display: flex; justify-content: center;">
      <v-btn
        round
        :disabled="!valid"
        :loading="loading"
        @click="login"
        class="px-6 transform-capitalize login-btn-active"
        color="#000"
        flat
      >Login</v-btn>
    </v-flex>
  </v-form>
</template>

<script>
const crypto= require('crypto');
export default {
  props: {
    onLoginSuccess: Function,
    onLoginError: Function
  },
  data: () => ({
    valid: false,
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 10) || "Name must be less than 10 characters"
    ],
    email: "", //sufyan@ascendtis.com
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    password: "", //123456
    passwordRules: [v => !!v || "Password is required"],
    loading: false
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        // this.snackbar = true;
        return true;
      }
      return false;
      // this.$refs.form.reset();
      // this.$refs.form.resetValidation();
    },
    login() {
      if (this.validate() === true) {
        this.loading = true;
        // Perform login
        this.$axios.post("/"+this.$route.params.username+"/api/Users/login", {
            email: this.email,
            password: this.password
          })
          .then(res => {
            let cookieValueObj={
              token:res.data.id,
              userId:res.data.userId,
              username:this.$route.params.username
            }
            let mykey = crypto.createCipher('aes-128-ecb','123');
            let cookieValue=mykey.update(JSON.stringify(cookieValueObj),'utf8','hex');
            cookieValue+=mykey.final('hex');
            this.$cookies.set('_sessionId',cookieValue,{
              path:'/',
              maxAge:60*60*24*7
            })
            this.$emit("onLoginSuccess", res);
          })
          .catch(err => {
            this.$emit("onLoginError", err);
          });
      }
    }
  }
};
</script>