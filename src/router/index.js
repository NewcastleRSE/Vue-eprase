import { createRouter, createWebHistory } from "vue-router"
import { authenticationStore } from "../stores/authentication"

import AppWelcome from "../components/AppWelcome"
import AppLogin from "../components/AppLogin"
import AppLogout from "../components/AppLogout"
import AppRegister from "../components/AppRegister"
import AssessmentIntro from "../components/AssessmentIntro"
import AssessmentSystem from "../components/AssessmentSystem"
import AssessmentPatients from "../components/AssessmentPatients"
import AssessmentPatientDetails from "../components/AssessmentPatientDetails"
import AssessmentScenarios from "../components/AssessmentScenarios"
import AssessmentResults from "../components/AssessmentResults"
import UserManager from "../components/UserManager"
import AdminHome from "../components/AdminHome"
import PrintablePdf from "../components/PrintablePdf"
import VueformTest from "../components/VueformTest"

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/test",
      name: "test",
      component: VueformTest
    },
    {
      path: "/login/:action?",
      name: "login",
      component: AppLogin,
    },
    {
      path: "/logout",
      component: AppLogout
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
    },
    {
      path: "/assessmentSystem",
      component: AssessmentSystem,
    },
    {
      path: "/assessmentpatients/:type?",
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
      path: "/assessmentresults/:ID?",
      name: "assessmentresults",
      component: AssessmentResults
    },    
    {
      path: "/adminhome",
      component: AdminHome,
    },  
    {
      path: "/usermanager",
      component: UserManager,
    },       
    {
      path: "/printablepdf",
      component: PrintablePdf,
    },
    // otherwise redirect to welcome (see https://router.vuejs.org/guide/migration/)
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ]
})

// Hook to ensure user logged in for all non-public pages
router.beforeEach(async (to, from, next) => {

  console.group('router.beforeEach()')
  console.debug('Navigating to', to, 'from', from)

  const publicPages = ['/', '/test', '/login', '/register', '/requestpassword', '/resetpassword']
  const authRequired = !publicPages.includes(to.path)
  console.debug('Authentication required', authRequired)

  const loggedInRes = await authenticationStore().isLoggedIn()
  if (!loggedInRes.data !== true) {
    // Clear all local storage, e.g. wipe sessions with expired JWTs
    authenticationStore().clear()
  }
  console.debug('Logged in user', loggedInRes.data)

  if (authRequired && loggedInRes.data !== true) {

    console.debug('Routing to login page...')
    console.groupEnd()

    return next('/login')

  } else {

    console.debug('Routing to', to)
    console.groupEnd()

    next()
  }
})
