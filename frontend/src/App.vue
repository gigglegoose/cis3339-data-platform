<!-- This is the main frontend file. It displays a navigation bar and rendered components. -->

<template>
  <main class="flex flex-row">
    <div id="_container" class="min-h-screen">
      <header class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@/assets/DanPersona.svg" alt="Data Platform logo" />
        </section>
        <!--Navigation bar-->
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <!-- Dashboard link -->
            <li>
              <router-link to="/">
                <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                Dashboard
              </router-link>
            </li>
            <!--Login link - Link only shows is user is logged out-->
            <li v-if="!user.isLoggedIn">
              <router-link to="/login">
                <span style="position:relative; top: 6px" class="material-icons">login</span>
                Login
              </router-link>
            </li>
            <!--Logout link - Link only shows is user is logged in-->
            <li v-if="user.isLoggedIn" @click.prevent="user.logout" style="cursor: pointer;">
              <span style="position:relative; top: 6px" class="material-icons">logout</span>
              Logout
            </li>
            <!--Client Intake Form link - only shows if user is an editor-->
            <li v-if="user.role === 'editor'">
              <router-link to="/clientform">
                <span style="position: relative; top: 6px" class="material-icons">people</span>
                Client Intake Form
              </router-link>
            </li>
            <!--Create Event link - only shows if user is an editor-->
            <li v-if="user.role === 'editor'">
              <router-link to="/eventform">
                <span style="position: relative; top: 6px" class="material-icons">event</span>
                Create Event
              </router-link>
            </li>
            <!--Create Service link - only shows if user is an editor-->
            <li v-if="user.role === 'editor'">
              <router-link to="/serviceform">
                <span style="position: relative; top: 6px" class="material-icons">volunteer_activism</span>
                Create Service
              </router-link>
            </li>
            <!--Find Client link - only shows if user is logged in-->
            <li v-if="user.isLoggedIn">
              <router-link to="/findclient">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Client
              </router-link>
            </li>
            <!--Find Event link - only shows if user is logged in-->
            <li v-if="user.isLoggedIn">
              <router-link to="/findevents">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Event
              </router-link>
            </li>
            <!--Find Service link - only shows if user is logged in-->
            <li v-if="user.isLoggedIn">
              <router-link to="/findservice">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Service
              </router-link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <!--Organization Name Header-->
      <section class="justify-end items-center h-24 flex"
        style="background: linear-gradient(250deg, #c8102e 70%, #efecec 50.6%)">
        <h1 class="mr-20 text-3xl text-white"> {{ orgName }}</h1>
      </section>
      <!--Page Content-->
      <div>
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script setup>
// MIGRATION NOTE: Converted from the Options API (setup, data, created, and methods options)
// to the Composition API using <script setup>. Everything declared at the top level of
// <script setup> is automatically available in the template, so there's no return object.
import { ref, onMounted } from 'vue'
import { useLoggedInUserStore } from './store/loggedInUser'
import { getOrgName } from './api/api'
import { useToast } from 'vue-toastification'

//Notifications
const toast = useToast()

// MIGRATION NOTE: the Pinia store used to be returned from setup(); now it is a plain
// top-level const. The template still calls user.logout and reads user.role / user.isLoggedIn.
const user = useLoggedInUserStore()

// MIGRATION NOTE: the data option (orgName) became a ref. Read/write it with orgName.value in script;
// the template unwraps it automatically, so {{ orgName }} did not change.
const orgName = ref('Dataplatform')

// MIGRATION NOTE: the async created hook became onMounted().
// The old catch block did `throw (error)` with no `error` variable declared, which caused a
// ReferenceError. Now the error is caught, logged, and the default org name stays on screen.
onMounted(async () => {
  try {
    orgName.value = await getOrgName()
  } catch (error) {
    console.error('Unable to load organization name:', error)
    toast.error('Unable to load organization name')
  }
})

// MIGRATION NOTE: the old logout() method was removed on purpose. It called
// this.$store.dispatch('clearSessionData'), which is Vuex, but this project uses Pinia.
// It was never called (the nav uses user.logout from the Pinia store), so it was dead code.
</script>

<style scoped>
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}
</style>
