<template>
    <csProfile mode="customer" :id="$route.params.view"/>
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
