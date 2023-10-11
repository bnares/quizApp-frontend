import axios from 'axios'

export const BaseUrl = "https://localhost:7294/";

export const ENDPOINTS = {
    participants:"/Participants",
    questions: "/Questions",
}

export const createAPIEndpoint = endpoint =>{
    let url= BaseUrl+'api'+endpoint+'/';
    return {
        fetch: ()=>axios.get(url),
        fetchById: (id)=>axios.get(url+id),
        post:(data)=>axios.post(url,data),
        put:(id,data)=>axios.put(url+id,data),
        delete:(id)=>axios.delete(url+id),
        postResult:(ending,data)=>axios.post(url+ending,data),
    }
}

