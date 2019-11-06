import Vue from 'vue'
import Router from 'vue-router';

import AppWelcome from './components/AppWelcome.vue';
import AppHome from './components/AppHome.vue';
import AppAbout from './components/AppAbout.vue';
import AppLogin from './components/AppLogin.vue';
import AppRegister from './components/AppRegister.vue';
import AppInstructions from "./components/AppInstructions";
import AssessmentIntro from "./components/AssessmentIntro";
import AssessmentHome from "./components/AssessmentHome";
import AssessmentPart1 from './components/AssessmentPart1';
import AssessmentPart2 from './components/AssessmentPart2';
import AssessmentPart3 from './components/AssessmentPart3';
import AssessmentPart4 from './components/AssessmentPart4';
import LockoutScreen from './components/LockoutScreen';
import ResultsHome from './components/ResultsHome';
import AssessmentResults from './components/AssessmentResults';
import ContentHolder from './components/AssessmnentContent';

Vue.use(Router);

export const router = new Router({

  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: AppLogin
    },
    {
      path: '/register',
      name: 'register',
      component: AppRegister
    },
    {
      path: '/home',
      name: 'home',
      component: AppHome
    },
    {
      path: '/about',
      name: 'about',
      component: AppAbout
    },
    {
      path: '/',
      name: 'welcome',
      component: AppWelcome
    },
    {
      path: '/instructions',
      component: AppInstructions
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
      path: '/assessmentresults/:ID',
      name: 'assessmentresults',
      component: AssessmentResults
    },
    {
      path: '/resultshome',
      component: ResultsHome
    },
    {
      path: '/assessmentcontent',
      component: AssessmentContent
    },
    // otherwise redirect to welcome
    { path: '*', redirect: '/' }
  ]

})


router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page

  // list public pages
  const publicPages = ['/','/login','/register','/instructions', '/assessmentcontent'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
});
