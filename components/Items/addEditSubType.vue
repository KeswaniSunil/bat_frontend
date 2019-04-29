<template>
    <v-form @submit.prevent="addSubType" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
        
            <v-layout align-center justify-start row wrap class="mb-3">
                <v-flex xs12 sm12>
                    <v-text-field label="SubType Name" type=text :rules="requiredRules" v-model="subTypeName"
                        class="pa-0 mt-1" ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row wrap class="mb-1">
                <v-flex xs12 sm12>
                    <v-autocomplete v-model="myTypeId" :items="typeListitems" :rules="requiredRules"
                        auto-select-first clearable append-icon="add" @click:append="addACV('type')" :loading="typeList.isLoading"
                        :search-input.sync="typeList.search" hide-no-data hide-selected item-text="name" item-value="id"
                        label="Type" placeholder="" return-string class="pa-0 mt-1"  >
                    </v-autocomplete>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row wrap>
                <v-flex xs12 sm12>
                <v-layout align-start justify-end>
                    <v-btn v-if="propCheck==0" class="" :loading="btnLoading" type="submit" color="info" round dark
                        >
                        Add
                        <v-icon dark right class="ml-1">check_circle</v-icon>
                    </v-btn>
                    <v-btn v-else class="" :loading="btnLoading" type="submit" color="info" round dark >
                        Save
                        <v-icon dark right class="ml-1">check_circle</v-icon>

                    </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
            <!-- Type -->
            <v-dialog v-if="modalType" width="400" v-model="modalType" persistent>
                <v-card>
                    <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                        <span style="font-size:18px;">Add Type</span>
                    </v-card-title>
                    <v-card-text class="pa-0">
                        <v-container grid-list-xs>
                            <addEditType v-model="closeModal1"></addEditType>
                        </v-container>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click="modalType = false">
                        Close
                    </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
    </v-form>
</template>
<script>
    import addEditType from '@/components/Items/addEditType';
    export default {
        props: {
            id: {
                type: String,
                required: false
            },
            typeId:{
                type: String,
                required: false
            },
            value: {
                type: Number,
                required: false
            }
        },
        components: {
            addEditType
        },
        created() {
            if (this.id != null) {
                this.propCheck = 1,
                    this.fillData()
            }
            if(this.typeId != null){
                this.typeList.search = ""
                this.myTypeId=this.typeId
            }
        },
        updated() {
            if (this.closeModal1 == 2){
                this.modalType = false
                this.closeModal1 = 0
            }
        },
        watch: {
            'typeList.search': function (val) {
                // Items have already been requested
                if (this.typeList.isLoading) return
                this.typeList.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Types?access_token=' + this.$store.state.token+"&filter[where][isenabled]=1")
                    .then(res => {
                        //let { values } = res.data
                        this.typeList.entries = res.data

                    })
                    .catch(err => {
                        //console.log(err)
                    })
                    .finally(() => (this.typeList.isLoading = false))
            }
        },
        computed: {
            typeListitems() {
                return this.typeList.entries.map(entry => {
                    const name = entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            }
        },
        data() {
            return {
                url: process.env.URL,
                modalType: false,
                closeModal1:0,
                subTypeName: "",
                typeName: "",
                myTypeId:"",
                propCheck: 0,
                editMode: {
                    type: 0
                },
                typeList: {
                    isLoading: false,
                    search: null,
                    entries: []
                },
                requiredRules: [
                    v => !!v || 'This Field is required'
                ],
                biggerScreen: true,
                btnLoading: false
            }
        },
        methods: {
            addACV(v){
                if(v == 'type'){
                    this.modalType = true
                }
            },
            async addSubType() {
                this.btnLoading= true
                if (this.propCheck == 0) {
                    await this.$axios.post("/" + this.$route.params.username + "/api/Subtypes?access_token=" + this.$store.state.token, {
                        name: this.subTypeName,
                        isenabled: 1,
                        typeId: this.myTypeId,
                        createdon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                        modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                        createdById: this.$store.state.userId,
                        modifiedById: this.$store.state.userId

                    })
                        .then(res => {
                            //alert("Subtype Succesfully Added")
                            //window.location=""
                            this.$emit('input', 2);
                        });
                }
                else {
                    await this.$axios.post("/" + this.$route.params.username + "/api/Subtypes/update?access_token=" + this.$store.state.token + "&where[id]=" + this.id, {
                        name: this.subTypeName,
                        isenabled: 1,
                        typeId: this.myTypeId,
                        modifiedon: new Date(),
                        modifiedById: this.$store.state.userId

                    })
                        .then(res => {
                            //alert("Subtype Succesfully Edited and Saved")
                            //window.location=""
                            this.$emit('input', 2);
                        });

                }

            },
            async fillData() {
                await this.$axios.get("/" + this.$route.params.username + "/api/Subtypes/" + this.id + "?access_token=" + this.$store.state.token + "&filter[include]=type")
                    .then(res => {
                        this.subTypeName = res.data.name;
                        this.typeName = res.data.type.name;
                        this.myTypeId = res.data.typeId;
                        this.typeList.search = ""
                    });

            }
        }
    }
</script>