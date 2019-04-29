<template>

    <v-form @submit.prevent="changePass" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
        <v-container grid-list-xs class="pa-4">
            <v-layout align-center justify-start row wrap class="mb-3">
                <v-flex xs12 sm12>
                    <v-text-field type=password label="Old Password" v-model="credentials.oldPass"
                        :rules="requiredRules"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row wrap class="mb-3">
                <v-flex xs12 sm12>
                    <v-text-field type=password label="New Password" v-model="credentials.newPass"
                        :rules="requiredRules"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row wrap class="mb-2">
                <v-flex xs12 sm12>
                    <v-text-field type=password label="Confirm Password" v-model="credentials.confPass"
                        :rules="requiredRules"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row wrap>
                <v-flex xs7 sm8></v-flex>
                <v-flex xs5 sm4>
                    <v-btn color="info" :loading="loading" type=submit>
                        <v-icon dark small class="mr-1"> edit</v-icon>Change
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-form>

</template>
<script>
    export default {
        props: {
            value: {
                type: Boolean,
                required: false
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
                loading:false
            }
        },
        methods: {
            async changePass() {
                if (this.$refs.form1.validate()) {
                    if (this.credentials.newPass == this.credentials.confPass) {
                        this.loading = true
                        this.$axios
                            .post("/" + this.$route.params.username + "/api/Users/change-password?access_token=" + this.$store.state.token, {
                                oldPassword: this.credentials.oldPass,
                                newPassword: this.credentials.confPass
                            })
                            .then(res => {
                                this.$axios
                                    .get("/" + this.$route.params.username + "/api/Users/"+this.$store.state.userId+"?access_token=" + this.$store.state.token)
                                    .then(res=>{
                                        this.$axios
                                            .post("/jdmit/api/Users/login",{
                                                email:res.data.email,
                                                password:this.credentials.oldPass
                                            })
                                            .then(res1=>{
                                                this.$axios
                                                    .post("/jdmit/api/Users/change-password?access_token=" + res1.data.id, {
                                                        oldPassword: this.credentials.oldPass,
                                                        newPassword: this.credentials.confPass
                                                    })
                                                    .then(res2=>{
                                                        this.$axios
                                                            .post("/jdmit/api/Users/logout?access_token="+res1.data.id)
                                                            .then(res=>{
                                                                this.$store.commit("snackbar/setSnack", "Password Changed");
                                                                this.credentials.oldPass = ""
                                                                this.credentials.newPass = ""
                                                                this.credentials.confPass = ""
                                                                this.loading = false
                                                                this.$emit("input", false);
                                                            })
                                                    })
                                            })
                                    })
                            })
                            .catch(err => {
                                this.loading = false
                                this.$store.commit("snackbar/setSnack", "Invalid Current Password");
                            })
                    }
                    else {
                        this.loading = false
                        this.$store.commit("snackbar/setSnack", "New password and confirm Password should be same");
                    }
                }
            }
        }
    }
</script>