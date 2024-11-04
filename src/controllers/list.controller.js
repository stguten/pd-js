import pixeldrain from "../config/axios.config.js";
import { HttpStatusCodes } from "../enums/http.enum.js";
import * as downloadUtils from "../utils/download.utils.js";

export default class List {
  constructor(token) {
    this.token = token;
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
      if (error.response) {
        throw new Error(HttpStatusCodes[error.response.data.value]);
      }
      throw new Error(error.message);
    }
  }

  async getList(id) {
    if (!id) return new Error("Please insert a file Id.");
    try {
      const { data } = await pixeldrain.get(`/list/${id}`);
      return data;
    } catch (error) {
      if (error.response) {
        throw new Error(HttpStatusCodes[error.response.data.value]);
      }
      throw new Error(error.message);
    }
  }

  async createList(title, files, anonymous = false) {
    if (!title) throw new Error("Please insert a title.");
    if (!Array.isArray(files)) throw new Error("The files must be an array.");
    try {
      const { data } = await pixeldrain.post(`/list`, {
        title: title,
        anonymous: anonymous,
        files: files,
      });
      return data;
    } catch (error) {
      if (error.response) {
        throw new Error(HttpStatusCodes[error.response.data.value]);
      }
      throw new Error(error.message);
    }
  }

  async downloadAllFiles(id) {
    if (!id) throw new Error("Please insert a file Id.");
    try {
      const { data } = await pixeldrain.get(`/list/${id}/zip`, {
        responseType: "stream",
        onDownloadProgress: downloadUtils.onProgress
      });     

      const file = resultado.data;
      const fileLocation = path.resolve(folder, downloadUtils.getFilenameFromContentDisposition(resultado.headers['content-disposition']));
      const writer = fs.createWriteStream(fileLocation);

      file.on("end", () => {
          writer.end();
          console.log("Download complete.");
      });

      file.pipe(writer);
    } catch (error) {
      if (error.response) {
        throw new Error(HttpStatusCodes[error.response.data.value]);
      }
      throw new Error(error.message);
    }
  }

  async updateList(id) {
    return new Error("This method is not implemented yet.");/* 
    if (!id) throw new Error("Please insert a file Id.");
    try {
      const { data } = await pixeldrain.put(`/list/${id}/zip`);
      return data;
    } catch (error) {
      if (error.response) {
        throw new Error(HttpStatusCodes[error.response.data.value]);
      }
      throw new Error(error.message);
    } */
  }

  async deleteList(id) {
    if (!id) throw new Error("Please insert a file Id.");
    try {
      const { data } = await pixeldrain.delete(`/list/${id}`, {
        headers: {
          "Authorization": `Basic ${Buffer.from(this.token).toString('base64')}`
        },
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
