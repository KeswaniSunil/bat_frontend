<template>
    <div id="section-to-print">
        <Receipt :id="this.$route.params.edit" :noofbill="2"/>
    </div>	
</template>
<script>
import Receipt from "~/components/receiptUI";
export default {
    components:{
       Receipt
    }
}
</script>
<style>
@media print {
    body * {
      visibility: hidden;
    }
    body{
        background: white;
    }
    #section-to-print, #section-to-print * {
      visibility: visible;
    }
    .pagebreak
    {
        page-break-after: always;
    }   
    .padding-print-0{
        padding:0px !important;
    }
  }
</style>
