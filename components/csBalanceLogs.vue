<template>
    <v-card  class="mt-3 border-radius-5">
                                    <v-card-text>
                                        <v-layout align-center justify-start row wrap>
                                            <v-flex xs12 sm12>
                                                <v-layout align-center row wrap>
                                                    <v-flex xs12 sm12>
                                                        <v-layout align-start justify-end row wrap>
                                                        <v-btn @click="showModal=true" color="info" round dark>
                                                           <v-icon dark small class="mr-1">flash_on</v-icon> Add Balance
                                                        </v-btn>
                                                        </v-layout>
                                                    </v-flex>
                                                </v-layout>  
                                            </v-flex>
                                        </v-layout>  
                                        <v-layout class="pt-3" align-center justify-start row wrap>
                                        <v-flex xs12 sm4>
                                            <v-dialog ref="startdate" v-model="startDatemodal" :return-value.sync="startDate1"
                                                persistent lazy full-width width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="startDate1" label="Start Date" prepend-icon="event"
                                                        readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="startDate1" scrollable :max="endDate1">
                                                    <v-spacer></v-spacer>
                                                    <v-btn flat color="primary" @click="startDatemodal = false">Cancel</v-btn>
                                                    <v-btn flat color="primary" @click="$refs.startdate.save(startDate1)">OK</v-btn>
                                                </v-date-picker>
                                            </v-dialog>
                                        </v-flex>
                                        <v-flex sm1></v-flex>
                                        <v-flex xs12 sm4>
                                            <v-dialog ref="enddate" v-model="endDatemodal" :return-value.sync="endDate1"
                                                persistent lazy full-width width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="endDate1" label="End Date" prepend-icon="event"
                                                        readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="endDate1" scrollable>
                                                    <v-spacer></v-spacer>
                                                    <v-btn flat color="primary" @click="endDatemodal = false">Cancel</v-btn>
                                                    <v-btn flat color="primary" @click="$refs.enddate.save(endDate1)">OK</v-btn>
                                                </v-date-picker>
                                            </v-dialog>
                                        </v-flex>
                                        <v-flex xs12 sm3>
                                            <v-layout row wrap>
                                                <v-flex xs7 sm3>
                                                </v-flex>
                                                <v-flex xs5 sm9>
                                                    <v-btn class="" dark round @click="getLogs()">Get Stock</v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                        <v-card class="elevation-5" style="border-radius:5px;">
                                        <v-card-title class="pa-2 primary white--text">
                                            Balance Logs:-
                                        </v-card-title>
                                        <v-card-text>
                                            <v-layout row wrap>
                                                <v-flex sm9 class="mb-3">
                                                </v-flex>
                                                <v-flex xs12 sm3 class="mb-3">
                                                    <v-text-field v-model="search" append-icon="search" label="Search"
                                                        class="pa-0 ma-0" single-line hide-details></v-text-field>
                                                </v-flex>

                                            </v-layout>
                                            <v-data-table :headers="header" :items="balanceDtl" :pagination.sync="pagination"
                                                :total-items="totalLogs" :loading="loading" select-all item-key="id"
                                                class="elevation-0">
                                                <template v-slot:headers="props">
                                                    <tr>
                                                        <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                                            @click="changeSort(header.value)" style="text-align:left;">

                                                            {{ header.text }}<v-icon small>arrow_upward</v-icon>
                                                        </th>
                                                    </tr>
                                                </template>
                                                <template v-slot:items="props">
                                                    <tr>

                                                        <td width="6%">{{props.item.index+1}}</td>
                                                        <td width="60%" class="text-xs-left"><b>{{ props.item.notes  }}</b></td>
                                                        <td width="15%" class="text-xs-left">{{ changeToIST(props.item.date) }}</td>
                                                        <td width="15%" class="text-xs-left">{{ props.item.balance }}</td>
                                                    </tr>
                                                </template>
                                            </v-data-table>
                                        </v-card-text>
                                    </v-card>
                                        <v-dialog width="500" v-model="showModal">
                                        <v-card>
                                            <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                                                <span style="font-size:18px;">Add Balance</span>
                                            </v-card-title>
                                            <v-card-text class="pa-0">
                                                <v-container grid-list-xs>
                                                    <v-form @submit.prevent="addBalance" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
                                                        <v-layout align-center justify-start row wrap class="mb-2">
                                                                <v-flex xs12 sm12>
                                                                    <label class="font-16 font-weight-regular">Balance </label>
                                                                        <v-text-field
                                                                            class="pa-0 ma-0"
                                                                            label=""
                                                                            height=25
                                                                            type=number
                                                                            :rules="requiredRules"
                                                                            v-model="addBalanceDtl.balance"
                                                                        ></v-text-field>
                                                                </v-flex>    
                                                            </v-layout>
                                                            <v-layout align-center justify-start row wrap class="mb-2">
                                                                <v-flex xs12 sm12>
                                                                    <label class="font-16 font-weight-regular">Date </label>
                                                                        <v-dialog ref="dialog" v-model="DateModal" :return-value.sync="addBalanceDtl.date" persistent
                                                                        lazy full-width width="290px">
                                                                        <template v-slot:activator="{ on }">
                                                                            <v-text-field v-model="addBalanceDtl.date" label="" class="ma-0 pa-0" prepend-icon="event" readonly :rules="requiredRules"
                                                                                v-on="on"></v-text-field>
                                                                        </template>
                                                                        <v-date-picker v-model="addBalanceDtl.date" scrollable>
                                                                            <v-spacer></v-spacer>
                                                                            <v-btn flat color="primary" @click="DateModal = false">Cancel</v-btn>
                                                                            <v-btn flat color="primary" @click="$refs.dialog.save(addBalanceDtl.date)">OK</v-btn>
                                                                        </v-date-picker>
                                                                    </v-dialog>
                                                                </v-flex>    
                                                            </v-layout>
                                                            <v-layout align-center justify-start row wrap class="">
                                                                <v-flex xs12 sm12>
                                                                    <label class="font-16 font-weight-regular">Notes </label>
                                                                        <v-text-field
                                                                            class="pa-0 ma-0"
                                                                            label=""
                                                                            height=25
                                                                            type=text
                                                                            v-model="addBalanceDtl.notes"
                                                                        ></v-text-field>
                                                                </v-flex>    
                                                            </v-layout>  
                                                            <v-layout align-center justify-start row wrap>
                                                                
                                                                <v-flex xs12 sm12>
                                                            <v-layout align-start justify-end>

                                                                    <v-btn color="info" :loading="btnLoading" round type=submit>
                                                                        Add
                                                                    </v-btn>
                                                                    </v-layout>
                                                                </v-flex>
                                                            </v-layout>
                                                    </v-form>
                                                </v-container>
                                            </v-card-text>

                                            <v-divider></v-divider>

                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="primary" flat @click="showModal = false">
                                                    Close
                                                </v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>        
                                    </v-card-text>    
                                </v-card>
</template>
<script>
let date=new Date();
let month = ""+(date.getMonth()+1)
let date1 = ""+(date.getDate())
if((date.getMonth()+1) < 10) month="0"+(date.getMonth()+1)
if(date.getDate() < 10) date1="0"+date.getDate()
export default {
        //layout : "dashboard_ly",
        props: {
            id: {
                type: String,
                required: false
            },
            mode:{
                type: String,
                required: true
            }
        },
        data(){
            return{
                btnLoading:false,
                DateModal:false,
                search:"",
                header: [{
                    text: '#',
                    align: 'left',
                    sortable: false,
                    value: 'notes'
                },
                { text: 'Notes', value: 'notes' },
                { text: 'Date', value: 'date' },
                { text: 'Balance', value: 'balance' },                
                ],
                loading: true,
                pagination: {},
                showModal:false,
                requiredRules: [
                    v => !!v || 'This Field is required'
                ],
                addBalanceDtl:{
                    balance:0,
                    notes:"",
                    date:date.getFullYear() + "-" + month + '-' + date1
                },
                balanceDtl:[],
                totalLogs:0,
                startDatemodal:false,
                endDatemodal:false,
                startDate1:null,
                endDate1:null
            }
        },
        created(){
            this.generate()
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.balanceDtl = data.items
                            this.totalLogs = data.total
                        })
                },
                deep: true
            },
            search: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.balanceDtl = data.items
                            this.totalLogs = data.total
                        })
                }
            }
        },
        mounted() {
            this.getDataFromApi()
                .then(data => {
                    this.balanceDtl = data.items
                    this.totalLogs = data.total
                })
        },
        methods:{
            
            async generate() {
                let date = new Date();
                let month = date.getMonth();
                let year = date.getFullYear();
                let date1 = "" + new Date(year, month + 1, 0).getDate();
                let date2 = "" + new Date(year, month, 1).getDate();
                if ((date.getMonth() + 1) < 10) month = "0" + (date.getMonth() + 1)
                if (date2 < 10) date2 = "0" + date2;
                this.startDate1 = year + "-" + month + "-" + date2;
                this.endDate1 = year + "-" + month + "-" + date1;
                this.getLogs()
            },
            getLogs() {
                this.getDataFromApi()
                    .then(data => {
                        this.balanceDtl = data.items
                        this.totalLogs = data.total
                    })
            },
            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },
            addBalance(){
                this.btnLoading=true;
                if(this.mode=='customer')
                {   
                    let notess=this.addBalanceDtl.notes=="" ? "Balance Added" : this.addBalanceDtl.notes;
                    this.$axios.post("/" + this.$route.params.username + "/api/Customerlogs?access_token=" + this.$store.state.token,{
                        balance:this.addBalanceDtl.balance,
                        notes:notess,
                        date:this.addBalanceDtl.date,
                        customerId:this.id,
                        isenabled:1,
                        createdon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                        modifiedon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                        createdById:this.$store.state.userId
                    }).then(res=>{
                        this.$axios.get("/" + this.$route.params.username + "/api/Customers/" + this.id + "?access_token=" + this.$store.state.token)
                            .then(res1 => {
                                this.$axios.post("/" + this.$route.params.username + "/api/Customers/update?access_token=" + this.$store.state.token+"&where[id]=" + this.id,{
                                    closingbal:parseFloat(this.addBalanceDtl.balance) + parseFloat(res1.data.closingbal)
                                })
                            .then(res2 => {
                                this.showModal=false;
                                this.btnLoading=false;
                        this.getDataFromApi()
                        .then(data => {
                            this.balanceDtl = data.items
                            this.totalLogs = data.total
                        })

                            });
                            });
                        //console.log(this.balanceDtl)
                    })
                }
                else{
                    let notess=this.addBalanceDtl.notes=="" ? "Balance Added" : this.addBalanceDtl.notes;
                    this.$axios.post("/" + this.$route.params.username + "/api/Supplierlogs?access_token=" + this.$store.state.token,{
                        balance:this.addBalanceDtl.balance,
                        notes:notess,
                        date:this.addBalanceDtl.date,
                        supplierId:this.id,
                        isenabled:1,
                        createdon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                        modifiedon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                        createdById:this.$store.state.userId
                    }).then(res=>{
                        this.$axios.get("/" + this.$route.params.username + "/api/Suppliers/" + this.id + "?access_token=" + this.$store.state.token)
                            .then(res1 => {
                                this.$axios.post("/" + this.$route.params.username + "/api/Suppliers/update?access_token=" + this.$store.state.token+"&where[id]=" + this.id,{
                                    closingbal:parseFloat(this.addBalanceDtl.balance) + parseFloat(res1.data.closingbal)
                                })
                            .then(res2 => {
                                this.showModal=false;
                                this.btnLoading=false;
                        this.getDataFromApi()
                        .then(data => {
                            this.balanceDtl = data.items
                            this.totalLogs = data.total
                        })

                            });
                            });
                        //console.log(this.balanceDtl)
                    })
                }
            },
            getDataFromApi() {
                this.loading = true
                return new Promise((resolve, reject) => {
                    const { sortBy, descending, page, rowsPerPage } = this.pagination
                    //console.log("aa")
                    let items = [];
                    if(this.mode=='customer')
                    {   
                        this.$axios.get('/' + this.$route.params.username + '/api/Customerlogs/getlogs?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","startdate":"' + this.startDate1 + '","enddate":"' + this.endDate1 + '","id":"' + this.id + '","purchase":"' + this.purchase + '","sale":"' + this.sales + '","search":"' + this.search + '","sort":"' + sortBy + '","descending":"' + descending + '"}')
                            .then(res => {
                                
                                //console.log("bb")
                                items = res.data.data;
                                //console.log("cc")
                                const total = res.data.total
                                this.loading = false
                                resolve({
                                    items,
                                    total
                                })
                            });
                    }
                    else{
                        this.$axios.get('/' + this.$route.params.username + '/api/Supplierlogs/getlogs?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","startdate":"' + this.startDate1 + '","enddate":"' + this.endDate1 + '","id":"' + this.id + '","purchase":"' + this.purchase + '","sale":"' + this.sales + '","search":"' + this.search + '","sort":"' + sortBy + '","descending":"' + descending + '"}')
                            .then(res => {
                                
                                //console.log("bb")
                                items = res.data.data;
                                //console.log("cc")
                                const total = res.data.total
                                this.loading = false
                                resolve({
                                    items,
                                    total
                                })
                                //console.log(res.data.data)
                            });
                    }
                })
            },
            changeToIST(date) {
                let rs = new Date(date)
                let dt = rs.getDate();
                let mn = rs.getMonth() + 1
                if (dt < 10) dt = '0' + dt;
                if (mn < 10) mn = '0' + mn
                let str = dt + "-" + mn + "-" + rs.getFullYear();
                return str
            },
        }
}
</script>