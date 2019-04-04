<template>
    
            <v-form @submit.prevent="changePass" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
                <v-container grid-list-xs class="pa-4">
                    <v-layout align-center justify-start row wrap class="mb-3">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">Old Password </label>
                            <v-text-field type=password class="pa-0 ma-0" label="" height=22 v-model="credentials.oldPass"
                                :rules="requiredRules"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout align-center justify-start row wrap class="mb-3">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">New Password </label>
                            <v-text-field type=password class="pa-0 ma-0" label="" height=22 v-model="credentials.newPass"
                                :rules="requiredRules"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout align-center justify-start row wrap class="mb-2">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">Confirm Password </label>
                            <v-text-field type=password class="pa-0 ma-0" label="" height=22 v-model="credentials.confPass"
                                :rules="requiredRules"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout align-center justify-start row wrap>
                        <v-flex xs7 sm8></v-flex>
                        <v-flex xs5 sm4>
                            <v-btn color="info" type=submit>
                                <v-icon dark small class="mr-1"> edit</v-icon>Change
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-form>
        
</template>
<script>
    export default {
        props:{
            value:{
                type:Boolean,
                required:false
            }
        },
        data() {
            return {
                credentials: {
                    oldPass: "",
                    newPass: "",
                    confPass: ""
                },
                requiredRules: [
                    v => !!v || 'This Field is required'
                ],
            }
        },
        methods: {
            async changePass() {
                if (this.$refs.form1.validate()) {
                    if (this.credentials.newPass == this.credentials.confPass) {
                        this.$axios.post("/" + this.$route.params.username + "/api/Users/change-password?access_token=" + this.$store.state.token, {
                            oldPassword: this.credentials.oldPass,
                            newPassword: this.credentials.confPass
                        }).then(res => {
                            this.$store.commit("snackbar/setSnack", "Password Changed");
                            this.credentials.oldPass=""
                            this.newPass=""
                            this.confPass=""
                            this.$emit("input", false);
                        })
                        .catch(err=>{
                            this.$store.commit("snackbar/setSnack", "Invalid Current Password");
                        })
                    }
                    else {
                        this.$store.commit("snackbar/setSnack", "New password and confirm Password should be same");
                    }
                }
            }
        }
    }
</script>