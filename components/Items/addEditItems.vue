<template>
    <v-form @submit.prevent="addItem" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
        <v-layout align-center justify-start row wrap>

            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Item Name: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-text-field label="" type=text :single-line="biggerScreen" :rules="requiredRules" v-model="addItemDtl.itemName"
                            class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Bill Name: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-text-field label="" type=text :single-line="biggerScreen" :rules="requiredRules" v-model="addItemDtl.billName"
                            class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Type: </label>
                    </v-flex>
                    <v-flex xs12 sm9>
                        <v-layout v-if="propCheck==0 || editMode.type==1" align-center row wrap>
                            <v-flex sm11>
                                <v-autocomplete :disabled="enableType == 0" v-model="addItemDtl.typeId" :items="typeListitems"
                                    :rules="requiredRules" append-icon="search" :loading="typeList.isLoading"
                                    :search-input.sync="typeList.search" hide-no-data hide-selected item-text="name"
                                    item-value="id" label="" placeholder="" return-string height=20 :single-line="biggerScreen">
                                </v-autocomplete>

                            </v-flex>
                            <v-flex sm1>
                                <v-icon color="red" v-if="enableType == 0" @click="enableType=1,addItemDtl.typeId=''">edit</v-icon>
                            </v-flex>
                        </v-layout>
                        <v-layout v-else align-center row wrap>
                            <v-flex sm10>
                                <v-text-field type=text disabled v-model="addItemDtl.typeName" class="pa-0 ma-0"></v-text-field>
                            </v-flex>
                            <v-flex sm2>
                                <v-icon color="red" @click="editMode.type=1,addItemDtl.typeId='',editMode.subType=1,addItemDtl.subTypeId=''">edit</v-icon>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">SubType: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-autocomplete v-if="(propCheck==0 || editMode.subType==1)" :disabled="enableSubType==0"
                            v-model="addItemDtl.subTypeId" :items="subTypeListitems" :rules="requiredRules" append-icon="search"
                            :loading="subTypeList.isLoading" :search-input.sync="subTypeList.search" hide-no-data
                            hide-selected item-text="name" item-value="id" label="" placeholder="" return-string height=20
                            :single-line="biggerScreen"></v-autocomplete>
                        <v-layout v-else align-center justify-start row wrap>
                            <v-flex sm11>
                                <v-text-field v-model="addItemDtl.subTypeName" height=25 disabled></v-text-field>
                            </v-flex>
                            <v-flex sm1>
                                <v-icon @click="editMode.subType=1,addItemDtl.subTypeId=''" color="red">edit</v-icon>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Price: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-text-field label="" type=number :single-line="biggerScreen" :rules="requiredRules" v-model="addItemDtl.price"
                            class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6 class="mb-2">
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Unit: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-autocomplete v-if="id == null" v-model="addItemDtl.unitId" :items="unitListitems" :rules="requiredRules"
                            append-icon="search" :loading="unitList.isLoading" :search-input.sync="unitList.search"
                            hide-no-data hide-selected item-text="name" item-value="id" label="" placeholder=""
                            return-string height=20 :single-line="biggerScreen"></v-autocomplete>
                        <v-text-field v-else v-model="addItemDtl.unitName" height=20 disabled></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>

            <v-flex sm6>
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Hsn Code: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-text-field label="" type=text :single-line="biggerScreen" v-model="addItemDtl.hsnCode" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm6>
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                        <label class="font-15 font-weight-regular">Bar Code: </label>
                    </v-flex>
                    <v-flex xs12 sm8>
                        <v-text-field label="" type=text :single-line="biggerScreen" v-model="addItemDtl.barCode" class="pa-0 ma-0"></v-text-field>
                    </v-flex>
                    <v-flex sm1></v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm12>
                <v-layout align-start justify-end row wrap>
                    <v-btn v-if="propCheck==0" class="" :loading="btnLoading" type="submit" color="info" round dark
                        @click="">
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
    </v-form>
</template>
<script>
    export default {
        updated() {

            //console.log(this.addItemDtl.typeId +"  --  "+this.addItemDtl.subTypeId )
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
        watch: {
            enableType: {
                handler() {
                    if (this.enableType == 0 && this.addItemDtl.typeId != '') {
                        this.enableSubType = 1
                        //console.log("bb"+"-"+this.addItemDtl.typeId)
                    }
                    else if (this.enableType == 1) {
                        this.enableSubType = 0;
                        this.addItemDtl.subTypeId = '';
                        //console.log("aa"+"-"+this.addItemDtl.typeId)
                    }
                }
            },
            'addItemDtl.typeId': {
                handler() {
                    if (this.addItemDtl.typeId != null || this.addItemDtl.typeId != '' || this.addItemDtl.typeId != undefined) {
                        this.enableType = 0;
                    }
                }
            },
            'typeList.search': function (val) {
                // Items have already been requested
                if (this.typeList.isLoading) return
                this.typeList.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Types/typeNames?access_token=' + this.$store.state.token + '&names=' + val)
                    .then(res => {
                        let { values } = res.data
                        this.typeList.entries = values

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
                    this.$axios.get('/' + this.$route.params.username + '/api/Subtypes/subTypeNames?access_token=' + this.$store.state.token + '&typeId=' + this.addItemDtl.typeId + '&names=' + val)
                        .then(res => {
                            let { values } = res.data
                            this.subTypeList.entries = values
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
                this.$axios.get('/' + this.$route.params.username + '/api/Units/unitNames?access_token=' + this.$store.state.token + '&names=' + val)
                    .then(res => {
                        let { values } = res.data
                        this.unitList.entries = values

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
                biggerScreen: true,
                btnLoading: false,
                editItemDtl: [],
                propCheck: 0,
                enableSubType: 0,
                enableType: 1
            }
        },
        methods: {
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
                        //console.log(this.addItemDtl.typeName);
                        //console.log(this.editMode.type)
                        //console.log(this.editMode.subType)
                        //console.log(this.addItemDtl.subTypeId);
                    });

            }
        }
    }
</script>