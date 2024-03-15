import { createRouter, createWebHistory } from "vue-router"
import { authenticationStore } from "../stores/authentication"

import AppWelcome from "../components/AppWelcome.vue"
import AppLogin from "../components/AppLogin.vue"
import AppRegister from "../components/AppRegister.vue"
import AssessmentIntro from "../components/AssessmentIntro"
import AssessmentSystem from "../components/AssessmentSystem"
import AssessmentPatients from "../components/AssessmentPatients"
import AssessmentPatientDetails from "../components/AssessmentPatientDetails"
import AssessmentScenarios from "../components/AssessmentScenarios"
import LockoutScreen from "../components/LockoutScreen"
import ResultsHome from "../components/ResultsHome"
import AssessmentResults from "../components/AssessmentResults"
import AssessmentReports from "../components/AssessmentReports"
import ResultsTable from "../components/ResultsTable"
import AppCharts from "../components/AppCharts"
import ResetPassword from "../components/ResetPassword"
import RequestPassword from "../components/RequestPassword"
import SetPatients from "../components/SetPatients"
import AdminHome from "../components/AdminHome"
import MitigationComparison from "../components/MitigationComparison"
import EpmaStatistics from "../components/EpmaStatistics"
import AllAssessmentReports from "../components/AllAssessmentReports"
import ConfigErrorResults from "../components/ConfigErrorResults"
import EpSystemComparison from "../components/EpSystemComparison"
import HighRiskComparison from "../components/HighRiskComparison"
import CategoryComparison from "../components/CategoryComparison"

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: AppLogin,
    },
    {
      path: "/register",
      component: AppRegister,
    },
    {
      path: "/",
      component: AppWelcome,
    },
    {
      path: "/assessmentintro",
      component: AssessmentIntro,
      // beforeEnter: (to, from, next) => {

      // }
    },
    {
      path: "/assessmentSystem",
      component: AssessmentSystem,
    },
    {
      path: "/assessmentpatients",
      component: AssessmentPatients,
    },
    {
      path: "/assessmentpatientdetails",
      component: AssessmentPatientDetails,
    },
    {
      path: "/assessmentscenarios",
      component: AssessmentScenarios,
    },
    {
      path: "/lockoutscreen/:patientscompleted?",
      component: LockoutScreen,
    },
    {
      path: "/assessmentresults/:ID?",
      name: "assessmentresults",
      component: AssessmentResults,
    },
    {
      path: "/resultshome",
      component: ResultsHome,
    },
    {
      path: "/assessmentreports",
      component: AssessmentReports,
    },
    {
      path: "/resultstable",
      component: ResultsTable,
    },
    {
      path: "/charts",
      component: AppCharts,
    },
    {
      path: "/setpatients/:type?",
      component: SetPatients,
    },
    {
      path: "/resetpassword/:token?",
      component: ResetPassword,
    },
    {
      path: "/requestpassword",
      component: RequestPassword,
    },
    {
      path: "/adminhome",
      component: AdminHome,
    },
    {
      path: "/mitigationcomparison",
      component: MitigationComparison,
    },
    {
      path: "/epsystemcomparison",
      component: EpSystemComparison,
    },
    {
      path: "/highriskcomparison",
      component: HighRiskComparison,
    },
    {
      path: "/categorycomparison",
      component: CategoryComparison,
    },
    {
      path: "/epmastatistics",
      component: EpmaStatistics,
    },
    {
      path: "/configerrorresults",
      component: ConfigErrorResults,
    },
    {
      path: "/allassessmentreports",
      component: AllAssessmentReports,
    },
    // otherwise redirect to welcome (see https://router.vuejs.org/guide/migration/)
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  }
})

// Hook to disable browser back button (pretty desperate stuff)
router.afterEach((to, from) => {

  console.group('router.afterEach()')
  console.debug('Navigated to', to, 'from', from)

  console.debug('Replacing history state...')
  history.replaceState(history.state, '', to.path)
  console.debug('Assign onpopstate handler...')
  window.onpopstate = () => history.go(1)

  console.debug('Done')
  console.groupEnd()
})

// Hook to ensure user logged in for all non-public pages
router.beforeEach((to, from, next) => {
 
  console.group('router.beforeEach()')
  console.debug('Navigating to', to, 'from', from, 'next', next)

  const publicPages = ['/', '/login', '/failedlogin', '/register', '/requestpassword', '/resetpassword', '/instructions', '/assessmentcontent', '/categorytable']
  const authRequired = !publicPages.includes(to.path)
  console.debug('Authentication required', authRequired)

  const loggedIn = authenticationStore().isLoggedIn
  console.debug('Logged in user', loggedIn)

  if (authRequired && !loggedIn) {

    console.debug('Routing to login page...')
    console.groupEnd()

    return next('/login')
  } else {

    console.debug('Routing to', to)
    console.groupEnd()

    next()
  }
})
