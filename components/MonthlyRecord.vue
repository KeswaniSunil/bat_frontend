<template>
    <div>
        <v-card class="ma-3 border-radius-5">
            <v-card-text>
                <v-layout row wrap v-if="mode == 'billbook'">
                    <v-flex xs12 sm6>
                        <v-layout align-center justify-end row wrap>
                            <v-flex xs12 sm3 class="text-lg-left">
                                <label class="font-16 font-weight-regular">Bill Book: </label>
                            </v-flex>
                            <v-flex sm1>
                            </v-flex>
                            <v-flex xs12 sm8>
                                <v-select :items="billBookdtl" label="Select Bill Book"
                                    v-model="billBookId" @change="monthwise" item-text="title"
                                    item-value="id" single-line height=20></v-select>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
                <v-layout v-if="billBookId != '' || mode == 'sale' || mode == 'purchase'" justify-start row wrap>
                    <v-flex v-for="(mn,index) in monthName" :key="index" @click="viewOrder(mn[3],mn[4],billBookId)" xs5 sm3 md2 ma-2>
                        <v-hover v-if="index%2==0" style="transition:0.8s">
                            <v-card slot-scope="{ hover }"
                                :class="`elevation-${hover ? 10 : 3}`"
                                class="border-radius-5 black">
                                <v-img src="/img/login-bg/gallery-15-thumb.jpg" gradient="to top right,rgba(88,97,105,0.8),rgba(45,53,60,0.8)">
                                    <v-container fill-height fluid pa-2>
                                        <v-layout fill-height align-center justify-center row wrap>
                                            <v-flex xs12 flexbox text-xs-center>
                                                <span class="white--text font-20">{{mn[0]+" "+mn[1]}}</span>
                                            </v-flex>
                                            <v-flex xs12 flexbox text-xs-center>
                                                <span class="grey--text font-weight-bold font-14" >Total Order:- {{mn[2]}}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                            </v-card>
                        </v-hover>
                        <v-hover v-else style="transition:0.8s">
                            <v-card slot-scope="{ hover }"
                                :class="`elevation-${hover ? 10 : 3}`"
                                class="border-radius-5 black">
                                <v-img src="/img/login-bg/gallery-15-thumb.jpg" gradient="to top right,rgba(25,120,201,.8), rgba(25,32,72,.8)">
                                    <v-container fill-height fluid pa-2>
                                        <v-layout fill-height align-center justify-center row wrap>
                                            <v-flex xs12 flexbox text-xs-center>
                                                <span class="white--text font-20">{{mn[0]+" "+mn[1]}}</span>
                                            </v-flex>
                                            <v-flex xs12 flexbox text-xs-center>
                                                <span class="grey--text font-weight-bold font-14" >Total Order:- {{mn[2]}}</span>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                            </v-card>
                        </v-hover>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
    export default {
        props:{
            mode:{
                type: String,
                required: true
            }
        },
        created(){
            if(this.mode == 'billbook')
            {
                this.generate()
            }
            else {
                this.monthwise()
            }
        },
        data(){
            return{
                billBookdtl:[],
                billBookId:"",
                billRecords:{},
                monthName:[],
                allMonths:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec']
            }
        },
        methods:{
            async generate(){
                await this.$axios.get("/"+this.$route.params.username+"/api/Billbooks?access_token="+this.$store.state.token+"&filter[where][isenabled]=1")
                .then(res => {
                    this.billBookdtl=res.data;
                });
            },
            async monthwise(){
                let promise2 = new Promise((resolve, reject)=>{
                    if(this.mode == 'billbook')
                    {
                        this.$axios.get("/"+this.$route.params.username+"/api/Orders?access_token="+this.$store.state.token+"&filter[order]=billdate%20DESC&filter[where][billbookId]="+this.billBookId+"&filter[where][isenabled]=1")
                        .then(res=>{
                            resolve(res)
                        })
                    }
                    else if(this.mode == 'purchase')
                    {
                        this.$axios.get("/"+this.$route.params.username+"/api/Purchases?access_token="+this.$store.state.token+"&filter[order]=billdate%20DESC&filter[where][isenabled]=1")
                        .then(res=>{
                            resolve(res)
                        })
                    }
                    else if(this.mode == 'sale')
                    {
                        this.$axios.get("/"+this.$route.params.username+"/api/Orders?access_token="+this.$store.state.token+"&filter[order]=billdate%20DESC&filter[where][isenabled]=1")
                        .then(res=>{
                            resolve(res)
                        })
                    }
                })
                promise2.then(res => {
                        this.billRecords=res.data
                        let s=res.data
                        let a=new Date(res.data[0].billdate)
                        let b=new Date(res.data[s.length-1].billdate)
                        let startYear  = b.getFullYear()
                        let endYear    = a.getFullYear();
                        this.monthName = [];
                        for(let i = startYear; i <= endYear; i++) {
                            let endMonth = i != endYear ? 11 : parseInt(a.getMonth()+1) - 1;
                            let startMon = i === startYear ? parseInt(b.getMonth()+1)-1 : 0;
                            for(let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
                                let month = j;
                                let ii=this.allMonths[j]
                                let date1=""+new Date(i, j+1, 0).getDate();
                                let date2=""+new Date(i, j, 1).getDate();
                                if((j+1) < 10) month="0"+(j+1)
                                if(date2 < 10) date2="0"+date2;
                                let startDate=i+"-"+month+"-"+date2;
                                let endDate=i+"-"+month+"-"+date1;
                                let p = 0
                                for(let k=0;k<res.data.length;k++){
                                    if(new Date(res.data[k].billdate)>=new Date(startDate) && new Date(res.data[k].billdate)<=new Date(endDate)){
                                        p++;
                                    }
                                }
                                if(p > 0) this.monthName.push([ii,i,p,startDate,endDate])
                            }        
                        }
                        this.monthName.reverse()
                    });
            },
            viewOrder(startDate,endDate,id){
                if(this.mode == 'purchase') {
                    this.$router.push("/"+this.$route.params.username+"/Dashboard/purchase?startDate="+startDate+"&endDate="+endDate+"#tab-3")
                }
                else if(this.mode == 'sale'){
                    this.$router.push("/"+this.$route.params.username+"/Dashboard/sales?startDate="+startDate+"&endDate="+endDate+"#tab-3")
                }
                else if(this.mode == 'billbook'){
                    this.$router.push("/"+this.$route.params.username+"/Dashboard/sales?startDate="+startDate+"&endDate="+endDate+"&id="+id+"#tab-3")
                }
            }
        }
    }
</script>