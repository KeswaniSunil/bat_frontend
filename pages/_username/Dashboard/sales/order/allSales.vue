<template>
    <div>   
        <MonthlyRecord mode="sale"/>
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