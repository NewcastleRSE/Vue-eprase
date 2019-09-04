import Vue from 'vue'
import Router from 'vue-router';

import Welcome from './components/Welcome.vue';
import Home from './components/Home.vue';
import About from './components/About.vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Instructions from "./components/Instructions";
import AssessmentIntro from "./components/AssessmentIntro";
import AssessmentHome from "./components/AssessmentHome";
import AssessmentPart1 from './components/AssessmentPart1';
import AssessmentPart2 from './components/AssessmentPart2';
import AssessmentPart3 from './components/AssessmentPart3';
import AssessmentPart4 from './components/AssessmentPart4';
import LockoutScreen from './components/LockoutScreen';
import AssessmentResults from './components/AssessmentResults';

Vue.use(Router);

export const router = new Router({

  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/instructions',
      component: Instructions
    },
    {
      path: '/assessmentintro',
      component: AssessmentIntro
    },
    {
      path: '/assessmenthome',
      component: AssessmentHome
    },
    {
      path: '/assessmentpart1',
      component: AssessmentPart1
    },
    {
      path: '/assessmentpart2',
      component: AssessmentPart2
    },
    {
      path: '/assessmentpart3',
      component: AssessmentPart3
    },
    {
      path: '/assessmentpart4',
      component: AssessmentPart4
    },
    {
      path: '/lockoutscreen',
      component: LockoutScreen
    },
    {
      path: '/assessmentresults',
      component: AssessmentResults
    },
    // otherwise redirect to welcome
    { path: '*', redirect: '/' }
  ]

})


router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page

  // list public pages
  const publicPages = ['/login','/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
});
