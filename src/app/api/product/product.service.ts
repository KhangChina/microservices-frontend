import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import axios from 'axios'
@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor() { }

  /**
   * Get all product
   */
  async getAll(per_page: number, page: number, search: any) {

    let url = `${environment.apiUrl}/product?per_page=${per_page}&page=${page}`;
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
      url: `${environment.apiUrl}/product/${id}`,
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
  async create(name: string, note: string) {
    let data = JSON.stringify({
      "name": name,
      "note": note
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${environment.apiUrl}/product/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      data: data
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
  async update(ID: string, product: any) {
    let data = JSON.stringify({
      "name": product.name,
      "note": product.note,
      "status": product.status
    });

    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `${environment.apiUrl}/product/${ID}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      data: data
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
      url: `${environment.apiUrl}/product/${ID}`,
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
}
