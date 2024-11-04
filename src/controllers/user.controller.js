
import FormData from "@stguten/form-data";
import pixeldrain from "../config/axios.config.js";
import { HttpStatusCodes } from "../enums/http.enum.js";

export default class User {
  constructor(token) {
    this.token = token;
  }
  
  async getNewToken(username, password, appName = null) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('app_name', appName || "@stguten/pd-js");

    try {
      const { data } = await pixeldrain.post("/user/login", formData);
      return data['auth_key'];
    } catch (error) {
      if (error.response) {
        throw new Error(HttpStatusCodes[error.response.data.value]);
      }
      throw new Error(error.message);
    }
  }

  async myApiKeys() {
    try {
      const { data } = await pixeldrain.get("/user/session", {
        headers: {
          "Authorization": `Basic ${Buffer.from(this.token).toString('base64')}`
        }
      });
      return data.map()
    } catch (error) {
      if (error.response) {
        throw new Error(HttpStatusCodes[error.response.data.value]);
      }
      throw new Error(error.message);
    }
  }

  async deleteApiKey(apiKey) {
    try {
      const { data } = await pixeldrain.delete(`/user/session`, {
        headers: {
          "Authorization": `Basic ${Buffer.from(apiKey).toString('base64')}`
        }
      });
      return data;
    } catch (error) {
      if (error.response) {
        throw new Error(HttpStatusCodes[error.response.data.value]);
      }
      throw new Error(error.message);
    }

  }
  
}