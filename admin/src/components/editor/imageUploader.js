export function image_upload_handler(blobInfo, success, failure, progress) {
  var xhr, formData;

  xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  /* add api url here with base uri */
  // xhr.open('POST', 'your-image-api-path-here');
  xhr.open('POST', 'http://localhost:3002/api/upload');

  xhr.setRequestHeader('Content-Type', 'application/json');

  //   xhr.upload.onprogress = function (e) {
  //     progress((e.loaded / e.total) * 100);
  //   };

  xhr.onload = function () {
    var json;

    if (xhr.status === 403) {
      failure('HTTP Error: ' + xhr.status, { remove: true });
      return;
    }

    if (xhr.status < 200 || xhr.status >= 300) {
      failure('HTTP Error: ' + xhr.status);
      return;
    }

    json = JSON.parse(xhr.responseText);

    if (!json || typeof json.location != 'string') {
      failure('Invalid JSON: ' + xhr.responseText);
      return;
    }

    success(json.location);
  };

  xhr.onerror = function () {
    failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
  };

  formData = new FormData();
  formData.append('token', localStorage.getItem('token'));
  formData.append('file', blobInfo.blob(), blobInfo.filename());
  xhr.send(formData);
}
