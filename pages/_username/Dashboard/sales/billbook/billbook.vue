<template>
    <div>   
        <MonthlyRecord mode="billbook"/>
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