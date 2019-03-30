<template>
    
</template>
<script>
export default {
    beforeCreate(){
        this.$router.push("/"+this.$route.params.username+"/login")
    }
}
</script>