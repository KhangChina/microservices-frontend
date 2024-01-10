import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import axios from 'axios'
import userStatus from './status.json'
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor() { }

  /**
   * Get all user
   */
  async getAll(per_page: number, page: number, search: any) {

    let url = `${environment.apiUrl}/user?per_page=${per_page}&page=${page}`;
    if (search !== undefined) {
      url += `&search=${search}`;
    }
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    };
    try {
      const response = await axios(config)
      if (response.data.statusCode === 200) {
        return {
          check: 'OK',
          data: response.data.data
        }
      }
    } catch (error) {
      return {
        check: 'ERROR',
        data: error.response.data.message
      }
    }

  }

  /**
   * Get user by id
   */
  async getById(id: string) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${environment.apiUrl}/user/${id}`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    };
    try {
      const response = await axios(config)
      if (response.data.statusCode === 200) {
        return {
          check: 'OK',
          data: response.data.data
        }
      }
    } catch (error) {
      return {
        check: 'ERROR',
        data: error.response.data.message
      }
    }
  }
  //status: active, deactivate, deleted
  async create(data) {
    // let data = JSON.stringify({
    //   "name": name,
    //   "note": note
    // });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${environment.apiUrl}/user/product/${environment.productID}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      data
    };

    try {
      const response = await axios(config)
      if (response.data.statusCode === 201) {
        return {
          check: 'OK',
          data: response.data.data
        }
      }
    } catch (error) {
      return {
        check: 'ERROR',
        data: error.response.data.message
      }
    }
  }
  async update(ID: string, data: any) {
    // let data = JSON.stringify({
    //   "name": product.name,
    //   "note": product.note,
    //   "status": product.status
    // });

    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `${environment.apiUrl}/user/${ID}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
     data
    };
    try {
      const response = await axios(config)
      if (response.data.statusCode === 200) {
        return {
          check: 'OK',
          data: response.data.data
        }
      }
    } catch (error) {
      return {
        check: 'ERROR',
        data: error.response.data.message
      }
    }
  }

  async delete(ID: string) {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${environment.apiUrl}/user/${ID}`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    };
    try {
      const response = await axios(config)
      if (response.data.statusCode === 200) {
        return {
          check: 'OK',
          data: response.data.data
        }
      }
    } catch (error) {
      return {
        check: 'ERROR',
        data: error.response.data.message
      }
    }
  }
  async getUserStatus()
  {
    return userStatus
  }
}
