import {dataService} from "./data.service";
import {settings} from "../settings";
import {router} from "../router";

let baseURL = process.env.BASE_URL;

export const userService = {
  login,
  logout,
  newPasswordRequest,
  resetPassword,
  checkIsAdminUser
};

// returns 'user not found' if an error
function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  return fetch(baseURL + 'auth/signin', requestOptions)
    .then(handleResponse)
    .then(response => {
      // login successful if there's a jwt token in the response
      if (response.jwt.accessToken) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', response.jwt.accessToken);
        localStorage.setItem('user', username);
        localStorage.setItem('userId', response.user_id);
        localStorage.setItem('institutionId', response.institution_id);
      }
      return response;
    });
}

function newPasswordRequest(email){
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: email
  };

  return fetch(baseURL + 'auth/newPassword', requestOptions)
    .then(handleResponse)
    .then(response => {
      if (response) {
        // success
      }
      return response;
    });
}

function resetPassword(password, token){
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: password
  };

  return fetch(baseURL + 'auth/resetPassword?token=' + token, requestOptions)
    .then(handleResponse)
    .then(response => {
      // request successful if returns 'Password updated'
      // may return unauthorized if token has expired
      if (response) {
        // success
      }
      return response;
    });
}

function logout() {
  // remove all items from local storage
  localStorage.clear();
}

// returns boolean
function checkIsAdminUser(user_id){

  let token = localStorage.getItem('token');

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
  };

  return fetch(baseURL + 'auth/userIsAdmin?USER_ID=' + user_id, requestOptions)
    .then(handleTextResponse)
    .then(response => {
      if (response) {
        // success
      }
      return response;
    });

}


function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        router.push({ path: './failedlogin' }).catch(err => {});
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}


function handleTextResponse(response) {
  return response.text().then(text => {
    const data = text;
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}

