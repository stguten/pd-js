import pixeldrain from "../config/axios.config.js";
import * as downloadUtils from "../utils/download.utils.js";

export default class Misc {
    constructor(token) {
        this.token = token;
    }

    async generateQRCode(text) {
        try {
            const { data } = await pixeldrain.get(`/misc/qr?text=${text}`, {
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
} 