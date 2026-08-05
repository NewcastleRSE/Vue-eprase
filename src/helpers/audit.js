import { authenticationStore } from '../stores/authentication'
import axios from 'axios'

const API = process.env.BASE_URL

function isSuccessResult(result) {
  let success = true
  if (result) {
    try {
      // Assume a result payload { status: xxx, message: '<text>' }
      success = result.status < 400 
    } catch(e) {
      // Wasn't an object, so success if we get a true result
      success = result === true
    }
  }
  return success
}

function auditLog(actionType, entityType, entityId, result) {
  const auth = authenticationStore()
  return axios.post(`${API}audits`, { data: {
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
  }})
}

export function authenticationListener({
  name,     // name of the action
  store,    // store instance
  args,     // array of parameters passed to the action
  after,    // hook after the action returns or resolves
  onError,  // hook if the action throws or rejects
  }) {

  console.group('authenticationListener()')
  console.debug('Start', name, 'in store', store, 'params', args)
    
  const authTriggers = ['signup', 'login', 'logout', 'changePassword', 'terminateSession']

  if (authTriggers.includes(name)) {

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
    
    // Triggers if the action succeeds and after it has fully run waiting for any returned promise
    after((result) => {      
      console.debug('Finished', name, `after ${Date.now() - startTime}ms`, 'logging...')
      console.debug('Result:', result)            
      return auditLog(actionType, entityType, entityId, result)
    })

    // Triggers if the action throws or returns a promise that rejects
    onError((error) => {
      console.warn('Failed', name, `after ${Date.now() - startTime}ms`)
      console.warn('Error:', error)
    })
  }

  console.groupEnd()
  
}
