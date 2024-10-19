
import FormData from "@stguten/form-data";
import pixeldrain from "../config/axios.config.js";
import { HttpStatusCodes } from "../enums/http.enum.js";

export default class User {
  constructor(token) {
    this.token = token;
  }


  async getUserFiles() {
    try {
      const { data } = await pixeldrain.get("/user/files", {
        headers: {
          "Authorization": `Basic ${Buffer.from(this.token).toString('base64')}`
        }
      });
      return data;
    } catch (error) {
      throw new Error(HttpStatusCodes[error.response.data.value]);
    }
  }


  async getUserLists() {
    try {
      const { data } = await pixeldrain.get("/user/lists", {
        headers: {
          "Authorization": `Basic ${Buffer.from(this.token).toString('base64')}`
        }
      });
      return data;
    } catch (error) {
      throw new Error(HttpStatusCodes[error.response.data.value]);
    }
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
      throw new Error(HttpStatusCodes[error.response.data.value]);
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
      throw new Error(HttpStatusCodes[error.response.data.value]);
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
      throw new Error(HttpStatusCodes[error.response.data.value]);
    }

  }
}