import Vue from 'vue'
import Router from 'vue-router';

import AppWelcome from './components/AppWelcome.vue';
import AppLogin from './components/AppLogin.vue';
import AppRegister from './components/AppRegister.vue';
import AssessmentIntro from "./components/AssessmentIntro";
import AssessmentHome from "./components/AssessmentHome";
import AssessmentSystem from './components/AssessmentSystem';
import AssessmentPatients from './components/AssessmentPatients';
import AssessmentPatientDetails from './components/AssessmentPatientDetails';
import AssessmentScenarios from './components/AssessmentScenarios';
import LockoutScreen from './components/LockoutScreen';
import ResultsHome from './components/ResultsHome';
import AssessmentResults from './components/AssessmentResults';
import AssessmentContent from './components/AssessmentContent';
import PieChart from './components/PieChart';

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
      component: AppRegister
    },
    {
      path: '/',
      component: AppWelcome
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
      path: '/assessmentSystem',
      component: AssessmentSystem
    },
    {
      path: '/assessmentpatients',
      component: AssessmentPatients
    },
    {
      path: '/assessmentpatientdetails',
      component: AssessmentPatientDetails
    },
    {
      path: '/assessmentscenarios',
      component: AssessmentScenarios
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
    {
      path: '/charts',
      component: PieChart
    },
    // otherwise redirect to welcome
    { path: '*', redirect: '/' }
  ]

})


router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page

  // list public pages
  const publicPages = ['/','/login','/register','/instructions', '/assessmentcontent', '/categorytable'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
});
