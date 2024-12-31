import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { image_upload_handler } from './imageUploader';
import { CircularLoader } from '..';

export default function RichEditor() {
  const [isReady, setIsReady] = useState(false);
  const [initialValue] = useState('');
  const [value, setValue] = useState('');
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  const handleChange = (html, editor) => {
    console.log(html, 'html');
  };
  const handleInit = ({ evt, editor }) => {
    console.log('ready'); // not being called
    editorRef.current = editor;
    setIsReady(true);
  };
  useEffect(() => setValue(initialValue ?? ''), [initialValue]);
  useEffect(() => {
    // uploadImg();
  }, []);
  return (
    <div style={{ position: 'relative' }}>
      <Editor
        apiKey=''
        // onInit={handleInit}
        onInit={(evt, editor) => {
          editorRef.current = editor;
          handleInit(evt, editor);
        }}
        initialValue={initialValue}
        value={value}
        onEditorChange={(newValue, editor) => setValue(newValue)}
        init={{
          height: 500,
          menubar: false,
          image_caption: true,
          resize: false,
          statusbar: false,
          max_height: 420,
          min_height: 420,
          // selector: 'textarea',
          // images_upload_handler: image_upload_handler,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            // 'help',
            // 'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify image bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

          //
          file_picker_callback: (cb, value, meta) => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.addEventListener('change', (e) => {
              const file = e.target.files[0];

              const reader = new FileReader();
              reader.addEventListener('load', () => {
                /*
                        Note: Now we need to register the blob in TinyMCEs image blob
                        registry. In the next release this part hopefully won't be
                        necessary, as we are looking to handle it internally.
                      */
                const id = 'blobid' + new Date().getTime();
                const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                const base64 = reader.result.split(',')[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);

                /* call the callback and populate the Title field with the file name */
                cb(blobInfo.blobUri(), { title: file.name });
              });
              reader.readAsDataURL(file);
            });

            input.click();
          },
        }}
      />
      {!isReady && (
        <>
          <CircularLoader size='1.5rem' />
          {/* <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
            <Typography>Loading Editor</Typography>
          </div> */}
        </>
      )}
    </div>
  );
}
