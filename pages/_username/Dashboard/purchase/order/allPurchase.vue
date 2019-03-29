<template>
    <div>   
        <MonthlyRecord mode="purchase"/>
    </div>
</template>
<script>
import MonthlyRecord from "~/components/MonthlyRecord"
export default {
    layout: "dashboard",
    components:{
        MonthlyRecord
    }
}
</script>