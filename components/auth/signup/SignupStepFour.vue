<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-flex xs12>
      <v-card-text style="padding: 0;width:100%;">
        <h4 style="color: #999999;font-weight: normal;">Enter Store Name</h4>
        <v-text-field
          v-model="storeName"
          :rules="storeNameRules"
          @change="handleStoreNameChange($event)"
          label="Alpha toys"
          single-line
          solo
          flat
          required
          class="input-box"
        ></v-text-field>
      </v-card-text>
    </v-flex>
    <v-flex xs12 v-if="storeName">
      <v-radio-group v-model="selectedDomain" :mandatory="false">
        <v-radio
          v-for="item in suggestions"
          :label="`https://azubaa.com/${item}`"
          :value="item"
          :key="item"
        ></v-radio>
        <div style="display: flex; justify-content: flex-start; align-items: center;">
          <v-radio label="https://azubaa.com/" value="customDomain"></v-radio>
          <!-- <div> -->
          <v-text-field
            v-model="customStoreDomain"
            @blur="handleDomainChange($event)"
            label
            single-line
            solo
            flat
            required
            class="input-box"
          ></v-text-field>
          <span
            style="color:green;opacity:0.8;font-size:11px;"
            v-if="isDomainAvailable===true && customStoreDomain"
          >Store url is available</span>
          <span
            style="color:red;opacity:0.8;font-size:11px;"
            v-if="isDomainAvailable===false && customStoreDomain"
          >Store url is not-available</span>
          <!-- </div> -->
        </div>
      </v-radio-group>
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
    storeName: "",
    storeNameRules: [v => !!v || "Store name is required"],
    suggestions: [],
    selectedDomain: "",
    customStoreDomain: "",
    isDomainAvailable: null
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        console.log("selectedDomain ", this.selectedDomain);
        console.log("customStoreDomain ", this.customStoreDomain);
        if (!this.selectedDomain) {
          console.log("----1", this.selectedDomain);
          return false;
        }
        if (this.selectedDomain === "customDomain" && !this.isDomainAvailable) {
          console.log("----2");
          return false;
        }
        // this.snackbar = true;
        return true;
      }
      console.log("----3");

      return false;
      // this.$refs.form.reset();
      // this.$refs.form.resetValidation();
    },
    checkDomainAvailability() {
      return this.$axios.$post("/check-domain-availability", {
        domain: this.customStoreDomain
      });
    },
    handleDomainChange(e) {
      this.isDomainAvailable = false;
      this.checkDomainAvailability()
        .then(res => {
          console.log("handleDomainChange() res ", res);
          if (res.success) {
            this.isDomainAvailable = res.data.available;
          } else {
            this.isDomainAvailable = false;
          }
        })
        .catch(err => {
          console.log("handleDomainChange() err ", err);
          this.isDomainAvailable = false;
        });
    },
    handleStoreNameChange(e) {
      console.log("handleStoreNameChange() ");
      this.$axios
        .$post("/domain-suggest", { name: this.storeName })
        .then(res => {
          console.log("handleStoreNameChange() res ", res);
          if (res.success) {
            this.suggestions = res.data;
          } else {
            this.suggestions = [];
          }
        })
        .catch(err => {
          console.log("handleStoreNameChange() err ", err);
          this.suggestions = [];
        });
    },
    handleNext() {
      if (this.validate() === true) {
        // Validate otp
        if (this.selectedDomain == "customDomain") {
          console.log("customDomain - validating");
          this.checkDomainAvailability()
            .then(res => {
              if (res.success && res.data.available) {
                this.isDomainAvailable = true;
                console.log("validated successfully");
                const params = {
                  name: this.storeName,
                  domain: this.selectedDomain
                };
                this.$emit("onSuccess", params);
              } else {
                this.isDomainAvailable = false;
                this.$store.commit("snackbar/setSnack", "Domain not available");
              }
            })
            .catch(err => {
              this.isDomainAvailable = false;
              // Show message domain not available
              this.$store.commit(
                "snackbar/setSnack",
                "Unable to check domain availability, please try again"
              );
            });
        } else {
          console.log("validated successfully");
          const params = {
            name: this.storeName,
            domain: this.selectedDomain
          };
          this.$emit("onSuccess", params);
        }
      } else {
        console.log("validation error ");
      }
    }
  }
};
</script>

<style>
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
