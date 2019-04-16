<template>
    <v-layout>
        <v-flex xs11 sm12 ma-3 mt-4>
            <v-layout align-end justify-end row wrap>
                <v-btn color="info" round class="pa-2" @click="showModal = true,editValue=null">
                    <v-icon dark small class="mr-2"> flash_on</v-icon>Add Member
                </v-btn>
            </v-layout>
            <v-layout justify-space-between row wrap>
                <v-flex sm1 xs3>
                    <v-btn v-if="selectMember.length > 0" color="error" round class="pa-0" @click="deleteMember">
                        <v-icon dark small class="mr-1">delete</v-icon> Delete
                    </v-btn>
                </v-flex>
                <v-flex xs12 sm3 class="mb-3">
                    <v-text-field v-model="search" append-icon="search" label="Search" class="pa-0 ma-0" single-line
                        hide-details></v-text-field>
                </v-flex>
            </v-layout>
            <v-data-table v-model="selectMember" :headers="header" :items="memberDtl" :pagination.sync="pagination"
                :total-items="totalMember" :loading="loading" select-all item-key="id" class="elevation-0">
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
                        <td width="65%" style="cursor:pointer;" class="text-capitalize name-linking text-lg-left mr-3">
                            <router-link :to="'/'+$route.params.username+'/Dashboard/sales/customer/'+props.item.customerId+'/view'">
                                {{props.item.customer.name}}
                            </router-link>
                        </td>
                        <td width="25%" class="text-xs-left">
                            {{props.item.customer.mobile}}
                        </td>
                        <td width="10%">
                            <v-icon small class="mr-12" @click="editMember(props.item.id)">edit
                            </v-icon>
                        </td>

                    </tr>
                </template>
            </v-data-table>
            <v-dialog width="400" v-model="showModal">
                <v-card>
                    <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                        <span style="font-size:18px;" v-if="editValue==null">Add Group</span>
                        <span style="font-size:18px;" v-else>Edit Group</span>
                    </v-card-title>
                    <v-card-text class="pa-0">
                        <v-container grid-list-xs>
                            <addMember v-if="showModal==true" v-model="closeModal1" :id="editValue" :gId="this.id" />
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
        </v-flex>
    </v-layout>
</template>
<script>
    import addMember from '@/components/sms/addGroupMember.vue';

    export default {
        layout: "dashboard",
        components: {
            addMember
        },
        props: {
            id: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                header: [
                    { text: "#", value: "name" },
                    { text: "Member Name", value: "name" },
                    { text: "Mobile No.", value: "mobile" },
                    { text: "Edit", value: "name" }
                ],
                selectMember: [],
                loading: true,
                pagination: {},
                showModal: false,
                editValue: null,
                closeModal1: 1,
                search: '',
                totalMember: 0,
                memberDtl: [],
                groupName: '',
                loadingExcel: false,
                loadingPDF: false
            }
        },
        updated() {
            //console.log(this.selectType)
            if (this.closeModal1 == 2) {
                this.showModal = false
                this.closeModal1 = 1
                this.getDataFromApi()
                    .then(data => {
                        this.memberDtl = data.items
                        this.totalMember = data.total
                    })

            }
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.memberDtl = data.items
                            this.totalMember = data.total
                        })
                },
                deep: true
            },
            search: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.memberDtl = data.items
                            this.totalMember = data.total
                        })
                }
            }
        },
        created() {
            this.$axios.get("/" + this.$route.params.username + "/api/Smsgroups?access_token=" + this.$store.state.token + "&filter[where][id]=" + this.id)
                .then(res => {
                    this.groupName = res.data[0].name
                });
        },
        mounted() {
            this.getDataFromApi()
                .then(data => {
                    this.memberDtl = data.items
                    this.totalMember = data.total
                })
        },
        methods: {
            toggleAll() {
                if (this.selectMember.length) this.selectMember = []
                else this.selectMember = this.memberDtl.slice()
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
                    this.$axios.get('/' + this.$route.params.username + '/api/Customergroups/getMembers?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","search":"' + this.search + '","sort":"' + sortBy + '","id":"' + this.id + '","descending":"' + descending + '"}')
                        .then(res => {
                            //console.log("bb")
                            items = res.data.data;
                            //console.log(items)
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
            deleteMember() {
                if (confirm("Do you really want to delete?")) {
                    let promise = new Promise((resolve, reject) => {
                        for (let i = 0; i < this.selectMember.length; i++) {
                            //console.log(this.selectCustomer[i]);
                            this.$axios.post("/" + this.$route.params.username + "/api/Customergroups/update?access_token=" + this.$store.state.token + "&where[id]=" + this.selectMember[i].id,
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
                                    this.memberDtl = data.items
                                    this.totalMember = data.total
                                })
                        }
                    })

                }
                else { }
            },
            editMember(val) {
                this.editValue = "";
                if (this.editValue == "") {
                    this.editValue = val
                    this.showModal = true
                    //console.log(this.editValue)
                }
            }
        }
    }

</script>