const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn")




let userText = null;
const API_KEY = "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"

const initialHeight = chatInput.scrollHeight;

//sayfa yuklendiginde yerel depodan(local storage) veri yukler
const loadDataFromLocalStorage = () => {

    
    
    const defaultText = `<div class="default-text">
    <h1>ChatGBT-Clone</h1>
    </div>`;
   
    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;

    //sayfayi sohbetin en altina kaydirir
    chatContainer.scrollTo(0,chatContainer.scrollHeight);

};
loadDataFromLocalStorage();




const createElement = (html,className) =>{
    //yeni div olusturma ve belirtilen chatsinifina ekleme
    //divin html icerigini ayarlama
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat",className);
    chatDiv.innerHTML = html;
    return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");
     
    // api talebi icin ozellikleri ve verileri tanimlama
    const requestOptions = {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${API_KEY}`,

        },
        body: JSON.stringify({ 
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n:1,
            stop: null,

    }),
};

try{
    const response =  await (await fetch(API_URL , requestOptions)).json();
    pElement.textContent = response.choices[0].text.trim();

} catch(error){
   
    }
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);

};



const showTypingAnimation = () =>{
    const html = `   
    <div class="chat-content">
    <div class="chat-details">
        <img src="images/chat-gbt.png" width="50px">
        <div class="typing-animation">
            <div class="typing-dot" style="--delay: 0.2s"></div>
            <div class="typing-dot" style="--delay: 0.4s"></div>
            <div class="typing-dot" style="--delay: 0.6s"></div>
        </div>

    </div>
    <span><i class="fa-regular fa-copy"></i></span>
</div>`;
const incomingChatDiv = createElement(html, "incoming");
chatContainer.appendChild(incomingChatDiv);
chatContainer.scrollTo(0,chatContainer.scrollHeight);

getChatResponse(incomingChatDiv);


};

const handleOutGoingChat = () => {
    userText = chatInput.value.trim(); //chatInput degerini alir ve fazla bos;uklari siler
    if(!userText) return; //chatInput ici bos ise calismasin

    const html = `<div class="chat-content">
    <div class="chat-details">
        <img src="images/IMG_5802.JPG" width="50px">
        <p>
        ${userText}
        </p>
    </div>
</div>`;
const outgoingChatDiv = createElement(html,"outgoing");
outgoingChatDiv.querySelector("p").textContent = userText;
document.querySelector(".default-text")?.remove();
chatContainer.appendChild(outgoingChatDiv);
chatContainer.scrollTo(0,chatContainer.scrollHeight);
setTimeout(showTypingAnimation, 500);
chatInput.value = "";
};


themeButton.addEventListener("click", () =>{
 document.body.classList.toggle("light-mode");
 if(document.body.classList.contains("light-mode")){
    themeButton.classList = "fa-regular fa-moon"
 }else{
    themeButton.classList = "fa-regular fa-sun"
 }
 
});

deleteButton.addEventListener("click",()=>{
    if(confirm("Are you sure you want to delete the entire screen?)")){
        localStorage.removeItem("all-chats");
        loadDataFromLocalStorage();
    }
   
    });

    chatInput.addEventListener("input",() =>{

        chatInput.style.height = `${initialHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });


    chatInput.addEventListener("keydown", (e)=> {
        if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
            e.preventDefault();
            handleOutGoingChat();
        }

    });





sendButton.addEventListener("click", handleOutGoingChat);