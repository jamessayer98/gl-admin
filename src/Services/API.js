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
      } else {
        console.error(err.message + ': ' + err.request.responseURL);
      }
    } else if (err.request) {
        console.log(err.request);
    } else {
        console.log(err);
    }

    return err;
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
  return Axios
    .get('/')
    .then(() => true)
    .catch(CRUD.handeError);
};

class Users extends CRUD {
  static endpoint = 'users';
}

class Orders extends CRUD {
  static endpoint = 'orders';

  static getAllWithCustomers() {
    return Axios
      .get(`/${this.endpoint}?withCustomers=1`)
      .then(this.handleResponse)
      .catch(this.handleError);
  }
}

export default {
  checkAuth,
  Users,
  Orders
};