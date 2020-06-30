import History from './History';
import Auth from './Auth';
import Axios from './Axios';


class CRUD {
    static handleResponse(res) {
        return res.data;
    }

    static handleError(err) {
        if (err.response) {
            if (err.response.status === 401) {
                Auth.logout();
                History.push('/');
            } else {
                console.log(err.response);
            }
        } else if (err.request) {
            console.log(err.request);
        } else {
            console.log(err);
        }
    }

    static create(user) {
        return Axios
            .post(`/${this.endpoint}`, user)
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    static get(id) {
        return Axios
            .get(`/${this.endpoint}/${id}`)
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    static getAll() {
        return Axios
            .get(`/${this.endpoint}`)
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    static update(id, user) {
        return Axios
            .post(`/${this.endpoint}/${id}`, user)
            .then(this.handleResponse)
            .catch(this.handleError);
    }
}

const checkAuth = () => {
    console.log('Checking auth');
    return Axios
        .get('/')
        .then(() => true)
        .catch(CRUD.handeError);
};

class Users extends CRUD {
    static endpoint = 'users';
}

export default {
    checkAuth,
    Users
};