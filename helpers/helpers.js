const ErrorResponse = require("../utils/errorResponse");
const fs = require('fs');

exports.uploadImage = async (image, next) => {
  return new Promise((resolve, reject) => {
    if (!image.mimetype.startsWith('image') && !image.mimetype.startsWith('application')) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    const randomFileName = `${Math.floor(Math.random() * 100000 + 1)}_${image.name.replace(/\s/g, '')}`;
    const path = `${process.env.FILE_UPLOAD_PATH}/uncompressed_${randomFileName}`;

    fs.writeFile(path, image.data, (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse('Error saving the image', 500));
      }

      resolve({
        photoPath: path.slice(8),
      });
    });
  });
};

exports.uploadFile = async (file, next) => {
  return new Promise((resolve, reject) => {
    if (
      !file.mimetype.startsWith("application") &&
      !file.mimetype.startsWith("pdf") &&
      !file.mimetype.startsWith("text")
    ) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const path = `${process.env.FILES_UPLOAD_PATH}/${Math.floor(
      Math.random() * 100000 + 1
    )}.${file.name.replace(/\s/g, "")}`;

    file.mv(path, (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 400));
      }

      resolve({
        photoPath: path.slice(8),
      });
    });
  });
};
