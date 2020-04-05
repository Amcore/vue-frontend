<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div>
      <el-button @click='test'>
        API TEST
      </el-button>

      <el-button @click='normal'>
        API NORMAL
      </el-button>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Api from '@/api/test.js'
export default {
  mounted() {
  },

  methods: {
    test() {
      Api
        .test()
        .then((res) => {
          console.log(res)
        })
    },

    normal() {
      Api
        .normal()
        .then((res) => {
          console.log(res)
        })
    }
  }
}
</script>>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
