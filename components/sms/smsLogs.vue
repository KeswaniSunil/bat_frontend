<template>
    <div>
        <v-card class="border-radius-5">
            <v-card-text class="pt-0">
                <v-layout justify-end class="pt-3">
                    <v-btn class="info" round @click="modalsms = true">Send SMS</v-btn>
                </v-layout>
                <v-layout class="pt-3" align-center justify-start row wrap>
                    <v-flex xs12 sm4>
                        <v-dialog ref="startdate" v-model="startDatemodal" :return-value.sync="startDate1" persistent
                            lazy full-width width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="startDate1" label="Start Date" prepend-icon="event" readonly
                                    v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="startDate1" :max="endDate1" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="startDatemodal = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.startdate.save(startDate1)">OK</v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-flex>
                    <v-flex sm1></v-flex>
                    <v-flex xs12 sm4>
                        <v-dialog ref="enddate" v-model="endDatemodal" :return-value.sync="endDate1" persistent lazy
                            full-width width="290px">
                            <template v-slot:activator="{ on }">
                                <v-text-field v-model="endDate1" label="End Date" prepend-icon="event" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="endDate1" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="endDatemodal = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.enddate.save(endDate1)">OK</v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-flex>
                    <v-flex xs12 sm3>
                        <v-btn class="" dark round @click="getOrders()">Get Records</v-btn>
                    </v-flex>
                </v-layout>
                <v-card class="elevation-5" style="border-radius:5px;">
                    <v-card-title class="pa-2 primary white--text">
                        List of All Sms Logs:-
                    </v-card-title>
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12 sm9 class="mb-3">
                                <v-layout align-start justify-start row wrap>

                                    <v-btn color="primary" round class="pa-0 mr-1" :loading="loadingPDF" @click="_export('pdf')">
                                        <v-icon dark small class="mr-2" reverse>cloud_download</v-icon>Pdf
                                    </v-btn>
                                    <v-btn color="primary" round class="pa-0 " :loading="loadingExcel" @click="_export('excel')">
                                        <v-icon dark small class="mr-2" reverse>cloud_download</v-icon>Excel
                                    </v-btn>

                                </v-layout>
                            </v-flex>
                            <v-flex xs12 sm3 class="mb-3">
                                <v-text-field v-model="search" append-icon="search" label="Search" class="pa-0 ma-0"
                                    single-line hide-details></v-text-field>
                            </v-flex>

                        </v-layout>
                        <v-data-table :headers="header" :items="customerDtl" :pagination.sync="pagination" :total-items="totalCustomer"
                            :loading="loading" select-all item-key="id" class="elevation-0">
                            <template v-slot:headers="props">
                                <tr>
                                    <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                        @click="changeSort(header.value)">
                                        <v-icon small>arrow_upward</v-icon>
                                        {{ header.text }}
                                    </th>
                                </tr>
                            </template>
                            <template v-slot:items="props">
                                <tr>
                                    <td>{{props.item.index+1}}</td>
                                    <td>{{props.item.smstemplate.title}}</td>
                                    <td>{{props.item.content}}</td>
                                    <td v-if="props.item.customerId != null">{{props.item.customer.name}} </td>
                                    <td v-else>-</td>
                                    <td>{{new Date(props.item.datetime).toISOString().substr(0,19).replace("T"," ")}}
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-card-text>
        </v-card>
        <v-dialog width="600" v-model="modalsms" >
            <v-card>
                <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                <span style="font-size:18px;">Send SMS</span>
                </v-card-title>
                <v-card-text class="pa-0">
                    <sendsms v-if="modalsms==true" v-model="closemodal1"/>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click="modalsms = false">
                    Close
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import sendsms from "@/components/sms/sendsms";
    export default {
        components:{
            sendsms
        },
        updated(){
            if (this.closemodal1 == 2) {
                this.modalsms = false
                this.closemodal1 = 0
                this.getDataFromApi()
                    .then(data => {
                        this.customerDtl = data.items
                        this.totalCustomer = data.total
                    })
            }
        },
        data() {
            return {
                header: [{
                    text: '#',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                { text: 'Template Name', value: 'tname' },
                { text: 'Content', value: 'content' },
                { text: 'Customer', value: 'customer' },
                { text: 'Date & time', value: 'datetime' }],
                loading: true,
                startDatemodal: false,
                endDatemodal: false,
                startDate1: "",
                endDate1: "",
                pagination: {},
                customerDtl: [],
                search: '',
                totalCustomer: 0,
                loadingPDF: false,
                loadingExcel: false,
                modalsms:false,
                closemodal1:0
            }
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.customerDtl = data.items
                            this.totalCustomer = data.total
                        })
                },
                deep: true
            },
            search: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.customerDtl = data.items
                            this.totalCustomer = data.total
                        })
                }
            }
        },
        mounted() {
            let date=new Date();
            let month=date.getMonth();
            let year=date.getFullYear();
            let date1=""+new Date(year, month+1, 0).getDate();
            let date2=""+new Date(year, month, 1).getDate();
            if((date.getMonth()+1) < 10) month="0"+(date.getMonth()+1)
            if(date2 <10) date2="0"+date2;
            this.startDate1=year+"-"+month+"-"+date2;
            this.endDate1=year+"-"+month+"-"+date1;
            this.getDataFromApi()
                .then(data => {
                    this.customerDtl = data.items
                    this.totalCustomer = data.total
                })
        },
        methods: {
            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },
            _export(type) {
                if (type == "pdf") this.loadingPDF = true
                else this.loadingExcel = true
                const { sortBy, descending, page, rowsPerPage } = this.pagination
                //console.log("aa")
                this.getDataFromApi()
                    .then(res => {
                        let item = res.items;
                        let header = []
                        header[0] = []
                        for (let i = 0; i < this.header.length; i++) if (this.header[i].text != 'Edit') header[0].push(this.header[i].text)
                        let body = []
                        for (let i = 0; i < item.length; i++) {
                            //let groupname = item[i].groupId == null ? "-" : item[i].group.name
                            let customername = item[i].customerId == null ? "-" : item[i].customer.name
                            body[i] = [(item[i].index + 1), item[i].smstemplate.title, item[i].content, customername, new Date(item[i].datetime).toISOString().substr(0,19).replace("T"," ")]
                        }
                        let name = "SMS Logs"
                        if (type == "pdf") {
                            this.$createPDF(header, body, name + " Listing", process)
                                .then((resolve) => { this.loadingPDF = false })
                        }
                        else {
                            this.$createExcel(header, body, name + " Listing", process)
                                .then((resolve) => { this.loadingExcel = false })
                        }
                    });
            },
            getDataFromApi() {
                this.loading = true
                return new Promise((resolve, reject) => {
                    const { sortBy, descending, page, rowsPerPage } = this.pagination
                    //console.log("aa")
                    let items = [];
                    this.$axios.get('/' + this.$route.params.username + '/api/Smslogs/getSmslogs?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","startdate":"'+this.startDate1+'","enddate":"'+this.endDate1+'","search":"' + this.search + '","sort":"' + sortBy + '","descending":"' + descending + '"}')
                        .then(res => {
                            //console.log("bb")
                            items = res.data.data;
                            //console.log(items)
                            //console.log("cc")
                            const total = res.data.total
                            this.loading = false
                            resolve({
                                items,
                                total
                            })
                            //console.log(res.data)
                        });
                })
            },
            getOrders(){
                this.getDataFromApi()
                .then(data => {
                    this.customerDtl = data.items
                    this.totalCustomer = data.total
                })
            }
        }
    }
</script>