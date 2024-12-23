import List from "./src/controllers/list.controller.js";
import File from "./src/controllers/file.controller.js";
import User from "./src/controllers/user.controller.js";
import Misc from "./src/controllers/misc.controller.js";

class PixelDrainApi {
    #list;
    #file;
    #user;
    #misc;
    static instance;

    /**
     * Make a new instance of the PixelDrain API.
     * @param {String} token Pixeldrain API token.
     */
    constructor(token) {
        if (PixelDrainApi.instance) {
            return PixelDrainApi.instance;
        }
        this.#file = new File(token);
        this.#list = new List(token);
        this.#user = new User(token);
        this.#misc = new Misc(token);

        PixelDrainApi.instance = this;
    }

    /**
     * Return all files from authenticated user
     * @returns {Object} Returns a JSON object with all user files.
     */
    async getUserFiles() {
        return await this.#file.getUserFiles();
    }

    /**
     * Upload a file. I recommend that you use the PUT API instead of the POST API. 
     * It’s easier to use and the multipart encoding of the POST API can cause performance issues in certain environments.
     * @param {String} file Path of the file to upload
     * @param {Object} options Name of the file to upload and the boolean flag to set if the file is set or not to user
     * @returns {String} The ID of the newly uploaded file
     */
    async postFile(file, nameFile) {
        return await this.#file.postFile(file, nameFile);
    }

    /**
     * Upload a file.
     * @param {String} file Path of the file to upload
     * @param {Object} options Name of the file to upload and the boolean flag to set if the file is set or not to user
     * @returns {String} The ID of the newly uploaded file
     */
    async putFile(file, nameFile) {
        return await this.#file.putFile(file, nameFile);
    }

    /**
     * Returns the full file associated with the ID. Supports byte range requests.
     * Warning: If a file is using too much bandwidth it can be rate limited. 
     * The rate limit will be enabled if a file has three times more downloads than views.
     * The owner of a file can always download it. When a file is rate limited the user will
     * need to fill out a captcha in order to continue downloading the file. 
     * The captcha will only appear on the file viewer page (pixeldrain.com/u/{id}). 
     * Rate limiting has been added to prevent the spread of viruses and to stop hotlinking. 
     * Hotlinking is only allowed when files are uploaded using a Pro account.
     * 
     * Pixeldrain also includes a virus scanner. 
     * If a virus has been detected in a file the user will also have to fill in a captcha to download it.
     * @param {String} id ID of the file to request
     * @param {String} folder The folder path to save the file
     * @param {boolean} download Option to sends attachment header instead of inline
     * @returns {String} Filepath of downloaded file
     */
    async getFileById(id, folder, download) {
        return await this.#file.getFileById(id, folder, download);
    }

    /**
     * Returns information about one or more files. 
     * You can also put a comma separated list of file IDs in the URL and it will return an array of file info, instead of a single object. 
     * There’s a limit of 1000 files per request.
     * @param {String} id ID of the file or an array with various IDs.
     * @returns {Object} Return a Object with one or more file infos.
     */
    async getFileInfo(id) {
        return await this.#file.getFileInfo(id);
    }

    /**
     * Returns a PNG thumbnail image representing the file. 
     * The thumbnail image will be 128x128 px by default. 
     * You can specify the width and height with parameters in the URL. 
     * The width and height parameters need to be a multiple of 16. 
     * So the allowed values are 16, 32, 48, 64, 80, 96, 112 and 128. 
     * If a thumbnail cannot be generated for the file you will be redirected to a mime type image of 128x128 px.
     * 
     * @param {String} id ID of the file to get a thumbnail for
     * @param {Number} width Width of the thumbnail image
     * @param {Number} height Height of the thumbnail image
     * @returns A PNG image if a thumbnail can be generated. 
     * If a thumbnail cannot be generated you will get a 301 redirect to an image representing the type of the file.
     */
    async getfileThumb(id, width, height) {
        return await this.#file.getfileThumb(id, width, height);
    }

    /**
     * Deletes a file. Only works when the users owns the file.
     * @param {String} id ID of the file to delete
     * @returns {String} A message with a status of file
     */
    async deleteFile(id) {
        return await this.#file.deleteFile(id);
    }

    /**
     * Return all lists from authenticated user
     * @returns {Object} Returns a JSON object with all user lists.
     */
    async getUserLists() {
        return await this.#list.getUserLists();
    }

    /**
     * Returns information about a file list and the files in it.
     * @param {String} id ID of the list
     * @returns {Object} The API will return some basic information about every file. 
     * Every file also has a “detail_href” field which contains a URL to the info API of the file. 
     * Follow that link to get more information about the file like size, checksum, mime type, etc. 
     * The address is relative to the API URL and should be appended to the end.
     */
    async getList(id) {
        return await this.#list.getList(id);
    }

    /**
     * Creates a list of files that can be viewed together on the file viewer page.
     * @param {String} title Name of the file to upload
     * @param {Object} files File is not linked to user if true
     * @param {boolean} anonymous Option to set the list as anonymous
     * @returns {String} Return a id of list created
     */
    async createList(title, files, anonymous) {
        return await this.#list.createList(title, files, anonymous);
    }   

    /**
     * Download all files from a list.
     * @param {String} id ID of the list     * 
     */
    async downloadAllFiles(id) {
        return await this.#list.downloadAllFiles(id);
    }

    /**
     * Update a file list with new title, files or anonymous flag.
     * @param {String} id ID of the list.
     * @param {String} title title of the list.
     * @param {Array} files Some Files to add in list, Optional.
     * @param {boolean} anonymous Anonymous flag, Optional.
     * @returns A Object with the list updated.
     */
    async updateList(id, title, files, anonymous) {
        return await this.#list.updateList(id, title, files, anonymous);
    }

    /**
     * Delete a File List.
     * @param {String} id ID of the list.
     * @returns A Object with status of operation.
     */
    async deleteList(id) {  
        return await this.#list.deleteList(id);
    }

    /**
     * If you need to get a new token, you can use this method. Useless if you already have a token.
     * @param {String} username Username used for login
     * @param {String} password Password used for login
     * @param {String} appName Some name to identify the app. Ex: @stguten/pd-js
     * @returns {String} Return a new token
     */
    async getNewToken(username, password, appName) {
        return await this.#user.getNewToken(username, password, appName);
    }

    /**
     * Return all api keys from authenticated user
     * @returns {Object} Returns a JSON object with user API.
     */
    async myApiKeys() {
        return await this.#user.myApiKeys();
    }

    /**
     * Delete a api key from authenticated user
     * @param {String} apiKey Pixeldrain API token
     * @returns {Object} Returns a JSON object with user API.
     */
    async deleteApiKey(apiKey) {
        return await this.#user.deleteApiKey(apiKey);
    }

    /**
     * Generate a QR Code for a link
     * @param {String} url URL to generate QR Code 
     */
    async generateQRCode(url) {
        return await this.#misc.generateQRCode(url);
    }

}
export default PixelDrainApi;