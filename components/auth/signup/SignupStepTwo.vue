<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Mobile Number</h4>
        <v-text-field
          v-model="mobileNumber"
          :rules="mobileRules"
          label="Enter your mobile"
          single-line
          solo
          flat
          required
          class="input-box"
        >
          <template v-slot:append>
            <v-icon
              class="field-icon"
              style="opacity:0.7;cursor"
              @click="handleEditMobileClick()"
            >edit</v-icon>
          </template>
        </v-text-field>
      </v-card-text>
    </v-flex>

    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Confirmation Code</h4>
        <v-text-field
          v-model="otp"
          :rules="otpRules"
          label="Enter OTP sent to your mobile number"
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
        ></v-text-field>
      </v-card-text>
    </v-flex>
    <v-btn
      round
      :disabled="!valid"
      @click="handleNext"
      class="px-4 transform-capitalize v-btn--active"
      color="#000"
      flat
    >Next</v-btn>
  </v-form>
</template>

<script>
export default {
  // name: "signup-step-one",
  props: {
    onSuccess: Function,
    onError: Function,
    onEditMobile: Function,
    mobileNumber: String
  },
  data: () => ({
    valid: false,
    otp: "",
    otpRules: [
      v => !!v || "OTP is required",
      v =>
        v && v.length !== 4 ? "Please enter a valid 4 digit OTP code" : false
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

    mobile: "",
    mobileRules: [
      v => !!v || "Mobile number is required",
      v =>
        v && v.length !== 10 ? "Mobile number must be 10 digit long" : false
    ]
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
    handleEditMobileClick() {
      this.$emit("onEditMobile", true);
    },
    handleNext() {
      console.log("Signup()", this.$store);

      if (this.validate() === true) {
        // Validate otp
        this.$axios
          .post("/verify-otp", { mobile_no: this.mobileNumber, otp: this.otp })
          .then(res => {
            console.log("VerifyOTP res ", res);
            const params = {
              password: this.password
            };
            this.$emit("onSuccess", params);
          })
          .catch(err => {
            console.log("VerifyOTP err ", err);
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
