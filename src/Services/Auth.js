import { BehaviorSubject } from 'rxjs';
import Axios from './Axios';

const _currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const roles = {
  superadmin: 0,
  admin: 1,
  manufacturer: 2
};

/**
 * Required for when a user loads app with a valid session.
 */
if (_currentUserSubject.value) {
  Axios.defaults.headers.common = { 'Authorization': `Bearer ${_currentUserSubject.value.token}` };
}

class Auth {
  static get currentUser() {
    return _currentUserSubject.asObservable();
  }

  static get currentUserValue() {
    return _currentUserSubject.value;
  }

  static get currentUserRole() {
    return this.currentUserValue.user.role;
  }
  
  static get currentUserGLID() {
    return this.currentUserValue.user.glid;
  }

  static login(username, password) {
    return Axios
      .post('/users/authenticate', { username: username, password: password })
      .then(res => {
        if (res == null) {
          return false;
        }

        const user = res.data;
        Axios.defaults.headers.common = { 'Authorization': `Bearer ${user.token}` };
        localStorage.setItem('currentUser', JSON.stringify(user));
        _currentUserSubject.next(user);
        return user;
      })
  }

  static logout() {
    localStorage.removeItem('currentUser');
    Axios.defaults.headers.common = {};
    _currentUserSubject.next(null);
  }

  // We had a promise made...
  static heartbeat() {
    return Axios.get('/');
  }

  // Being overly paranoid about this, explicitely allow only name/email update
  static handleProfileUpdate(newUserData) {
    let data = this.currentUserValue;

    if (newUserData.name) {
      data.user.name = newUserData.name;
    }

    if (newUserData.email) {
      data.user.email = newUserData.email;
    }

    _currentUserSubject.next(data);
  }
}

export default Auth;