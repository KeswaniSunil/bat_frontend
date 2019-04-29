<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Email Address</h4>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Enter your email"
          single-line
          solo
          flat
          required
          @blur="validateEmail(email)"
          :error="emailUniqueError?true:false"
          :error-messages="emailUniqueError"
          class="input-box"
          :disabled="loading"
        ></v-text-field>
      </v-card-text>
    </v-flex>

    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Company Name</h4>
        <v-text-field
          v-model="name"
          :rules="nameRules"
          label="Enter your company name"
          single-line
          solo
          flat
          required
          class="input-box"
          :disabled="loading"
        ></v-text-field>
      </v-card-text>
    </v-flex>

    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Mobile</h4>
        <v-text-field
          v-model="mobile"
          type="number"
          label="Enter your mobile"
          :rules="mobileRules"
          single-line
          solo
          flat
          required
          class="input-box"
          :disabled="loading"
        ></v-text-field>
      </v-card-text>
    </v-flex>
    <v-btn
      round
      :disabled="!valid"
      @click="handleNext"
      :loading="loading"
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
    onError: Function
  },
  data: () => ({
    valid: false,
    name: "",
    nameRules: [
      v => !!v || "Name is required"
      // v => (v && v.length <= 10) || "Name must be less than 10 characters"
    ],
    email: "",
    emailUniqueError: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    loading:false,
    mobile: "",
    mobileRules: [
      v => !!v || "Mobile number is required",
      v =>
        v && v.length !== 10 ? "Mobile number must be 10 digit long" : false
    ]
  }),

  methods: {
    validateEmail(v) {
      return new Promise((resolve, reject) => {
        this.$axios.post("/jdmit/api/PendingAccounts/validateEmail",{email:v})
        .then(res => {
            if (!res.data.status) {
              this.emailUniqueError = "";
              resolve(true);
            } else {
              this.emailUniqueError = "Email already exist";
              resolve(false);
            }
          })
          .catch(err => {
            this.emailUniqueError = "Email already exist";
            reject(err);
          });
      });
    },
    validate() {
      if (this.$refs.form.validate()) {
        // this.snackbar = true;
        return true;
      }
      return false;
      // this.$refs.form.reset();
      // this.$refs.form.resetValidation();
    },
    handleNext() {
      console.log("login()", this.$store);
      if (this.validate() === true) {
        this.loading = true
        this.validateEmail(this.email)
          .then(res => {
            if (res) {
              const params = {
                name: this.name,
                mobile: this.mobile,
                email: this.email
              };
              this.$emit("onSuccess", params);
            }
          })
          .catch(err => {});
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
</style>
