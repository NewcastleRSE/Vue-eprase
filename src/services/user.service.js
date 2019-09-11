
let baseURL = 'http://localhost:6001';

export const userService = {
  login,
  logout
};

function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  };

  return fetch(baseURL + '/auth/signin', requestOptions)
    .then(handleResponse)
    .then(response => {
      // login successful if there's a jwt token in the response
      if (response.jwt.accessToken) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('token', response.jwt.accessToken);
        localStorage.setItem('user', username);
      }
      return response;
    });
}

function logout() {
  // remove all items from local storage
  localStorage.clear();
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
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
