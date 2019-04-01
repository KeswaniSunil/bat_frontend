<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-card class="border-radius-5">
        <v-card-text>
          <v-layout align-center justify-start row wrap>
            <v-flex xs1 sm8></v-flex>
            <v-flex xs6 sm2>
              <v-layout align-center justify-start row wrap>
                <v-flex sm3></v-flex>
                <v-flex sm9>
                  <v-btn color="info" round class="pa-2" @click="showModal = true,editValue=null">
                    <v-icon dark small class="mr-2"> gavel</v-icon>Add Supplier
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs5 sm2>
              <v-layout align-center justify-start row wrap>
                <v-flex sm2></v-flex>
                <v-flex sm10>
                  <v-btn color="info" round class="pa-2" @click="showBulk = true">
                    <v-icon dark small class="mr-2"> gavel</v-icon>Add In Bulk
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

          <csListingComponent v-model="editValue" :modalAction="closeModal1" mode="supplier" />

          <v-dialog width="800" v-model="showModal" persistent>
            <v-card>
              <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                <span style="font-size:18px;" v-if="editValue==null">Add Supplier</span>
                <span style="font-size:18px;" v-else>Edit Supplier</span>
              </v-card-title>
              <v-card-text class="pa-0">
                <v-container grid-list-xs>
                  <csAddComponent v-if="showModal==true" v-model="closeModal1" mode="supplier" :id="editValue"></csAddComponent>
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
                <span style="font-size:18px;">Add Customer In Bulk</span>
              </v-card-title>
              <v-card-text class="pa-0">
                <v-container grid-list-xs v-if="showBulk==true">
                  <v-layout align-center justify-start row wrap>
                    <v-flex xs5 sm9></v-flex>
                    <v-flex xs7 sm3>
                      <v-btn color="info" @click="$refs.sampleFile.click()">Get Sample File</v-btn>
                      <a :href="url+'/'+$route.params.username+'/api/fileUploads/SampleFiles/download/AddSupplier.xlsx?access_token='+this.$store.state.token"
                        download ref="sampleFile"> </a>
                    </v-flex>
                  </v-layout>
                  <v-layout class="mb-3" row wrap>
                    <v-flex xs10 sm8 class="font-20">
                      <v-icon style="color:red">info </v-icon> File should be in this specified Format:-
                    </v-flex>
                    <v-flex xs2 sm4></v-flex>
                  </v-layout>
                  <v-layout row wrap class="mb-3">
                    <v-flex sm12 class="font-14">a) Supplier name , b) Mobile No , c) Email , d) Street , e) Area , f)
                      Pincode , g) City , h) State , i) Gstn , j) StateCode</v-flex>
                  </v-layout>
                  <v-layout row wrap class="mb-3">
                    <v-flex sm12 class="font-18">[<b>Note</b>:- Supplier Name,Mobile No. are compulsory Fields]</v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex sm12>
                      <!-- begin panel -->
                      <div @drop="_drop" @dragenter="_suppress" @dragover="_suppress" data-sortable-id="form-dropzone-1"
                        style="cursor:pointer" @click="$refs.fileInput.click()">
                        <div>
                          <div>
                            <form>
                              <h4 class="dropzone-bulk">Drop Your Files <b>Here</b> or <b>Click</b> to Upload</h4>
                              <input type="file" ref="fileInput" class="form-control" id="file" style="display:none"
                                :accept="SheetJSFT" @change="_change" />
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
  import csAddComponent from "~/components/csAddComponent";
  import csListingComponent from "~/components/csListingComponent";
  var XLSX = require('xlsx')
  const _SheetJSFT = [
    "xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
  ].map(function (x) { return "." + x; }).join(",");
  export default {
    components: {
      csAddComponent,
      csListingComponent
    },
    data() {
      return {
        addinBulk: 0,
        showModal: false,
        showBulk: false,
        editValue: null,
        closeModal1: 1,
        url: process.env.URL,
        SheetJSFT: _SheetJSFT
      }

    },
    updated() {
      // closeModal = 2 means reload the datatable
      if (this.closeModal1 == 2) {
        this.showModal = false
      }
    },
    watch: {
      editValue: {
        handler() {
          this.closeModal1 = 0
          if (this.editValue != null) {
            this.showModal = true
          }
        }
      }
    },
    mounted() {

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
          var a = []
          var j = 0;
          let d = "";
          let promise = new Promise((resolve, reject) => {
            for (let i = 1; i < data.length; i++) {
              if (data[i][0] != null && data[i][1] != null) {
                a[j] = new Object()
                a[j].name = data[i][0];
                a[j].mobile = data[i][1];
                a[j].email = data[i][2];
                a[j].street = data[i][3];
                a[j].area = data[i][4];
                a[j].pincode = data[i][5];
                a[j].city = data[i][6];
                a[j].state = data[i][7];
                a[j].gstin = data[i][8];
                a[j].statecode = data[i][9];
                a[j].isenabled = 1;
                a[j].createdon = new Date();
                a[j].modifiedon = new Date();
                a[j].createdById = this.$store.state.userId;
                a[j].modifiedById = this.$store.state.userId;
                j++;
              }
              else {
                d += i + " , ";
              }

            }
            resolve();
          });

          promise.then((resolve) => {
            if (d.length > 0) {
              alert("Your Row number " + d + " is/are not valid Entry/Entries")
              this.showBulk = false

            }
            this.$axios.post("/" + this.$route.params.username + "/api/Suppliers?access_token=" + this.$store.state.token, a)
              .then(res => {
                this.showBulk = false
              });


          });
        };
        reader.readAsBinaryString(file);
      }
    }
  }
</script>
<style>

</style>