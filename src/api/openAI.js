import axios from "axios";
const {apiKey}=require('../constants');

const client=axios.create({
    headers:{
        "Content-Type": "application/json", 
        "Authorization":"Bearer "+apiKey
    }
})

const chatGPTendpoint='https://api.openai.com/v1/chat/completions'
const DALLEendpoint='https://api.openai.com/v1/images/generations'

export const apiCall=async(prompt,messages)=>{
    try{
            const res=await client.post(chatGPTendpoint,{
                model: "gpt-3.5-turbo",
                messages:[{
                    role:'user',
                    content:`Does this message want to generate an picture, image, art or something similar? ${prompt}. simply answer with yes or no.`
                }]
            })
            console.log('data',res.data.choices[0].message)
            let isImage=res.data?.choices[0]?.message?.content;
            if(isImage.toLowerCase().includes('yes')){
                console.log('dalle api call');
                return dalleAppicall(prompt,messages||[])
            }else{
                console.log('chat gpt api call')
                return chatgptApiCall(prompt,messages||[])
            }
    }catch(error){
            console.log('error: ',error)
            return Promise.resolve({success:false, msg:error.message})
    }
}

const chatgptApiCall=async(prompt,messages)=>{
    try {
        const res=await client.post(chatGPTendpoint,{
            model:'gpt-3.5-turbo',
            messages
        })
        let answer=res.data?.choices[0]?.message?.content;
        messages.push({role: 'assistant', content: answer.trim()});
        return Promise.resolve({success:true, data:messages})
    } catch (error) {
        console.log('error',error)     
        return Promise.resolve({success:false, msg:error.message})   
    }
}

const dalleAppicall=async(prompt,messages)=>{
    try{
        const res=await client.post(DALLEendpoint,{
            prompt,
            n:1,
            size:"512x512"
        })
        let url=res?.data?.data[0].url;
        console.log("Url of the image:",url);
        messages.push({role:'assistant', content:url});
        return Promise.resolve({success:true, data:messages}) 


    }catch(error){
        console.log('error',error)    
        return Promise.resolve({success:false, msg:error.message})  
    }

}