<template>
    <v-layout>
        <v-flex sm12>
            <v-card class="border-radius-5">
                <v-card-text>
                    <v-layout align-center justify-space-between :class="[$store.state.biggerScreen ? 'row' : 'column']" class="mb-2">
                        <label class="page-heading primary--text ml-2">Item Listing:</label>
                        <div>
                            <v-btn color="info" round class="pa-2" @click="showModal = true,editValue=null">
                                <v-icon dark small class="mr-2"> flash_on</v-icon>Add Items
                            </v-btn>
                            <v-btn color="info" round class="pa-2" @click="showBulk = true">
                                <v-icon dark small class="mr-2"> equalizer</v-icon>Add In Bulk
                            </v-btn>
                        </div>
                    </v-layout>
                    <v-layout row wrap class="mb-2">
                        <v-flex sm1 xs3>
                            <v-btn v-if="selectItem.length > 0" color="error" round class="pa-0" @click="deleteItem">
                                <v-icon dark small class="mr-1">delete</v-icon> Delete
                            </v-btn>
                        </v-flex>
                        <v-flex sm10 xs9></v-flex>
                    </v-layout>
                    <v-card class="elevation-3" style="border-radius:5px;">
                        <v-card-title class="pa-2 primary white--text">
                            List of All Items:-
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
                            <v-data-table v-model="selectItem" :headers="header" :items="itemDtl" :pagination.sync="pagination"
                                :total-items="totalItem" :loading="loading" select-all item-key="id" class="elevation-0">
                                <template v-slot:headers="props">
                                    <tr>
                                        <th>
                                            <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate"
                                                primary hide-details @click.stop="toggleAll"></v-checkbox>
                                        </th>
                                        <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                            @click="changeSort(header.value)">
                                            <v-icon small>arrow_upward</v-icon>
                                            {{ header.text }}
                                        </th>
                                    </tr>
                                </template>
                                <template v-slot:items="props">
                                    <tr>
                                        <td :active="props.selected" @click="props.selected = !props.selected">
                                            <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                        </td>
                                        <td>{{props.item.index+1}}</td>
                                        <td style="cursor:pointer;" class="text-capitalize name-linking" @click="editItem(props.item.id)">{{
                                            props.item.name }}</td>
                                        <td>{{ props.item.unit.title }}</td>
                                        <td>{{ props.item.price }}</td>
                                        <td>
                                            <router-link class="text-uppercase name-linking" :to="'/'+$route.params.username+'/Dashboard/Items/'+props.item.id+'/totalStock'">{{
                                                props.item.totalstock}}</router-link>
                                        </td>
                                        <td>
                                            <router-link class="text-uppercase name-linking" :to="'/'+$route.params.username+'/Dashboard/Items/'+props.item.id+'/usedStock'">{{
                                                props.item.usedstock}}</router-link>
                                        </td>
                                        <td>{{ props.item.totalstock - props.item.usedstock }}</td>
                                        <td>
                                            <v-icon small class="mr-12" @click="editItem(props.item.id)">edit
                                            </v-icon>
                                        </td>
                                    </tr>
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                    <v-dialog width="800" v-model="showModal">
                        <v-card>
                            <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                                <span style="font-size:18px;" v-if="editValue==null">Add Item</span>
                                <span style="font-size:18px;" v-else>Edit Item</span>
                            </v-card-title>
                            <v-card-text class="pa-0">
                                <v-container grid-list-xs>
                                    <addEditItem v-if="showModal==true" v-model="closeModal1" :id="editValue"></addEditItem>
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
                    <v-dialog width="800" v-model="showBulk" persistent>
                        <v-card>
                            <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                                <span style="font-size:18px;">Add Items In Bulk</span>
                            </v-card-title>
                            <v-card-text class="pa-0">
                                <v-container grid-list-xs v-if="showBulk==true">
                                    <v-layout align-center justify-start row wrap>
                                        <v-flex xs5 sm9></v-flex>
                                        <v-flex xs7 sm3>
                                            <v-btn color="info" @click="$refs.sampleFile.click()">Get Sample File</v-btn>
                                            <a :href="url+'/'+$route.params.username+'/api/fileUploads/SampleFiles/download/AddItems.xlsx?access_token='+this.$store.state.token"
                                                download ref="sampleFile"> </a>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout class="mb-3" row wrap>
                                        <v-flex xs10 sm8 class="font-20">
                                            <v-icon style="color:red">info </v-icon> File should be in this specified
                                            Format:-
                                        </v-flex>
                                        <v-flex xs2 sm4></v-flex>
                                    </v-layout>
                                    <v-layout row wrap class="mb-3">
                                        <v-flex sm12 class="font-14">a) Item name , b) Bill Name , c) Price , d) Type ,
                                            e) SubType , f) Unit , g) Hsn Code , h) Bar Code</v-flex>
                                    </v-layout>
                                    <v-layout row wrap class="mb-3">
                                        <v-flex sm12 class="font-18">[<b>Note</b>:- Item Name, Bill Name , Price , Type
                                            , SubType , Unit are compulsory Fields]</v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex sm12>
                                            <!-- begin panel -->
                                            <div @drop="_drop" @dragenter="_suppress" @dragover="_suppress"
                                                data-sortable-id="form-dropzone-1" style="cursor:pointer" @click="$refs.fileInput.click()">

                                                <div>

                                                    <div>
                                                        <form>
                                                            <h4 class="dropzone-bulk">Drop Your Files <b>Here</b> or <b>Click</b>
                                                                to Upload</h4>

                                                            <input type="file" ref="fileInput" class="form-control" id="file"
                                                                style="display:none" :accept="SheetJSFT" @change="_change" />
                                                            <!--<img src="/img/dropzoneImg.png"/>-->

                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- end panel -->

                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" flat @click="showBulk = false">
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
    import addEditItem from '@/components/Items/addEditItems.vue';
    var XLSX = require('xlsx')
    const _SheetJSFT = [
        "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
    ].map(function (x) { return "." + x; }).join(",");
    export default {
        components: {
            addEditItem
        },
        data() {
            return {
                header: [{
                    text: '#',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                { text: 'Name', value: 'name', sortable: false },
                { text: 'Unit', value: 'unit' },
                { text: 'Price(Rs.)', value: 'price' },
                { text: 'Total Stock', value: 'totalstock' },
                { text: 'Used Stock', value: 'usedstock' },
                { text: 'Available Stock', value: 'pending' },
                { text: 'Edit', value: 'name' }],
                loading: true,
                pagination: {},
                url: process.env.URL,
                itemDtl: [],
                selectItem: [],
                search: '',
                addinBulk: 0,
                showModal: false,
                showBulk: false,
                totalItem: 0,
                SheetJSFT: _SheetJSFT,
                editValue: null,
                closeModal1: 1,
                loadingPDF: false,
                loadingExcel: false
            }
        },
        updated() {
            //console.log(this.selectItem)
            if (this.closeModal1 == 2) {
                this.showModal = false
                this.closeModal1 = 1
                this.getDataFromApi()
                    .then(data => {
                        this.itemDtl = data.items
                        this.totalItem = data.total
                    })
            }
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.itemDtl = data.items
                            this.totalItem = data.total
                        })
                },
                deep: true
            },
            search: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.itemDtl = data.items
                            this.totalItem = data.total
                        })
                }
            }
        },
        mounted() {
            this.getDataFromApi()
                .then(data => {
                    this.itemDtl = data.items
                    this.totalItem = data.total
                })
        },
        methods: {
            _suppress(evt) { evt.stopPropagation(); evt.preventDefault(); },
            _drop(evt) {
                evt.stopPropagation(); evt.preventDefault();
                const files = evt.dataTransfer.files;
                if (files && files[0]) this._file(files[0]);
            },
            _change(evt) {
                const files = evt.target.files;
                if (files && files[0]) this._file(files[0]);
            },
            _file(file) {
                /* Boilerplate to set up FileReader */
                const reader = new FileReader();
                reader.onload = (e) => {
                    /* Parse data */
                    const bstr = e.target.result;
                    const wb = XLSX.read(bstr, { type: 'binary' });
                    /* Get first worksheet */
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    /* Convert array of arrays */
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                    //console.log(JSON.stringify(data))
                    let promise = new Promise((resolve, reject) => {

                        this.$axios.get('/' + this.$route.params.username + '/api/Types?access_token=' + this.$store.state.token)
                            .then(res => {
                                this.$axios.get('/' + this.$route.params.username + '/api/Subtypes?access_token=' + this.$store.state.token)
                                    .then(res1 => {
                                        this.$axios.get('/' + this.$route.params.username + '/api/Units?access_token=' + this.$store.state.token)
                                            .then(res2 => {
                                                this.type1 = res.data;
                                                this.subType1 = res1.data;
                                                this.unit1 = res2.data;
                                                // console.log(this.type1)
                                                // console.log(this.unit1)
                                                // console.log(this.subType1)
                                                resolve("1");
                                            })
                                    })
                            })
                    });
                    promise.then((reso) => {
                        if (reso == "1") {
                            let a = [];
                            let d = "";
                            let j = 0;
                            let promise1 = new Promise((resolve, reject) => {

                                for (let i = 1; i < data.length; i++) {

                                    if (data[i][0] != null && data[i][1] != null && data[i][2] != null && data[i][3] != null && data[i][4] != null && data[i][5] != null) {
                                        a[j] = new Object()
                                        a[j].name = data[i][0];
                                        a[j].billname = data[i][1];
                                        a[j].price = data[i][2];
                                        a[j].content = "abc";
                                        for (let e = 0; e < this.type1.length; e++) {
                                            //console.log(data[i][3]+" "+this.type1[e].name)
                                            if (this.type1[e].name == data[i][3]) {
                                                //console.log(this.subType1)
                                                for (let k = 0; k < this.subType1.length; k++) {
                                                    if (this.subType1[k].typeId == this.type1[e].id && this.subType1[k].name == data[i][4]) {
                                                        a[j].subTypeId = this.subType1[k].id;
                                                        //console.log(a[j].subTypeId)
                                                        //console.log(this.type1[e].id)
                                                        break;
                                                    }
                                                }
                                                break;
                                            }
                                        }
                                        for (let d = 0; d < this.unit1.length; d++) {
                                            if (this.unit1[d].title == data[i][5]) {
                                                a[j].unitId = this.unit1[d].id;
                                                break;
                                            }
                                        }
                                        a[j].hsncode = data[i][6];
                                        a[j].barcode = data[i][7];
                                        a[j].isenabled = 1;
                                        a[j].createdon = new Date();
                                        a[j].modifiedon = new Date();
                                        a[j].createdById = 1;
                                        a[j].modifiedById = 1;
                                        j++;
                                    }
                                    else {
                                        //console.log('bb')
                                        d += i + " , ";
                                    }
                                }
                                resolve();
                            });
                            promise1.then((resolve) => {
                                if (d.length > 0) {
                                    alert("Your Row number " + d + " is/are not valid Entry/Entries")
                                    this.showBulk = false

                                }
                                this.$axios.post("/" + this.$route.params.username + "/api/Items?access_token=" + this.$store.state.token, a)
                                    .then(res => {
                                        //alert("Inserted"); 
                                        //window.location=""
                                        this.showBulk = false
                                        this.getDataFromApi()
                                            .then(data => {
                                                this.itemDtl = data.items
                                                this.totalItem = data.total
                                            });
                                        //this.generate()
                                    });

                            });

                        }
                    });
                    //console.log(b);


                    /* Update state */
                };
                reader.readAsBinaryString(file);
            },
            toggleAll() {
                if (this.selectItem.length) this.selectItem = []
                else this.selectItem = this.itemDtl.slice()
            },
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
                            body[i] = [(item[i].index + 1), item[i].name, item[i].unit.title, item[i].price, item[i].totalstock, item[i].usedstock, (item[i].totalstock - item[i].usedstock)]
                        }
                        if (type == "pdf") {
                            this.$createPDF(header, body, "Items Listing", process)
                                .then((resolve) => { this.loadingPDF = false })
                        }
                        else {
                            this.$createExcel(header, body, "Items Listing", process)
                                .then((resolve) => { this.loadingExcel = false })
                        }
                    });
            },
            getDataFromApi() {
                this.loading = true
                return new Promise((resolve, reject) => {
                    const { sortBy, descending, page, rowsPerPage } = this.pagination
                    //console.log("aa")
                    let items = "";
                    this.$axios.get('/' + this.$route.params.username + '/api/Items/getItems?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","search":"' + this.search + '","sort":"' + sortBy + '","descending":"' + descending + '"}')
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
            async deleteItem() {

                if (confirm("Do you really want to delete?")) {
                    let promise = new Promise((resolve, reject) => {
                        for (let i = 0; i < this.selectItem.length; i++) {
                            //console.log(this.selectCustomer[i]);
                            this.$axios.post("/" + this.$route.params.username + "/api/Items/update?access_token=5FIQwvmvvuUCeQqfSqT1xCmGf7GdvJe4SUTPTUQ5Q2om9vxss8CadPNHCeVjP23L&where[id]=" + this.selectItem[i].id,
                                {
                                    isenabled: 0
                                })
                                .then(res => {
                                    this.$axios.post("/" + this.$route.params.username + "/api/Stocklogs/update?access_token=5FIQwvmvvuUCeQqfSqT1xCmGf7GdvJe4SUTPTUQ5Q2om9vxss8CadPNHCeVjP23L&where[itemId]=" + this.selectItem[i].id,
                                        {
                                            isenabled: 0
                                        })
                                        .then(res1 => {
                                            resolve("1");
                                        })

                                });
                        }
                    });
                    promise.then((resolve) => {
                        if (resolve == "1") {
                            //alert("Successfully Deleted")
                            //window.location="";
                            this.getDataFromApi()
                                .then(data => {
                                    this.itemDtl = data.items
                                    this.totalItem = data.total
                                })
                        }
                    })

                }
                else { }
            },
            editItem(val) {
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