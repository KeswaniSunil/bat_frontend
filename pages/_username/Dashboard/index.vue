<template>
    <v-card flat>
        <v-card-text class="body-background padding-xs">
            <MonthlyRecord mode="sale" ui="dashboard" class="mb-3" />
            <MonthlyRecord mode="purchase" ui="dashboard" class="mb-3" />
            <v-layout row wrap>
                <v-flex xs12 sm3 class="margin-xs mb-3">
                    <v-card class="border-radius-5">
                        <v-card-text>
                            <label class="font-16">Total Recievables</label>
                            <v-layout align-start justify-center row>
                                <v-progress-circular :rotate="-90" :size="130" :width="15" :value="value_rec" color="info">
                                    {{ value_rec }}%
                                </v-progress-circular>
                            </v-layout>
                            <v-layout align-start justify-start row>
                                <label class="font-14">Total Amount = {{recievable.total}}</label>

                            </v-layout>
                            <v-layout align-start justify-start row>
                                <label class="font-14">Recieved=
                                    {{recievable.recieved}}({{Math.round(((recievable.recieved*100)/recievable.total))}}%)</label>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12 sm3 class="margin-xs mb-3">
                    <v-card class="border-radius-5">
                        <v-card-text>
                            <label class="font-16">Total Payables</label>
                            <v-layout align-start justify-center row>
                                <v-progress-circular :rotate="-90" :size="130" :width="15" :value="value_pay" color="info">
                                    {{ value_pay }}%
                                </v-progress-circular>
                            </v-layout>
                            <v-layout align-start justify-start row>
                                <label class="font-14">Total Amount = {{payable.total}}</label>

                            </v-layout>
                            <v-layout align-start justify-start row>
                                <label class="font-14">Paid=
                                    {{payable.paid}}({{Math.round(((payable.paid*100)/payable.total))}}%)</label>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex sm6></v-flex>
            </v-layout>

        </v-card-text>
    </v-card>
</template>
<script>
    import MonthlyRecord from "@/components/MonthlyRecord";
    export default {
        layout: 'dashboard',
        components: {
            MonthlyRecord
        },
        data() {
            return {
                value_rec: 0,
                recievable: [],
                value_pay: 0,
                payable: []
            }
        },
        created() {
            this.generate()
        },
        methods: {
            generate() {
                this.$axios.get("/" + this.$route.params.username + "/api/Customers/getRecievables?access_token=" + this.$store.state.token)
                    .then(res => {
                        this.$axios.get("/" + this.$route.params.username + "/api/Suppliers/getPayables?access_token=" + this.$store.state.token)
                            .then(res1 => {
                                this.recievable = res.data.total[0]
                                if (this.recievable.total > 0) {
                                    this.value_rec = Math.round((((this.recievable.total - this.recievable.recieved) * 100) / this.recievable.total))
                                }
                                this.payable = res1.data.total[0]
                                if (this.payable.total > 0) {
                                    this.value_pay = Math.round((((this.payable.total - this.payable.paid) * 100) / this.payable.total))
                                }

                            });
                    })
            }
        }
    }
</script>
<style lang="stylus" scoped>
    .v-progress-circular {
        margin: 1rem
    }
</style>