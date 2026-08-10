import { authenticationStore } from '../stores/authentication'
import axios from 'axios'

const API = process.env.BASE_URL

function isSuccessResult(result) {
  let ok = true
  if (result) {
    try {
      // Assume a result payload { status: xxx, message: '<text>' }
      ok = result.status < 400 
    } catch(e) {
      // Wasn't an object, so success if we get a true result
      ok = result === true
    }
  }
  return ok ? 'success' : 'failure'
}

async function auditLog(actionType, entityType, entityId, result) {
  const auth = authenticationStore()
  const config = auth.token ? { headers: { Authorization: `Bearer ${auth.token}` } } : {}
  await axios.post(`${API}audits`, { data: {
    action_type: actionType,
    entity_type: entityType,
    entity_id: entityId,
    user_id: auth.email,
    organisation: auth.orgCode,
    action_status: isSuccessResult(result),
    action_source: navigator.userAgent,
    eprase_creator_id: auth.userId,
    eprase_updater_id: auth.userId,
    session_id: auth.session
  }}, config)
}

export async function authenticationListener({
  name,     // name of the action
  store,    // store instance
  args,     // array of parameters passed to the action
  after,    // hook after the action returns or resolves
  onError,  // hook if the action throws or rejects
  }) {

  console.group('authenticationListener()')  
    
  const authTriggers = ['signup', 'login', 'logout', 'changePassword', 'terminateSession']

  if (authTriggers.includes(name)) {

    console.debug('Start', name, 'in store', store, 'params', args)

    const startTime = Date.now()

    const actionType = name
    const entityType = 'user'
    let entityId = null
    switch(name) {
      case 'signup': entityId = args[3]; break
      case 'login': entityId = args[0]; break
      case 'logout': entityId = store.email; break
      case 'changePassword': entityId = store.email; break
      case 'terminateSession': entityId = args[0]
      default: break
    }
    console.debug('Action type', actionType, 'entity type', entityType, 'entity id', entityId)
    if (actionType == 'logout') {
      // So we record the session information before it is destroyed
      await auditLog(actionType, entityType, entityId, null)
    }
    
    // Triggers if the action succeeds and after it has fully run waiting for any returned promise
    after(async (result) => {       
      console.group('authenticationListener():after()')     
      console.debug('After', name, `after ${Date.now() - startTime}ms`, 'logging...')
      console.debug('Result:', result) 
      if (actionType != 'logout') {
        await auditLog(actionType, entityType, entityId, result)  
      }
      console.groupEnd()
    })

    // Triggers if the action throws or returns a promise that rejects
    onError(async (error) => {
      console.warn('Failed', name, `after ${Date.now() - startTime}ms`)
      console.warn('Error:', error)
    })
  }
  console.groupEnd()  
}

export async function practiceSessionListener({
  name,     // name of the action
  store,    // store instance
  args,     // array of parameters passed to the action
  after,    // hook after the action returns or resolves
  onError,  // hook if the action throws or rejects
  }) {

  console.group('practiceSessionListener()')  
  
  const practiceTriggers = ['startPractice', 'endPractice']

  if (practiceTriggers.includes(name)) {

    console.debug('Start', name, 'in store', store, 'params', args)
    const startTime = Date.now()

    // Triggers if the action succeeds and after it has fully run waiting for any returned promise
    after(async (result) => {       
      console.group('practiceSessionListener():after()')     
      console.debug('After', name, `after ${Date.now() - startTime}ms`, 'logging...')
      console.debug('Result:', result)
      await auditLog(name, 'practice', '', result)      
      console.groupEnd()
    })

    // Triggers if the action throws or returns a promise that rejects
    onError(async (error) => {
      console.warn('Failed', name, `after ${Date.now() - startTime}ms`)
      console.warn('Error:', error)
    })
  }
  console.groupEnd()
}

export async function assessmentListener({
  name,     // name of the action
  store,    // store instance
  args,     // array of parameters passed to the action
  after,    // hook after the action returns or resolves
  onError,  // hook if the action throws or rejects
  }) {

  console.group('assessmentListener()')  
  
  const assessmentTriggers = ['competency']

  if (assessmentTriggers.includes(name)) {

    console.debug('Start', name, 'in store', store, 'params', args)
    const startTime = Date.now()

    const actionType = name
    let entityType = 'assessment'
    let entityId = null
    switch(name) {
      case 'competency': entityType = 'checklist'; entityId = ''; break      
      default: break
    }

    // Triggers if the action succeeds and after it has fully run waiting for any returned promise
    after(async (result) => {       
      console.group('assessmentListener():after()')     
      console.debug('After', name, `after ${Date.now() - startTime}ms`, 'logging...')
      console.debug('Result:', result)
      await auditLog(actionType, entityType, entityId, result)      
      console.groupEnd()
    })

    // Triggers if the action throws or returns a promise that rejects
    onError(async (error) => {
      console.warn('Failed', name, `after ${Date.now() - startTime}ms`)
      console.warn('Error:', error)
    })
  }
  console.groupEnd()
}
