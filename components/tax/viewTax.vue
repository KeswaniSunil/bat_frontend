<template>
    <v-layout>
        <v-flex sm12>
            <v-card class="border-radius-5">
                <v-card-text>
                    <v-layout align-center justify-space-between class="mb-2" :class="[$store.state.biggerScreen ? 'row' : 'column']">
                        <label class="page-heading primary--text ml-2">Taxes Listing:</label>
                        <v-btn color="info" round class="pa-2" @click="showModal = true,editValue=null">
                            <v-icon dark small class="mr-2"> flash_on</v-icon>Add Taxes
                        </v-btn>
                    </v-layout>
                    <v-card class="elevation-3" style="border-radius:5px;">
                        <v-card-title class="pa-2 primary white--text">
                            List of All Taxes:-
                        </v-card-title>
                        <v-card-text class="pt-1">
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
                            <v-data-table v-model="selectType" :headers="header" :items="typeDtl" :pagination.sync="pagination"
                                :total-items="totalType" :loading="loading" select-all item-key="id" class="elevation-0">
                                <template v-slot:headers="props">
                                    <tr>
                                        <th>
                                            <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary
                                                hide-details @click.stop="toggleAll"></v-checkbox>
                                        </th>
                                        <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                            @click="changeSort(header.value)" style="text-align:left;">
                                            {{ header.text }}
                                            <v-icon small>arrow_upward</v-icon>

                                        </th>
                                    </tr>
                                </template>
                                <template v-slot:items="props">
                                    <tr>
                                        <td width="9%" :active="props.selected" @click="props.selected = !props.selected">
                                            <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                        </td>
                                        <td width="6%">{{props.item.index+1}}</td>
                                        <td width="65%" @click="editType(props.item.id)" style="cursor:pointer;" class="text-capitalize name-linking text-lg-left mr-3">{{
                                            props.item.name }}</td>
                                        <td width="10%">{{props.item.percentage}}</td>
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
                                <span style="font-size:18px;" v-if="editValue==null">Add Tax</span>
                                <span style="font-size:18px;" v-else>Edit Tax</span>
                            </v-card-title>
                            <v-card-text class="pa-0">
                                <v-container grid-list-xs>
                                    <addEditTax v-if="showModal==true" v-model="closeModal1" :id="editValue"></addEditTax>
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
    import addEditTax from '@/components/tax/addEditTax.vue';
    export default {
        components: {
            addEditTax
        },
        created() {
        },
        data() {
            return {
                header: [{
                    text: '#',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                { text: 'Taxes', value: 'name', sortable: false },
                { text: 'Percentage', value: 'percentage', sortable: false },
                { text: 'Edit', value: 'name' }],
                loading: true,
                pagination: {},
                typeDtl: [],
                selectType: [],
                search: '',
                showModal: false,
                totalType: 0,
                editValue: null,
                closeModal1: 1
            }
        },
        updated() {
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
                    //console.log("aa")
                    let items = "";
                    this.$axios.get('/' + this.$route.params.username + '/api/Taxes/getTaxes?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","search":"' + this.search + '","sort":"' + sortBy + '","descending":"' + descending + '"}')
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
                            //console.log(res.data)
                        });
                })
            },
            async deleteType() {

                if (confirm("Do you really want to delete?")) {
                    let promise = new Promise((resolve, reject) => {
                        for (let i = 0; i < this.selectType.length; i++) {
                            //console.log(this.selectCustomer[i]);
                            this.$axios.post("/" + this.$route.params.username + "/api/Taxes/update?access_token=" + this.$store.state.token + "&where[id]=" + this.selectType[i].id,
                                {
                                    isenabled: 0
                                })
                                .then(res => {
                                    resolve("1");
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