export function authenticationListener({
  name,     // name of the action
  store,    // store instance
  args,     // array of parameters passed to the action
  after,    // hook after the action returns or resolves
  onError,  // hook if the action throws or rejects
  }) {
    
  const authTriggers = {
    'login': 'user', 
    'logout': 'user', 
    'changePassword': 'password'
  }
  if (Object.keys(authTriggers).includes(name)) {
    const startTime = Date.now()
    // Triggers before an action on the store
    console.log('Start', name, 'in store', store, 'params', args)

    // Triggers if the action succeeds and after it has fully run waiting for any returned promise
    after((result) => {
      console.log('Finished', name, `after ${Date.now() - startTime}ms`)
      console.log('Result:', result)
    })

    // Triggers if the action throws or returns a promise that rejects
    onError((error) => {
      console.warn('Failed', name, `after ${Date.now() - startTime}ms`)
      console.warn('Error:', error)
    })
  }
  
}
