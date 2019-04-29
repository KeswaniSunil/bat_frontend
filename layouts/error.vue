<template>
    <v-layout justify-center align-center>
        <v-flex text-xs-center>
            <div class="display-4 font-weight-medium info--text">4 0 4</div>
            <div class="font-24 mt-3">Page Not Found</div>
            <v-btn :to="'/'" round color="info" class="mt-3">Back To Home</v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
  components: {
  },
  
  data: () => ({})
};
</script>
