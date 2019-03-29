<template>
    <bill :id="$route.params.edit" type="view"/>
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