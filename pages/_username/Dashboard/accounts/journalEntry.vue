<template>
    <v-layout>
        <v-flex sm12>
            <v-card class="border-radius-5 grey lighten-2" flat>
                <v-card-text>
                    <v-card class="border-radius-5">
                        <v-card-text>
                            <table class="account_table width-100">
                                <thead>
                                    </tr>
                                    <th>Date</th>
                                    <th>Name of Account</th>
                                    <th>Debit (Dr.)</th>
                                    <th>Credit (Cr.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(a,index) in data">
                                        <td class="td-bottom-br" width="15%">
                                            <v-layout align-center justify-center row wrap>
                                                {{a.date}}
                                            </v-layout>
                                            <v-layout align-center justify-center row wrap>

                                            </v-layout>
                                        </td>
                                        <td width="55%">
                                            <v-layout align-center justify-start row wrap>
                                                <v-flex xs sm12 class="ml-2"><b>{{a.drAc}} A/c</b></v-flex>
                                            </v-layout>
                                            <v-layout align-center justify-start row wrap>
                                                <v-flex xs sm12 class="ml-5"><b>To {{a.crAc}} A/c</b></v-flex>
                                            </v-layout>
                                        </td>
                                        <td class="td-bottom-br" width="15%">
                                            <v-layout align-Start justify-center row wrap>
                                                {{a.drAm}}
                                            </v-layout>
                                            <v-layout align-Start justify-center row wrap>
                                                <span style="color:white;">-</span>
                                            </v-layout>
                                        </td>
                                        <td class="td-bottom-br" width="15%">
                                            <v-layout align-Start justify-center row wrap>
                                                <span style="color:white;">-</span>
                                            </v-layout>
                                            <v-layout justify-center row wrap>
                                                {{a.crAm}}
                                            </v-layout>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </v-card-text>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
    export default {
        layout: "dashboard",
        data() {
            return {
                data: [
                    { 'date': '20-2-2019', 'drAc': "Cash", 'crAc': "Salary", 'drAm': 20000, 'crAm': 20000 },
                    { 'date': '21-2-2019', 'drAc': "Rent", 'crAc': "Bank", 'drAm': 45000, 'crAm': 45000 }
                ]
            }
        }
    }
</script>
<style scoped>
    .account_table,
    th,
    td,
    tbody {
        border: 1px solid black;
        border-collapse: collapse;
    }

    .td-bottom-br {
        border-bottom: none;
        border-top: none;
    }

    .account_table,
    tr {
        border: none;
    }
</style>