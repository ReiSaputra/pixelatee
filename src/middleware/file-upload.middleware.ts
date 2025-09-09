import multer from "multer";
import fs from "fs";

export class FileUploadMiddleware {
  public static storage(dest: string) {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        const folder = `public/${dest}`;
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
      },
    });
  }

  /**
   * Handle single image upload, filter by image/jpeg and image/png
   * @param dest destination folder
   * @param size maximum file size in megabytes
   * @returns middleware to handle single image upload
   */
  public static handleSingle(dest: string, size: number, nameFile: string) {
    // check if destination folder exist
    if (!fs.existsSync(`public/${dest}`)) {
      fs.mkdirSync(`public/${dest}`);
    }

    // create uploader
    const upload = multer({
      storage: FileUploadMiddleware.storage(dest),
      dest: `public/${dest}`,
      limits: { fileSize: size * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    });

    // return uploader in single
    return upload.single(nameFile);
  }

  /**
   * Handle multiple image upload, filter by image/jpeg and image/png
   * @param dest destination folder
   * @param size maximum file size in megabytes
   * @returns middleware to handle multiple image upload
   * @remarks
   * The maximum number of files that will be accepted is 5
   */
  public static handleMultiple(dest: string, size: number, nameFile: string) {
    // check if destination folder exist
    if (!fs.existsSync(`public/${dest}`)) {
      fs.mkdirSync(`public/${dest}`);
    }

    // create uploader
    const upload = multer({
      storage: FileUploadMiddleware.storage(dest),
      dest: `public/${dest}`,
      limits: { fileSize: size * 1024 * 1024 },
      fileFilter: (req, file, cb): void => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    });

    // return uploader in array
    return upload.array(nameFile, 5);
  }
}
