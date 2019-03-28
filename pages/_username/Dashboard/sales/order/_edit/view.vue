<template>
    <div>
        <div id="section-to-print">
            <Receipt :id="this.$route.params.edit" :noofbill="2"/>
        </div>
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
