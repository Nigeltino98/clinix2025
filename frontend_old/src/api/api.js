import axios from "axios";
import { toastdanger, } from '../components/utils/notifications'
import { toastloading, } from '../components/utils/notifications'


const baseURl = process.env.REACT_APP_BACKEND_HOST || "http://127.0.0.1:8000";

console.log("Using backend host:", baseURl);


const errorHandler = (error, ...args) => {

    const status = error?.response?.status;

    if (status === 0) {
        toastdanger("The server is probably down check your network.")
    } else if (status === 400) {
        const errors_list = JSON.parse(error.request.response)

        if (errors_list.hasOwnProperty("non_field_errors")) {
            errors_list.non_field_errors.map(err => {
                toastdanger(err)
            })
        } else {
            if (args.length > 0) {
                const specialErrorHandler = args[0]
                specialErrorHandler(errors_list)
            }
        }

    } else if (status === 401) {
        toastdanger(JSON.parse(error.request.response).detail)
        if (args.length > 0) {
            const specialErrorHandler = args[0]
            specialErrorHandler()
        }
    } else if (status === 403) {
        toastdanger(JSON.parse(error.request.response).detail)
    } else if (status === 404) {
        toastdanger("Page not found")
    }
}
export const getToken = (handler, url, body) => {
    console.log("Sending login request to:", `${baseURl}${url}`);
    console.log("With body:", body);
    axios.post(
        `${baseURl}${url}`,
        body,
    ).then((response) => {
        handler(response)
    }).catch((error) => {
        errorHandler(error)
    })
}

export const getApi = (handleSet, token, url, ...args) => {
    axios({
        method: 'get',
        url: `${baseURl}${url}`,
        headers: { Authorization: ` Token ${token}` },
    }).then((response) => {
        handleSet(response)
    }).catch((error) => {
        errorHandler(error, ...args)
    })
}

export const postApi = (handler, token, url, body, ...args) => {
    axios.post(
        `${baseURl}${url}`,
        body,
        {
            headers: { Authorization: ` Token ${token}` },
        }).then((response) => {
            handler(response)
        }).catch((error) => {
            errorHandler(error, ...args)
        })
}

export const putApi = (handler, token, url, body, id, ...args) => {
    axios.patch(
        `${baseURl}${url}${id}/`,
        body,
        {
            headers: { Authorization: ` Token ${token}` },
        })
        .then((response) => {
            handler(response)
        }).catch((error) => {
            errorHandler(error, ...args)
        })
}

export const truePutApi = (handler, token, url, body, ...args) => {
    axios.put(
        `${baseURl}${url}`,
        body,
        {
            headers: { Authorization: ` Token ${token}` },
        })
        .then((response) => {
            handler(response)
        }).catch((error) => {
            errorHandler(error, ...args)
        })
}

export const deleteApi = (handler, token, url, id) => {
    axios.delete(`${baseURl}${url}`, {
        headers: { Authorization: ` Token ${token}` },
    })
        .then((response) => {
            handler(response) 
        }).catch((error) => {
            errorHandler(error)
        })
}

// ... (existing imports and code)

export const patchApi = (handler, token, id, url, body, ...args) => {
  axios.patch(
    `${baseURl}${url}${id}`,
    body,
    {
      headers: { Authorization: ` Token ${token}` },
    }
  )
  .then((response) => {
    handler(response);
  })
  .catch((error) => {
    errorHandler(error, ...args);
  })
}


// ... (existing imports and code)

export const deleteInventoryItem = (handler, token, id) => {
  axios.delete(
    `${baseURl}/api/inventory/${id}/`, 
    {
      headers: { Authorization: ` Token ${token}` },
    }
  )
  .then((response) => {
    handler(response);
  })
  .catch((error) => {
    errorHandler(error);
  });
};
