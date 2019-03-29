<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Select your state</h4>
        <v-select
          class="input-box"
          v-model="state"
          :items="states"
          label="Choose State"
          outline
          single-line
          solo
          flat
          required
        ></v-select>
      </v-card-text>
    </v-flex>
    <div class="action-box">
      <v-btn
        round
        :disabled="!valid"
        @click="handleNext"
        class="px-4 transform-capitalize v-btn--active"
        color="#000"
        flat
      >Next</v-btn>
      <div>I agree, products I sell on Azubaa Private Seller will not be</div>
      <div
        style="color: red; opacity: 0.8;"
      >fake / counterfeit or infringe an copyrights / trademarks</div>
    </div>
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
    state: "",
    stateRules: [v => !!v || "State is required"],
    states: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttarakhand",
      "Uttar Pradesh",
      "West Bengal"
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
    handleNext() {
      console.log("Signup()", this.$store);

      if (this.validate() === true) {
        // Validate otp
        this.$emit("onSuccess", this.state);
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
.action-box {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
