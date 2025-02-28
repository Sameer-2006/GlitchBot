const chatBody=document.querySelector(".chat-body");
const messageInput=document.querySelector(".message-input");
const sendMessageButton=document.querySelector("#send-message");

const API_KEY="AIzaSyAu9k20xFjmDJaViPUYYlzMqINuNOAdH5Q";
const API_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData={
    message:null
}
const initialInputHeight = messageInput.scrollHeight;

const createMessageElement=(content,...classes)=>{
    const div=document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML=content;
    return div;
}


const generateBotResponse=async(incomingMessageDiv)=>{
    const MessageElement=incomingMessageDiv.querySelector(".message-text");
    const requestOptions={
        method:"POST",
       headers:{"Content-Type":"application/json" },
       body:JSON.stringify({
        contents:[{
            parts:[{text: userData.message}]
            }]
       })  
    }
  try{ 
    const response= await fetch(API_URL,requestOptions);
    const data=await response.json();
    if(!response.ok) throw new Error(data.error.message);
    
    const apiResponseText= data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    MessageElement.innerText=apiResponseText; 
}
  catch(error){
    console.log(error);
    MessageElement.innerText=error.message;
    MessageElement.style.color="#ff0000";

}
  finally{
    incomingMessageDiv.classList.remove("thinking");
    
    chatBody.scrollTo({top:chatBody.scrollHeight,behavior:"smooth"}); 
  }
}


const handleuserMessage =(sam)=>{
    sam.preventDefault();
    userData.message=messageInput.value.trim();
    messageInput.value="";
    messageInput.dispatchEvent(new Event("input"));
        const messageContent=`<div class="message-text"></div>`;
        const outgoingMessageDiv = createMessageElement(messageContent,"user-message");
        outgoingMessageDiv.querySelector(".message-text").innerText=userData.message ;
        chatBody.appendChild(outgoingMessageDiv);
        chatBody.scrollTo({top:chatBody.scrollHeight,behavior:"smooth"});
        

    setTimeout(()=>{
        const messageContent=`֎
             <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div> `
        const incomingMessageDiv = createMessageElement(messageContent,"bot-message","thinking");
        chatBody.appendChild(incomingMessageDiv);
        
        chatBody.scrollTo({top:chatBody.scrollHeight,behavior:"smooth"});
        generateBotResponse(incomingMessageDiv);  

    },600);

}
messageInput.addEventListener("keydown",(sam)=>{
    const userMessage=sam.target.value.trim();
    if(sam.key=="Enter" && userMessage ){
        handleuserMessage(sam);
    }
})
messageInput.addEventListener("input",()=>{
    messageInput.style.height=`${initialInputHeight}px`;
    messageInput.style.height=`${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.borderRadius=messageInput.scrollHeight >initialInputHeight ? "15px":"32px"
})

sendMessageButton.addEventListener("click",(sam)=>handleuserMessage(sam))