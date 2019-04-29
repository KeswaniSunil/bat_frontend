<template>
    <v-layout>
        <v-flex sm12>
            <v-card class="border-radius-5">
                <v-card-text>
                    <v-layout align-center justify-space-between class="mb-2" :class="[$store.state.biggerScreen ? 'row' : 'column']">
                        <label class="page-heading primary--text ml-2">Template Listing:</label>
                        <v-btn color="info" round class="pa-2" @click="showModal = true,editValue=null">
                            <v-icon dark small class="mr-2"> flash_on</v-icon>Add Template
                        </v-btn>
                    </v-layout>
                    <v-card class="elevation-3" style="border-radius:5px;">
                        <v-card-title class="pa-2 primary white--text">
                            List of All SMS Templates:-
                        </v-card-title>
                        <v-card-text class="pt-1">
                            <v-layout column class="pb-2">
                                <v-flex sm12>
                                    <v-layout align-center row wrap>
                                        <v-flex xs3 sm1>
                                            <v-btn v-if="selectTemplate.length > 0" color="error" round class="pa-0" @click="deleteGroup">
                                                <v-icon dark small class="mr-1">delete</v-icon> Delete
                                            </v-btn>
                                        </v-flex>
                                        <v-flex xs9 sm8></v-flex>
                                        <v-flex xs12 sm3>
                                            <v-text-field v-model="search" append-icon="search" label="Search"
                                                single-line hide-details></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-data-table v-model="selectTemplate" :headers="header" :items="templateDtl"
                                :pagination.sync="pagination" :total-items="totalTemplate" :loading="loading"
                                select-all item-key="id" class="elevation-0">
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
                                        <td width="20%" style="cursor:pointer;" class="text-capitalize name-linking text-xs-left">

                                            {{props.item.title}}
                                        </td>
                                        <td width="60%" class="text-xs-left">
                                            {{props.item.content}}
                                        </td>
                                        <td width="5%">
                                            <v-icon small class="mr-12" @click="editTemplate(props.item.id)">edit
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
                                <span style="font-size:18px;" v-if="editValue==null">Add Group</span>
                                <span style="font-size:18px;" v-else>Edit Group</span>
                            </v-card-title>
                            <v-card-text class="pa-0">
                                <v-container grid-list-xs>
                                    <addTemplate v-if="showModal==true" v-model="closeModal1" :id="editValue" />
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
    import addTemplate from '@/components/sms/addSmsTemplate.vue';
    export default {
        components: {
            addTemplate
        },
        data() {
            return {
                header: [
                    { text: "#", value: "title" },
                    { text: "Template Name", value: "title" },
                    { text: "Content", value: "content" },
                    { text: "Edit", value: "title" }
                ],
                selectTemplate: [],
                loading: true,
                pagination: {},
                showModal: false,
                editValue: null,
                closeModal1: 1,
                search: '',
                totalTemplate: 0,
                templateDtl: [],
                loadingExcel: false,
                loadingPDF: false
            }
        },
        updated() {
            //console.log(this.selectTemplate)
            if (this.closeModal1 == 2) {
                this.showModal = false
                this.closeModal1 = 1
                this.getDataFromApi()
                    .then(data => {
                        this.templateDtl = data.items
                        this.totalTemplate = data.total
                    })

            }
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.templateDtl = data.items
                            this.totalTemplate = data.total
                        })
                },
                deep: true
            },
            search: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.templateDtl = data.items
                            this.totalTemplate = data.total
                        })
                }
            }
        },
        mounted() {
            this.getDataFromApi()
                .then(data => {
                    this.templateDtl = data.items
                    this.totalTemplate = data.total
                })
        },
        methods: {
            toggleAll() {
                if (this.selectTemplate.length) this.selectTemplate = []
                else this.selectTemplate = this.templateDtl.slice()
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
                    let items = [];
                    this.$axios.get('/' + this.$route.params.username + '/api/Smstemplates/getTemplates?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","search":"' + this.search + '","sort":"' + sortBy + '","descending":"' + descending + '"}')
                        .then(res => {
                            //console.log("bb")
                            items = res.data.data;
                            //console.log("cc")
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
            deleteGroup() {
                if (confirm("Do you really want to delete?")) {
                    let promise = new Promise((resolve, reject) => {
                        for (let i = 0; i < this.selectTemplate.length; i++) {
                            //console.log(this.selectCustomer[i]);
                            this.$axios.post("/" + this.$route.params.username + "/api/Smstemplates/update?access_token=" + this.$store.state.token + "&where[id]=" + this.selectTemplate[i].id,
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
                                    this.templateDtl = data.items
                                    this.totalTemplate = data.total
                                })
                        }
                    })

                }
                else { }
            },
            editTemplate(val) {
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