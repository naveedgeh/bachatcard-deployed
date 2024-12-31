import { invokeApi } from 'src/utils';

export const login = async (data) => {
  const requestObj = {
    path: `api/examplePath`,
    method: 'POST',
    headers: {
      // 'x-sh-auth': 1234
    },
    postData: data,
  };
  return invokeApi(requestObj);
};

export const logout = async (data) => {
  const requestObj = {
    path: `api/examplePath`,
    method: 'POST',
    headers: {
      // 'x-sh-auth': 1234
    },
    postData: data,
  };
  return invokeApi(requestObj);
};
