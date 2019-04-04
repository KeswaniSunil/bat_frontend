<template>
    <csProfile mode="supplier" :id="$route.params.view"/>
</template>
<script>
import csProfile from "@/components/csProfile";
export default {
    layout:"dashboard",
    components:{
        csProfile
    }
}
</script>
