<template>
    <bill :id="$route.params.edit" class="mt-3"/>
</template>

<script>
import bill from "~/components/purchase/bill";
export default {
    layout: "dashboard",
    components:{
       bill
    }
}
</script>