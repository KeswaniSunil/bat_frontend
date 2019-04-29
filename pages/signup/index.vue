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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.step-box {
  padding-top: 32px;
}
</style>

<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-layout row wrap justify-space-between align-center>
        <h4>{{currentStep}}/{{totalSteps}} <span class="font-weight-thin">Creating New Account</span></h4>
        <div>
          <span class="font-weight-bold">Already have an account</span>
          <v-btn
            round
            outline
            color="accent"
            class="transform-capitalize"
            @click="handleLoginClick()"
          >login</v-btn>
        </div>
      </v-layout>
    </v-flex>

    <!-- <div class="login-page"> -->
    <v-flex xs12 sm6 md6 lg6>
      <v-layout justify-center align-center>
        <img src="/signup_img.png" class="left-img">
      </v-layout>
    </v-flex>
    <v-flex xs12 sm6 md6 lg6>
      <v-layout justify-center>
        <div class="form-box" v-if="currentStep == 1">
          <v-layout justify-space-between align-end>
            <h2 class="heading">
              <span class="heading-strong">Create New Account</span>
            </h2>
            <!--<span class="red--text caption font-weight-bold" style="cursor:pointer" @click="currentStep = 2,email='',havecode=true">Have Code?</span> -->
          </v-layout>
          <div class="step-box">
            <p class="sub-heading">Enter your details below</p>
            <signup-step-one @onSuccess="handleStepOneSuccess($event)" @onError="handleStepError()"/>
          </div>
        </div>

        <div class="form-box" v-if="currentStep == 2">
          <h2 class="heading">
            <span class="heading-strong">Enter OTP</span>
          </h2>
          <p class="sub-heading">We need to verify your email</p>
          <div class="step-box">
            <signup-step-two
              @onSuccess="handleStepTwoSuccess($event)"
              @onError="handleStepError()"
              @onEditMobile="handleEditMobileClick()"
              :email="getEmail"
              :name="name"
              :mobile="mobile"
              :havecode="havecode"
            />
          </div>
        </div>
      </v-layout>
    </v-flex>
    <!-- </div> -->
  </v-layout>
</template>

<script>
import SignupStepOne from "~/components/auth/signup/SignupStepOne";
import SignupStepTwo from "~/components/auth/signup/SignupStepTwo";
export default {
  components: {
    SignupStepOne,
    SignupStepTwo
  },
  data: () => ({
    totalSteps: 2,
    currentStep: 1,
    havecode:false,
    name: null,
    email: null,
    mobile: null,
    password: null
    // roles: ["SELLER", "PVTSELLER", "CUSTOMER", "WHOLESELLER"]
  }),
  computed: {
    getEmail() {
      return this.email || "";
    }
  },
  methods: {
    handleLoginClick() {
      $nuxt.$router.push("/dashboard/login");
    },
    handleStepOneSuccess(e) {
      // this.stepOneData = e;
      if (e && e.mobile) {
        this.name = e.name;
        this.mobile = e.mobile;
        this.email = e.email;
        // Generate otp
        this.$axios.post("/jdmit/api/PendingAccounts/sendotp", { companyname:e.name,email:e.email,mobile: e.mobile })
          .then(res => {
            if(res.data.status) {
              this.currentStep = 2;
            }
          })
          .catch(err => {
            // show message to try again
          });
      }
    },
    handleStepTwoSuccess(e) {
      // call Signup here
      if (e && e.password) {
        this.$store.commit("snackbar/setSnack", "Account Created!");
        this.$router.push("/"+e.name)
      }
      else{
        this.$store.commit("snackbar/setSnack", "Confirmation Code is not Valid or Expired!");
      }
    },

    handleStepError() {},
  }
};
</script>

<style>
</style>
