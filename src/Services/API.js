import Auth from "./Auth";
import Axios from "./Axios";

class GLAPI_Interface {
  static handleResponse(res) {
    return res.data;
  }

  static handleError(err) {
    if (err.response) {
      if (err.response.status === 401) {
        Auth.logout();
      } else {
        //console.log('[GLAPI]' + err.message + ': ' + err.request.responseURL);
      }
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log(err);
    }

    return err;
  }
}

class CRUD extends GLAPI_Interface {
  static create(data) {
    return Axios.post(`/${this.endpoint}`, data)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  static get(id) {
    return Axios.get(`/${this.endpoint}/${id}`)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  static getAll() {
    return Axios.get(`/${this.endpoint}`)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  static update(id, data) {
    return Axios.post(`/${this.endpoint}/${id}`, data)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  static delete(id) {
    return Axios.delete(`/${this.endpoint}/${id}`)
      .then(this.handleResponse)
      .catch(this.handleError);
  }
}

const checkAuth = () => {
  return Axios.get("/")
    .then(() => true)
    .catch(CRUD.handeError);
};

class Users extends CRUD {
  static endpoint = "users";

  static getManufacturers() {
    return Axios.get(`/${this.endpoint}/manufacturers`)
      .then(this.handleResponse)
      .catch(this.handleError);
  }
}

class Orders extends CRUD {
  static endpoint = "orders";

  static getOrdersByCustomer(customerId) {
    return Axios.get(`/${this.endpoint}/customer/${customerId}`)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  static getOrdersByManufacturer(manufacturerId) {
    return Axios.get(`/${this.endpoint}/manufacturer/${manufacturerId}`)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  static setStatus(orderId, status) {
    return Axios.post(`/${this.endpoint}/${orderId}/status/${status}`)
      .then(this.handleResponse)
      .catch(this.handleError);
  }
}

class Customers extends CRUD {
  static endpoint = "customers";
}

class Coupons extends CRUD {
  static endpoint = "coupons";
}

class Manufacturers extends CRUD {
  static endpoint = "manufacturers";
}

class Settings extends GLAPI_Interface {
  static get(name) {
    return Axios.get(`/settings/${name}`)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  static set(name, value) {
    return Axios.post(`/settings/${name}`, value)
      .then(this.handleResponse)
      .catch(this.handleError);
  }
}

export default {
  checkAuth,
  Users,
  Orders,
  Customers,
  Coupons,
  Manufacturers,
  Settings,
};
