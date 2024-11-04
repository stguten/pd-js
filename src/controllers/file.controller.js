import * as fs from "fs";
import EventEmitter from "events";
import path from "path";
import FormData from "@stguten/form-data";
import pixeldrain from "../config/axios.config.js";
import { HttpStatusCodes } from "../enums/http.enum.js";
import * as downloadUtils from "../utils/download.utils.js";

export default class File {
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
            if (error.response) {
                throw new Error(HttpStatusCodes[error.response.data.value]);
            }
            throw new Error(error.message);
        }
    }

    async postFile(file, nameFile) {
        const formData = new FormData();
        formData.append('name', nameFile);
        formData.append('file', fs.createReadStream(file));

        try {
            const { data } = await pixeldrain.post(`/file`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
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

    async putFile(file, nameFile) {
        const fileContent = fs.createReadStream(file);

        try {
            const { data } = await axios.put(`/file/${nameFile}`, fileContent, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(this.token).toString('base64')}`
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

    async getFileById(id, folder, download = false) {
        const checkFile = await this.getFileInfo(id);
        if (!id) throw new Error("Please insert a file Id.");
        if (!fs.existsSync(folder)) throw new Error("Folder not found.");
        if (checkFile.success === false) throw new Error("File not found.");

        try {
            const resultado = await pixeldrain.get(`/file/${id}${(download ? "?download" : "")}`, {
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

    async getFileInfo(id) {
        if (!id) throw new Error("Please insert a file Id.");
        try {
            const { data } = await pixeldrain.get(`/file/${id}/info`);
            return data;
        } catch (error) {
            if (error.response) {
                throw new Error(HttpStatusCodes[error.response.data.value]);
            }
            throw new Error(error.message);
        }
    }

    async getfileThumb(id, width, height) {
        const checkFile = await this.getFileInfo(id);
        if (!id) throw new Error("Please insert a file Id.");
        if (checkFile.success === false) throw new Error("File not found.");
        if (width != height || (width || height < 16) || (width || height > 128)) throw new Error("The value must be between 16 and 128.");
        if (width % 16 != 0 || height != 0) throw new Error("The width and height parameters need to be a multiple of 16");

        try {
            const { data } = await pixeldrain.get(`/file/${id}/thumbnail?width=${width}&height=${height}`);
            return data;
        } catch (error) {
            if (error.response) {
                throw new Error(HttpStatusCodes[error.response.data.value]);
            }
            throw new Error(error.message);
        }
    }

    async deleteFile(id) {
        const checkFile = await this.getFileInfo(id);
        if (!id) throw new Error("Please insert a file Id.");
        if (checkFile.success === false) throw new Error("File not found.");
        try {
            const { data } = await pixeldrain.delete(`/file/${id}`, {
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
    
}