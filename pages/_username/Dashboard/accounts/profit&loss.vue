<template>
    <div>
        <v-card flat>
            <v-card-text class="body-background">
                <v-card class="border-radius-5">
                    <v-card-text>
                        <div v-for="(l,index) in 1" :key="index" class="mb-5">
                            <v-layout justify-space-between font-weight-bold font-16 px-2>
                                <span>Dr</span>
                                <span>Purchase Account</span>
                                <span>Cr</span>
                            </v-layout>
                            <v-layout row wrap mt-1>
                                <v-flex xs12 sm6>
                                    <table class="account_table width-100 fill-height">
                                        <thead>
                                            <tr>
                                                <th class="account_th" v-for="(header,index) in headers" :key="index" :width="header.width">{{header.text}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(debits,index) in debit" :key="index" style="vertical-align: bottom !important;" >
                                                <td class="account_td">
                                                    <v-layout v-for="(sub,i) in debits.sub" :key="i" row wrap class="width-100" >
                                                        <v-flex xs2 v-if="sub.cal != null" class="text-lowercase ">
                                                            <v-select :items="operator" label="" item-text="text" item-value="value" v-model="sub.cal" 
                                                            height=18 class="pa-0 mt-1"></v-select>
                                                        </v-flex>
                                                        <v-flex :class="[sub.cal != null ? 'xs7 ml-1 mr-1' : 'xs9']">
                                                            <v-text-field v-if="sub.cal != null" type=text v-model="sub.particular"
                                                             height=18 class="pa-0 mt-1"></v-text-field>
                                                             <span v-else>{{sub.particular}}</span>
                                                        </v-flex>
                                                        <v-flex xs2 text-xs-center>
                                                            <v-text-field v-if="sub.cal != null" type=text v-model="sub.amount"
                                                             height=18 class="pa-0 mt-1"></v-text-field>
                                                             <span v-else>{{sub.amount}}</span>
                                                        </v-flex>
                                                    </v-layout>
                                                </td>
                                                <td style="border:none;cursor:pointer"><v-icon color="black" small @click="debits.sub.push({particular:'',cal:'',amount:''})">add_circle</v-icon></td>
                                                <td class="account_td text-xs-center">
                                                    {{debits.amount}}
                                                </td>
                                                
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td class="account_td"></td>
                                                <td style="border:none;"></td>
                                                <th class="account_th">{{debittotal}}</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </v-flex>
                                <v-flex xs12 sm6>
                                    <table class="account_table width-100 fill-height">
                                        <thead>
                                            <tr>
                                                <th class="account_th" v-for="(header,index) in headers" :key="index" :width="header.width">{{header.text}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(credits,index) in credit" :key="index" style="vertical-align: bottom !important;">
                                                <td class="account_td">
                                                    <v-layout v-for="(sub,i) in credits.sub" :key="i" row wrap class="width-100" >
                                                        <v-flex xs1 sm2 md1 v-if="sub.cal != null" class="text-lowercase">{{sub.cal}}</v-flex>
                                                        <v-flex :class="[sub.cal != null ? 'xs8 sm7 md8' : 'xs9']">{{sub.particular}}</v-flex>
                                                        <v-flex xs3 text-xs-center>{{sub.amount}}</v-flex>
                                                    </v-layout>
                                                </td>
                                                <td class="text-xs-center account_td">
                                                    {{credits.amount}}
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td class="account_td"></td>
                                                <th class="account_th">{{credittotal}}</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </v-flex>
                            </v-layout>
                        </div>
                    </v-card-text>
                </v-card>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
export default {
    layout: "dashboard",
    updated(){
        
    },
    data(){
        return{
            headers:[
                { text:'Particulars', width:'70%'},
                { text:' ', width:'5%'},
                {text:'Amount(Rs.)', width:'25%'}
            ],
            operator:[
                {text:"",value:""},
                {text:"Add",value:"Add"},
                {text:"Less",value:"Less"}
            ],
            debit:[
                {amount:600,sub:[{particular:'Bhavesh',cal:null,amount:100},{particular:'Jayesh',cal:null,amount:300},{particular:'Chirag',cal:null,amount:200}]},
                {amount:1000,sub:[{particular:'Jay',cal:null,amount:null}]},                
                {amount:4000,sub:[{particular:'Sunil',cal:null,amount:null}]}
                ],
            credit:[
                {amount:1000,sub:[{particular:'MR',cal:null,amount:null}]},
                {amount:200,sub:[{particular:'MR',cal:null,amount:null}]}
            ],
            debittotal:0,
            credittotal:0
        }
    },
    mounted(){
        //this.getDetails()
        this.calculation()
    },
    methods:{
        getDetails(){
            this.debit.push({particular:'DB',amount:null})
            this.debit.push({particular:'DB',amount:1000})
            this.debit.push({particular:'DB',amount:null})
            this.calculation()
        },
        calculation(){
            for(let i=0;i<this.debit.length;i++) this.debittotal += this.debit[i].amount
            for(let i=0;i<this.credit.length;i++) this.credittotal += this.credit[i].amount
            if(this.debittotal > this.credittotal)
            {
                let total = this.debittotal - this.credittotal
                this.credittotal = this.debittotal
                this.credit.push({amount:total,sub:[{particular:'To gross loss c/d',cal:null,amount:null}]})
            }
            else if(this.debittotal < this.credittotal)
            {
                let total = this.credittotal - this.debittotal
                this.debittotal = this.credittotal
                this.debit.push({amount:total,sub:[{particular:'By gross profit c/d',cal:null,amount:null}]})
            }
            else {

            }
        }
    }
}
</script>
<style scoped>
    .account_table, .account_th {
        border: 2px solid black;
        border-collapse: collapse;
        padding: 5px;
    }
    .account_table, .account_td {
        border-left: 2px solid black;
        padding: 0 0 0 5px;
    }
</style>
