<template>
  <div id="app">
    <div class="navbar-wrap">
      <b-navbar toggleable type="light" variant="light">
          <b-navbar-toggle target="nav_text_collapse"></b-navbar-toggle>
          <b-navbar-brand>BFS Search</b-navbar-brand>
          <b-collapse is-nav id="nav_text_collapse">
              <b-navbar-nav>
                <b-nav-item href="#"><router-link to="/">Планировщик</router-link></b-nav-item>
                <!-- <b-nav-item href="#"><router-link to="/">Результаты</router-link></b-nav-item> -->
                <b-nav-item href="#"><router-link to="/task-manager">Протокол работы</router-link></b-nav-item>
                  <!-- <b-nav-text>Navbar text</b-nav-text> -->
              </b-navbar-nav>
          </b-collapse>
      </b-navbar>
    </div>
    <b-container class="bv-example-row" fluid>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->



          <router-view/>
    </b-container>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.navbar-wrap{
  margin-bottom: 10px;
}
</style>
