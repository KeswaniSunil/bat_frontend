<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Email</h4>
        <v-text-field
          v-model="email"
          single-line
          solo
          flat
          required
          class="input-box"
          :disabled="!havecode"
          label="Enter your email"
          :rules="emailRules"
        >
        </v-text-field>
      </v-card-text>
    </v-flex>

    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Confirmation Code</h4>
        <v-text-field
          v-model="otp"
          :rules="otpRules"
          label="Enter OTP sent to your email"
          single-line
          input=number
          solo
          flat
          required
          :disabled="loading"
          class="input-box"
        >
          <template v-if="!loading" v-slot:append>
            <v-fade-transition leave-absolute>
              <span @click="resend()" flat class="font-14 info--text" style="cursor:pointer">Resend</span>
            </v-fade-transition>
          </template>
        </v-text-field>
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
          :disabled="loading"
          required
          class="input-box"
        ></v-text-field>
      </v-card-text>
    </v-flex>
    <v-btn
      round
      :disabled="!valid"
      @click="handleNext"
      class="px-4 transform-capitalize"
      :class="[loading ? '' : 'v-btn--active']"
      color="#000"
      :loading="loading"
      :icon="loading"
      flat
    >Create
    </v-btn>
    <span 
      v-if="loading"
    >Creating your account
    </span>
  </v-form>
</template>

<script>
export default {
  props: {
    onSuccess: Function,
    onError: Function,
    email: String,
    name:String,
    mobile:String,
    havecode:Boolean
  },
  data: () => ({
    valid: false,
    otp: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    otpRules: [
      v => !!v || "OTP is required",
      v =>
        v && v.length !== 6 ? "Please enter a valid 6 digit OTP code" : false
      // async v => {
      //   try {
      //     const res = await $nuxt.$axios.post("/verify-otp", {
      //       mobile_no: this.mobile,
      //       otp: this.otp
      //     });
      //     console.log("otp validation => ", otp);
      //     return false;
      //   } catch (err) {
      //     console.log("OTP Error ", err);
      //     return false;
      //   }
      // }
    ],
    password: "",
    passwordRules: [v => !!v || "Password is required"],
    loading:false
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    resend(){
      this.$axios.post("/jdmit/api/PendingAccounts/sendotp", { companyname:this.name,email:this.email,mobile:this.mobile })
          .then(res => {
            if(res.data.status) {
              this.$store.commit("snackbar/setSnack", "Code is sended to your email!");
            }
          })
          .catch(err => {
            // show message to try again
          });
    },
    handleNext() {
      if (this.validate() === true) {
        // Validate otp
        this.loading = true
        this.$axios
          .post("/jdmit/api/PendingAccounts/verifyotp", { cname:this.name,mobile:this.mobile,email: this.email,password:this.password, otp: this.otp })
          .then(res => {
            if(res.data.status) {
              const params = {
                password: this.password,
                name:res.data.webname
              };
              this.$emit("onSuccess", params);
            }
            else {
              this.loading = false
              this.$emit("onSuccess", {});
            }
          })
          .catch(err => {
            this.loading = false
            this.$emit("onSuccess", {});
          });
      }
    }
  }
};
</script>

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

.v-btn--active {
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
.field-icon {
  opacity: 0.7;
}
.field-icon:hover {
  cursor: pointer;
}
</style>
