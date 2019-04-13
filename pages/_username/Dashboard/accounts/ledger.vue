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
                                <v-flex xs6>
                                    <table class="account_table width-100">
                                        <thead>
                                            <tr>
                                                <th v-for="(header,index) in headers" :key="index" :width="header.width">{{header.text}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(debit,index) in debit" :key="index" class="text-capitalize">
                                                <td class="text-xs-center">{{debit.date}}</td>
                                                <td>{{debit.particular}}</td>
                                                <td class="text-xs-center">{{debit.jf}}</td>
                                                <td class="text-xs-center">{{debit.amount}}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colspan="3">Total</th>
                                                <th>{{debittotal}}</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </v-flex>
                                <v-flex xs6>
                                    <table class="account_table width-100">
                                        <thead>
                                            <tr>
                                                <th v-for="(header,index) in headers" :key="index" :width="header.width">{{header.text}}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(credit,index) in credit" :key="index" class="text-capitalize">
                                                <td class="text-xs-center">{{credit.date}}</td>
                                                <td>{{credit.particular}}</td>
                                                <td class="text-xs-center">{{credit.jf}}</td>
                                                <td class="text-xs-center">{{credit.amount}}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colspan="3">Total</th>
                                                <th>{{credittotal}}</th>
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
        if(this.debit.length > this.credit.length)
        {
            for(let i = 0;i<(this.debit.length - this.credit.length);i++)
            {
                this.credit.push({date:'', particular:'', jf:'-',amount:''})
            }
        }
        else if(this.debit.length < this.credit.length)
        {
            for(let i = 0;i<(this.credit.length - this.debit.length);i++)
            {
                this.debit.push({date:'', particular:'', jf:'-',amount:''})
            }
        }
    },
    data(){
        return{
            headers:[
                { text:'Date' , width:'20%'},
                { text:'Particulars', width:'50%'},
                { text:'J.F.', width:'10%'},
                {text:'Amount(Rs.)', width:'20%'}
            ],
            debit:[],
            credit:[],
            debittotal:0,
            credittotal:0
        }
    },
    mounted(){
        this.getDetails()
    },
    methods:{
        getDetails(){
            this.$axios.get("/"+this.$route.params.username+"/api/Purchasepayments?access_token="+this.$store.state.token+"&filter[include][purchase]=supplier")
            .then(res=>{
                this.$axios.get("/"+this.$route.params.username+"/api/Purchases?access_token="+this.$store.state.token+"&filter[where][isenabled]=1&filter[where][paidamount]=0&filter[include]=supplier")
                .then(res1=>{
                    let d =res.data
                    for(let i=0;i<res1.data.length;i++) d.push(res1.data[i])
                    let debit = []
                    for(let i=0;i<d.length;i++)
                    {
                        if(d[i].paymentdate)
                        {
                            if(d[i].paidamount > 0)
                            {
                                debit.push({date:d[i].paymentdate.substr(0,10),particular:d[i].paymentmethod,jf:'-',amount:d[i].paidamount})
                            }
                            if(d[i].pendingamount != 0)
                            {
                                debit.push({date:d[i].paymentdate.substr(0,10),particular:d[i].purchase.supplier.name,jf:'-',amount:d[i].purchase.pendingamount})
                            }
                        }
                        else {
                            debit.push({date:d[i].duedate.substr(0,10),particular:d[i].supplier.name,jf:'-',amount:d[i].totalamount})
                        }
                    }
                    for(let i=0;i<debit.length;i++) this.debittotal += debit[i].amount
                    debit.sort(function(a,b) {
                        if ( new String(a.date).trim().toLowerCase() < new String(b.date).trim().toLowerCase() ) {
                            return -1;
                        }
                        if ( new String(a.date).trim().toLowerCase() > new String(b.date).trim().toLowerCase() ){
                            return 1;
                        }
                        return 0;
                    });
                    this.debit = debit
                    this.calculation()
                })
            })
        },
        calculation(){
            if(this.debittotal > this.credittotal)
            {
                let total = this.debittotal - this.credittotal
                this.credittotal = this.debittotal
                this.credit.push({date:'',particular:'Closing Balance',js:'-',amount:total})
            }
            else if(this.debittotal < this.credittotal)
            {
                let total = this.credittotal - this.debittotal
                this.debittotal = this.credittotal
                this.debit.push({date:'',particular:'Closing Balance',js:'-',amount:total})
            }
            else {

            }
        }
    }
}
</script>
<style scoped>
    .account_table, th {
        border: 2px solid black;
        border-collapse: collapse;
        padding: 5px;
    }
    .account_table, td {
        border-left: 2px solid black;
        padding: 5px;
    }
</style>
