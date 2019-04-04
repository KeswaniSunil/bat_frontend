<template>
  <div class="loading-page body-background" v-if="loading">
    <div class="spin-icon"></div>
  </div>
</template>

<script>
export default {
  layout:'dashboard',
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  z-index:2;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items:center;
}
.loading-page .spin-icon {
  margin: auto;
  width: 50px;
  height: 50px;

  border: solid 3px transparent;
  border-top-color:  #666;
  border-left-color: #666;
  border-radius: 50px;

  -webkit-animation: loading-spinner 500ms linear infinite;
  -moz-animation:    loading-spinner 500ms linear infinite;
  -ms-animation:     loading-spinner 500ms linear infinite;
  -o-animation:      loading-spinner 500ms linear infinite;
  animation:         loading-spinner 500ms linear infinite;
}

@-webkit-keyframes loading-spinner {
  0%   { -webkit-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
}

@-moz-keyframes loading-spinner {
  0%   { -moz-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -moz-transform: rotate(360deg); transform: rotate(360deg); }
}

@-o-keyframes loading-spinner {
  0%   { -o-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -o-transform: rotate(360deg); transform: rotate(360deg); }
}

@-ms-keyframes loading-spinner {
  0%   { -ms-transform: rotate(0deg);   transform: rotate(0deg); }
  100% { -ms-transform: rotate(360deg); transform: rotate(360deg); }
}

@keyframes loading-spinner {
  0%   { transform: rotate(0deg);   transform: rotate(0deg); }
  100% { transform: rotate(360deg); transform: rotate(360deg); }
}
</style>