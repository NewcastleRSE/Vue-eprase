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
import AssessmentReports from "./components/AssessmentReports";
import ResultsTable from './components/ResultsTable';
import AppCharts from "./components/AppCharts";
import ResetPassword from "./components/ResetPassword";
import RequestPassword from "./components/RequestPassword";
import SetPatients from "./components/SetPatients";

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
      path: '/lockoutscreen/:patientscompleted?',
      component: LockoutScreen
    },
    {
      path: '/assessmentresults/:ID?',
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
      path: '/assessmentreports',
      component: AssessmentReports
    },
    {
      path: '/resultstable',
      component: ResultsTable
    },
    {
      path: '/charts',
      component: AppCharts
    },
    {
      path: '/setpatients/:type?',
      component: SetPatients
    },
    {
      path: '/resetpassword/:token?',
      component: ResetPassword
    },
    {
      path: '/requestpassword',
      component: RequestPassword
    },
    // otherwise redirect to welcome
    { path: '*', redirect: '/' }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  }

})


router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page

  // list public pages
  const publicPages = ['/','/login','/register','/requestpassword','/resetpassword','/instructions', '/assessmentcontent', '/categorytable'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    return next('/login');
  }
  next();
});
