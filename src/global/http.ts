import axios from 'axios'
export default function(url:string, method:string, options:any = {}) :void
{
    const request = axios.create({
        baseURL: 'http://localhost:3000/',
        // headers: {
        //     Authorization: 'token'
        // }
    })
    request({
        method,
        url,
        ...options
    })
    .then((response:any) => 
    {
        if (options.callback) {
            options.callback(response.data)
        }
    })
    // .catch((retorno) => 
    // {
    // })
    // .finally((retorno) => 
    // {
    // })
}