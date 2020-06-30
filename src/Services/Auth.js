import { BehaviorSubject } from 'rxjs';
import Axios from './Axios';

const _currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

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
}

export default Auth;