<template>
    <v-layout>
        <v-flex sm12>
            <v-card class="border-radius-5">
                <v-card-text>
                    <v-layout align-center justify-start row wrap>
                        <v-flex xs7 sm10></v-flex>
                        <v-flex xs5 sm2>
                            <v-layout align-center justify-end row wrap>
                                <v-btn color="info" round class="pa-2" @click="showModal = true,editValue=null">
                                    <v-icon dark small class="mr-2"> flash_on</v-icon>Add Bill Book
                                </v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout column class="pb-2">
                        <v-flex sm12>
                            <v-layout align-center row wrap>
                                <v-flex xs3 sm1>
                                    <v-btn v-if="selectType.length > 0" color="error" round class="pa-0" @click="deleteType">
                                        <v-icon dark small class="mr-1">delete</v-icon> Delete
                                    </v-btn>
                                </v-flex>
                                <v-flex xs9 sm8></v-flex>
                                <v-flex xs12 sm3>
                                    <v-text-field v-model="search" append-icon="search" label="Search" single-line
                                        hide-details></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-card class="elevation-5" style="border-radius:5px;">
                        <v-card-title class="pa-2 primary white--text">
                            List of All BillBooks:-
                        </v-card-title>
                        <v-card-text>
                            <v-data-table v-model="selectType" :headers="header" :items="typeDtl" :pagination.sync="pagination"
                                :total-items="totalType" :loading="loading" select-all item-key="id" class="elevation-0">
                                <template v-slot:headers="props">
                                    <tr>
                                        <th>
                                            <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate"
                                                primary hide-details @click.stop="toggleAll"></v-checkbox>
                                        </th>
                                        <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                            @click="changeSort(header.value)" style="text-align:left;">
                                            <v-icon small>arrow_upward</v-icon>
                                            {{ header.text }}
                                        </th>
                                    </tr>
                                </template>
                                <template v-slot:items="props">
                                    <tr>
                                        <td width="9%" :active="props.selected" @click="props.selected = !props.selected">
                                            <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                        </td>
                                        <td width="6%">{{props.item.index+1}}</td>
                                        <td width="55%" @click="editType(props.item.id)" style="cursor:pointer;" class="text-capitalize name-linking text-lg-left mr-3">{{
                                            props.item.title }}</td>
                                        <td width="10%">{{props.item.prefix}}</td>
                                        <td width="10%">{{props.item.series}}</td>
                                        <td width="10%">
                                            <v-icon small class="mr-12" @click="editType(props.item.id)">edit
                                            </v-icon>
                                        </td>

                                    </tr>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                    <v-dialog width="400" v-model="showModal">
                        <v-card>
                            <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                                <span style="font-size:18px;" v-if="editValue==null">Add Billbook</span>
                                <span style="font-size:18px;" v-else>Edit Billbook</span>
                            </v-card-title>
                            <v-card-text class="pa-0">
                                <v-container grid-list-xs>
                                    <addEditBillbook v-if="showModal==true" v-model="closeModal1" :id="editValue"></addEditBillbook>
                                </v-container>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" flat @click="showModal = false,editValue=null">
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
    import addEditBillbook from '@/components/sales/billbook/addEditBillbook.vue';
    export default {
        components: {
            addEditBillbook
        },
        data() {
            return {
                header: [{
                    text: '#',
                    align: 'left',
                    sortable: false,
                    value: 'title'
                },
                { text: 'BillBook', value: 'title' },
                { text: 'prefix', value: 'prefix' },
                { text: 'series', value: 'series' },
                { text: 'Edit', value: 'title' }],
                loading: true,
                pagination: {},
                typeDtl: [],
                selectType: [],
                search: '',
                showModal: false,
                totalType: 0,
                editValue: null,
                closeModal1: 1,
            }
        },
        updated() {
            //console.log(this.selectType)
            if (this.closeModal1 == 2) {
                this.showModal = false
                this.closeModal1 = 1
                this.getDataFromApi()
                    .then(data => {
                        this.typeDtl = data.items
                        this.totalType = data.total
                    })

            }
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.typeDtl = data.items
                            this.totalType = data.total
                        })
                },
                deep: true
            },
            search: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.typeDtl = data.items
                            this.totalType = data.total
                        })
                }
            }
        },
        mounted() {
            this.getDataFromApi()
                .then(data => {
                    this.typeDtl = data.items
                    this.totalType = data.total
                })
        },
        methods: {
            toggleAll() {
                if (this.selectType.length) this.selectType = []
                else this.selectType = this.typeDtl.slice()
            },
            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },
            getDataFromApi() {
                this.loading = true
                return new Promise((resolve, reject) => {
                    const { sortBy, descending, page, rowsPerPage } = this.pagination
                    let items = "";
                    this.$axios.get('/' + this.$route.params.username + '/api/BillBooks/getBillbooks?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","search":"' + this.search + '","sort":"' + sortBy + '","descending":"' + descending + '"}')
                        .then(res => {
                            items = res.data.data;
                            const total = res.data.total
                            this.loading = false
                            resolve({
                                items,
                                total
                            })
                        });
                })
            },
            async deleteType() {

                if (confirm("Do you really want to delete?")) {
                    let promise = new Promise((resolve, reject) => {
                        for (let i = 0; i < this.selectType.length; i++) {
                            //console.log(this.selectCustomer[i]);
                            this.$axios.post("/" + this.$route.params.username + "/api/Billbooks/update?access_token=" + this.$store.state.token + "&where[id]=" + this.selectType[i].id,
                                {
                                    isenabled: 0
                                })
                                .then(res => {
                                    this.$axios.post("/" + this.$route.params.username + "/api/Orders/update?access_token=" + this.$store.state.token + "&where[billbookId]=" + this.selectType[i].id,
                                        {
                                            isenabled: 0
                                        })
                                        .then(res1 => {
                                            resolve("1")
                                        });
                                });
                        }
                    });
                    promise.then((resolve) => {
                        if (resolve == "1") {
                            //alert("Successfully Deleted")
                            //window.location="";
                            this.getDataFromApi()
                                .then(data => {
                                    this.typeDtl = data.items
                                    this.totalType = data.total
                                })
                        }
                    })

                }
                else { }
            },
            editType(val) {
                this.editValue = "";
                if (this.editValue == "") {
                    this.editValue = val
                    this.showModal = true
                    //console.log(this.editValue)
                }
                //console.log(this.editValue)
            }
        }

    }
</script>