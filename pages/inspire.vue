<template>
  <v-layout row wrap>
    <v-flex xs12 text-xs-center>
      <div>
      <v-tabs
          v-model="tab"
          color="grey lighten-2"
          grow
          light
        >
          <v-tabs-slider color="black"></v-tabs-slider>

          <v-tab
            v-for="item in items"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
    
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in items"
        :key="item"
      >
        <v-card flat>
          <v-card-text>{{ text }}</v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
    </v-flex>
    <v-flex xs12>
        <v-layout align-start justify-center row wrap>
        <v-flex v-for="(item,index) in items" :key="index" xs4 sm3 md2>
        <v-btn round @click="isActive=index"  style="width:90%" :class="[index == isActive ? active : notactive]">
            {{item}}
        </v-btn>
        </v-flex>
        </v-layout>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
    data () {
      return {
        tab: null,
        isActive:0,
        notactive: 'red red--text text--lighten-4',
        active: 'red white--text',
        items: [
          'web', 'shopping', 'videos', 'images', 'news'
        ],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      }
    }
  }
</script>
<style>
</style>