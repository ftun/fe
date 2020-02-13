const axios = require('axios');

const BASE_URL = 'http://dev.apirest/';

/**
* Función para realizar una peticion http utilizando axios
* @param Object paramsRequest. Contienen los parametros para configuracion de un peticion
* {
*       url             : (string) Url hacia la petición
*       method          : (String) Tipo de peticion GET/POST/PUT/DELETE/REQUEST
*       data            : (String) Informacón que se envia con la petición
*       response        : (any) Variable que almacena el response de la petición
*       responseType    : (String) Permite cambiar el tipo de respuesta ('arraybuffer', 'blob', 'document', 'json', 'text', ''), default '' (cadena vacia)
*                                  Al activar esta propiedad la funcion retorna el objeto del response para mejor tratamiento
*		auth			: (string) Tipo de autenticacion de logeo (Bearer, Basic. etc.)
* }
* @return Mixed | Error {4XX: Errores del lado del cliente, 5XX: Errores del lado del servidor}
*/
const MakeRequest = async (request) => {
    try {
        const response = await axios({
            url: BASE_URL + request.url,
            method: request.method || 'get',
            data: request.data || null,
            responseType: request.responseType || 'json'
        });

        return response.data;
    }
    catch(error) {
        if (!error.response) {
            if(!error.hasOwnProperty('request') || !error.request.hasOwnProperty('_currentRequest')) {
                return {
                    code: 500,
                    error: true,
                    message: error.message,
                    data: {}
                }
            }else {
                if(error.request._currentRequest.res.statusCode === 204) {
                    return {
                        code: 204,
                        error: false,
                        message: error.request._currentRequest.res.statusMessage,
                        data: {}
                    }
                }
            }
        };

        if (!error.response.data || error.response.data === '') {
            return {
                code: error.response.status,
                error: true,
                message: (error.response.status !== 404) ? error.response.statusText : `URL: ${error.response.statusText}`,
                data: {}
            }
        };

        return {
            data: {},
            error: true,
            code: error.response.status,
            message: error.response.data.hasOwnProperty('message') ? error.response.data.message : (error.response.data.hasOwnProperty('messages') ? error.response.data.messages : error.response.statusText)
        };
    }
};


module.exports = MakeRequest;
