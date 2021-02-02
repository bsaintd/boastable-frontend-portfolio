const ID_TOKEN_KEY = 'id_token';

export default {
  getToken() {
    return window.localStorage.getItem(ID_TOKEN_KEY);
  },

  getTokenPayload() {
    const token = window.localStorage.getItem(ID_TOKEN_KEY);
    let result = {};
    if (token) {
      result = JSON.parse(atob(token.split('.')[1]));
    }
    return result;
  },

  saveToken(token) {
    window.localStorage.setItem(ID_TOKEN_KEY, token);
  },

  destroyToken() {
    window.localStorage.removeItem(ID_TOKEN_KEY);
  },
};
