import * as fs from 'fs';

import * as path from 'path';

const DEFAULT_FOLDER = process.env.UPLOAD_FOLDER || 'files';

const MIME_TYPES: Record<string, string> = {
  //ảnh
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',

  //file
  '.txt': 'text/plain',
  '.json': 'application/json',
};

export interface MultipartFile {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

export function loadFromFolder(fileName: string, folder?: string): MultipartFile {
  //loadFromFolder('1.jpeg')
  //loadFromFolder('1.jpeg', 'image')

  const targetFolder = folder || DEFAULT_FOLDER;

  /// path.isAbsolute() => kiểm tra xem path có phải là absolute hay ko
  //absolute là gì:
  //   bắt dầu ở windows là ổ đĩa C:\.  D:\
  //   mac/linux: / (root)
  // E:\Khoa hoc\PW_TS\files\2.jpg
  ///relative path là gì
  //đường dẫn tương đối từ thư mục hiện tại
  // files\2.jpg process.cwd() => current working directory

  // ví dụ: E:\\Khoahoc\\PW_TS + relative path  => dươngdf dẫn đầy đủ của 1 file

  //   path.join() và path.resolve()

  // path.join('a', 'b') -> a/b

  // path.resolve('a', 'b') -> /fulpath/to/a/b (trả về absolute path)
  // files\2.jpg
  //   => chuyển thành absolute path . xử lý  "\" và "/"
  const filePath = path.isAbsolute(targetFolder)
    ? path.join(targetFolder, fileName)
    : path.resolve(process.cwd(), targetFolder, fileName);

  //vis duj

  // loadFromFolder('photo.jpeg', 'C:\\Picture')
  // = target Folder = C:\\Picture => aboslute
  // dungf join ==> C:\\Picture\\photo.jpeg

  // loadFromFolder('1.jpeg', 'files')
  // E:\\Khoahoc\\PW_TS + 1.jpeg => E:\Khoa hoc\PW_TS\files\1.jpg

  if (!fs.existsSync(filePath)) {
    throw new Error(`File ko ton tai ${filePath}`);
  }

  // lấy extension cho mimetype

  ///ảnh rất đẹp.jpeg -> anh_rat_dep.jpeg
  /// file (1).png -> file_1_.png
  const safeName = fileName.replace(/[^a-zA-z0-9._-]/g, '_');

  const ext = path.extname(fileName).toLowerCase();

  return {
    name: safeName,
    mimeType: MIME_TYPES[ext],
    buffer: fs.readFileSync(filePath),
  };
}