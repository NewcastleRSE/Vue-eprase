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

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login/:loggedOut?",
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
  history.replaceState(history.state, '', to.fullPath)
  console.debug('Assign onpopstate handler...')
  window.onpopstate = () => history.go(1)

  console.debug('Done')
  console.groupEnd()
})

// Hook to ensure user logged in for all non-public pages
router.beforeEach(async (to, from, next) => {

  console.group('router.beforeEach()')
  console.debug('Navigating to', to, 'from', from)

  const auth = authenticationStore()
  const publicPages = ['/', '/login', '/failedlogin', '/register', '/requestpassword', '/resetpassword', '/instructions', '/assessmentcontent', '/categorytable']
  const adminPages = ['/adminhome']
  const authRequired = !publicPages.includes(to.path)
  const adminRequired = adminPages.includes(to.path)
  console.debug('Authentication required', authRequired)

  const loggedIn = auth.isLoggedIn
  if (!loggedIn) {
    // Clear all local storage, e.g. sessions where JWT has expired
    auth.clear()
  }
  console.debug('Logged in user', loggedIn)

  const isAdmin = await (async () => { return await auth.checkIsAdminUser() })()
  console.debug('Admin required', adminRequired, 'user is admin', isAdmin)

  if (adminRequired && !isAdmin) {

    console.debug('Routing to login page for admin')
    console.groupEnd()

    return next('/login?requiresAdmin=1')

  } else if (authRequired && !loggedIn) {

    console.debug('Routing to login page...')
    console.groupEnd()

    return next('/login')

  } else {

    console.debug('Routing to', to)
    console.groupEnd()

    next()
  }
})
