<template>
    <v-form @submit.prevent="addItem" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
        <v-layout align-center justify-start row wrap>

            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="$store.state.biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Item Name: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-text-field label="Item Name" type=text :single-line="$store.state.biggerScreen" :rules="requiredRules" v-model="addItemDtl.itemName"
                            height=20></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="$store.state.biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Bill Name: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-text-field label="Bill Name" type=text :single-line="$store.state.biggerScreen" :rules="requiredRules" v-model="addItemDtl.billName"
                            height=20></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="$store.state.biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Type: </label>
                    </v-flex>
                    <v-flex xs12 sm9>
                        <v-layout align-center row wrap>
                            <v-flex sm11>
                                <v-autocomplete v-model="addItemDtl.typeId" :items="typeListitems" @input="changeItem"
                                    :rules="requiredRules" append-icon="add" @click:append="addACV('type')" :loading="typeList.isLoading"
                                    :search-input.sync="typeList.search" hide-no-data hide-selected item-text="name"
                                    item-value="id" label="Type" placeholder="" return-string height=20 :single-line="$store.state.biggerScreen">
                                </v-autocomplete>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="$store.state.biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">SubType: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-autocomplete :disabled="enableSubType==0"
                            v-model="addItemDtl.subTypeId" :items="subTypeListitems" :rules="requiredRules" append-icon="add"
                            :loading="subTypeList.isLoading" :search-input.sync="subTypeList.search" hide-no-data @click:append="addACV('subtype')"
                            hide-selected item-text="name" item-value="id" label="SubType" placeholder="" return-string height=20
                            :single-line="$store.state.biggerScreen"></v-autocomplete>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="$store.state.biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Price: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-text-field label="Price" type=number :single-line="$store.state.biggerScreen" :rules="requiredRules" v-model="addItemDtl.price"
                            height=20></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="$store.state.biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Unit: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-autocomplete v-model="addItemDtl.unitId" :items="unitListitems" :rules="requiredRules"
                            append-icon="add" @click:append="addACV('unit')" :loading="unitList.isLoading" :search-input.sync="unitList.search"
                            hide-no-data hide-selected item-text="name" item-value="id" label="Unit" placeholder=""
                            return-string height=20 :single-line="$store.state.biggerScreen"></v-autocomplete>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>

            <v-flex sm6>
                <v-layout align-center row wrap>
                    <v-flex v-if="$store.state.biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Hsn Code: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-text-field label="Hsn Code" type=text :single-line="$store.state.biggerScreen" v-model="addItemDtl.hsnCode" height=20></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6>
                <v-layout align-center row wrap>
                    <v-flex v-if="$store.state.biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Bar Code: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-text-field label="Bar Code" type=text :single-line="$store.state.biggerScreen" v-model="addItemDtl.barCode" height=20></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm12>
                <v-layout align-start justify-end row wrap>
                    <v-btn v-if="propCheck==0" class="" :loading="btnLoading" type="submit" color="info" round dark
                        >
                        Add
                        <v-icon dark right class="ml-1">check_circle</v-icon>
                    </v-btn>
                    <v-btn v-else class="" :loading="btnLoading" type="submit" color="info" round dark>
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
        <!-- SubType -->
        <v-dialog v-if="modalSubType" width="400" v-model="modalSubType" persistent>
            <v-card>
                <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                    <span style="font-size:18px;">Add SubType</span>
                </v-card-title>
                <v-card-text class="pa-0">
                    <v-container grid-list-xs>
                        <addEditSubType v-model="closeModal1" :typeId="addItemDtl.typeId"></addEditSubType>
                    </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="modalSubType = false">
                    Close
                  </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Unit -->
        <v-dialog v-if="modalUnit" width="400" v-model="modalUnit" persistent>
            <v-card>
                <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                    <span style="font-size:18px;">Add Unit</span>
                </v-card-title>
                <v-card-text class="pa-0">
                    <v-container grid-list-xs>
                        <addEditUnit v-model="closeModal1"></addEditUnit>
                    </v-container>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" flat @click="modalUnit = false">
                    Close
                  </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-form>
</template>
<script>
    import addEditType from '@/components/Items/addEditType';
    import addEditSubType from '@/components/Items/addEditSubType';
    import addEditUnit from "@/components/Items/addEditUnit";
    export default {
        components:{
            addEditType,
            addEditSubType,
            addEditUnit
        },
        props: {
            id: {
                type: String,
                required: false
            },
            value: {
                type: Number,
                required: false
            }
        },
        created() {
            if (this.id != null) {
                this.propCheck = 1
                this.fillData()
            }
        },
        updated(){
            if(this.closeModal1 == 2){
                this.modalType = false
                this.modalSubType = false
                this.modalUnit = false
            }
        },
        watch: {
            'typeList.search': function (val) {
                // Items have already been requested
                if (this.typeList.isLoading) return
                this.typeList.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Types?access_token=' + this.$store.state.token +"&filter[where][isenabled]=1")
                    .then(res => {
                        //let { values } = res.data
                        this.typeList.entries = res.data

                    })
                    .catch(err => {
                        //console.log(err)
                    })
                    .finally(() => (this.typeList.isLoading = false))
            },
            'subTypeList.search': function (val) {
                //console.log(this.addItemDtl.typeId)
                if (this.addItemDtl.typeId != null) {    // Items have already been requested
                    if (this.subTypeList.isLoading) return
                    this.subTypeList.isLoading = true

                    // Lazily load input items
                    this.$axios.get('/' + this.$route.params.username + '/api/Subtypes?access_token=' + this.$store.state.token + '&filter[where][typeId]=' + this.addItemDtl.typeId+"&filter[where][isenabled]=1")
                        .then(res => {
                            //let { values } = res.data
                            this.subTypeList.entries = res.data
                        })
                        .catch(err => {
                            //console.log(err)
                        })
                        .finally(() => (this.subTypeList.isLoading = false))
                }
                else { }
            },
            'unitList.search': function (val) {
                // Items have already been requested
                if (this.unitList.isLoading) return
                this.unitList.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Units?access_token=' + this.$store.state.token+"&filter[where][isenabled]=1")
                    .then(res => {
                        //let { values } = res.data
                        this.unitList.entries = res.data

                    })
                    .catch(err => {
                        //console.log(err)
                    })
                    .finally(() => (this.unitList.isLoading = false))
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
            },
            subTypeListitems() {
                return this.subTypeList.entries.map(entry => {
                    const name = entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            },
            unitListitems() {
                return this.unitList.entries.map(entry => {
                    const name = entry.title.length > this.descriptionLimit
                        ? entry.title.slice(0, this.descriptionLimit) + '...'
                        : entry.title
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            }
        },
        data() {
            return {
                url: process.env.URL,
                addItemDtl: {
                    itemName: "",
                    billName: "",
                    subTypeId: "",
                    price: "",
                    unitId: "",
                    hsnCode: "",
                    barCode: "",
                    typeId: null,
                    typeName: "",
                    subTypeName: "",
                    unitName: ""
                },
                typeList: {
                    isLoading: false,
                    search: null,
                    entries: []
                },
                subTypeList: {
                    isLoading: false,
                    search: null,
                    entries: []
                },
                unitList: {
                    isLoading: false,
                    search: null,
                    entries: []
                },
                requiredRules: [
                    v => !!v || 'This Field is required'
                ],
                editMode: {
                    type: 0,
                    subType: 0,
                    unit: 0
                },
                btnLoading: false,
                editItemDtl: [],
                propCheck: 0,
                enableSubType: 0,
                closeModal1:0,
                modalType:false,
                modalSubType:false,
                modalUnit:false
            }
        },
        methods: {
            addACV(v){
                if(v == 'type'){
                    this.modalType = true
                }
                else if (v == 'subtype'){
                    this.modalSubType = true
                }
                else if( v == 'unit'){
                    this.modalUnit = true
                }
            },
            changeItem(){
                if (this.addItemDtl.typeId != null || this.addItemDtl.typeId != '' || this.addItemDtl.typeId != undefined) {
                    this.enableSubType = 1;
                    this.addItemDtl.subTypeId = null
                }
            },
            async addItem() {
                if (this.$refs.form1.validate()) {
                    if (this.propCheck == 0) {
                        this.btnLoading = true
                        await this.$axios.post("/" + this.$route.params.username + "/api/Items?access_token=" + this.$store.state.token,
                            {
                                name: this.addItemDtl.itemName,
                                billname: this.addItemDtl.billName,
                                isenabled: 1,
                                content: "abc",
                                unitId: this.addItemDtl.unitId,
                                subTypeId: this.addItemDtl.subTypeId,
                                price: this.addItemDtl.price,
                                hsncode: this.addItemDtl.hsnCode,
                                barcode: this.addItemDtl.barCode,
                                createdon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                modifiedById: this.$store.state.userId,
                                createdById: this.$store.state.userId
                            })
                            .then(res => { //console.log("done")
                                //alert("Item Succesfully Added")
                                //window.location=""
                                this.btnLoading = false
                                this.$emit('input', 2);
                            });
                    }
                    else {
                        this.btnLoading = true
                        await this.$axios.post("/" + this.$route.params.username + "/api/Items/update?access_token=" + this.$store.state.token + "&where[id]=" + this.id,
                            {
                                name: this.addItemDtl.itemName,
                                billname: this.addItemDtl.billName,
                                isenabled: 1,
                                content: "abc",
                                unitId: this.addItemDtl.unitId,
                                subTypeId: this.addItemDtl.subTypeId,
                                price: this.addItemDtl.price,
                                hsncode: this.addItemDtl.hsnCode,
                                barcode: this.addItemDtl.barCode,
                                modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                modifiedById: this.$store.state.userId
                            })
                            .then(res => {
                                //alert("Item Succesfully Edited and Saved")
                                //window.location=""
                                this.btnLoading = false
                                this.$emit('input', 2);
                            });
                    }
                }
            },
            async fillData() {
                await this.$axios.get("/" + this.$route.params.username + "/api/Items/" + this.id + "?access_token=" + this.$store.state.token + "&filter[include]=unit&filter[include][subType]=type")
                    .then(res => {
                        this.editItemDtl = res.data;
                        this.addItemDtl.itemName = this.editItemDtl.name;
                        this.addItemDtl.billName = this.editItemDtl.billname;
                        this.addItemDtl.subTypeName = this.editItemDtl.subType.name;
                        this.addItemDtl.price = this.editItemDtl.price;
                        this.addItemDtl.unitName = this.editItemDtl.unit.title;
                        this.addItemDtl.pinCode = this.editItemDtl.pincode;
                        this.addItemDtl.hsnCode = this.editItemDtl.barcode;
                        this.addItemDtl.barCode = this.editItemDtl.hsncode;
                        this.addItemDtl.typeName = this.editItemDtl.subType.type.name;
                        this.addItemDtl.unitId = this.editItemDtl.unitId;
                        this.addItemDtl.typeId = this.editItemDtl.subType.typeId;
                        this.addItemDtl.subTypeId = this.editItemDtl.subTypeId;
                        this.typeList.search =''
                        this.subTypeList.search = ''
                        this.unitList.search = ''
                    
                    });

            }
        }
    }
</script>