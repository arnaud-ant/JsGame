var pseudo = document.getElementById('ps').innerHTML;
var char = document.getElementById('char').innerHTML;
var socket = io();
//Listeners

socket.emit('pseudo',{pseudo: pseudo, char: char});
socket.emit('oldWhispers', pseudo);

//document.title = pseudo + ' - ' + document.title;

document.getElementById('chatForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const textInput = document.getElementById('msgInput').value;
    document.getElementById('msgInput').value = '';

    const receiver = document.getElementById('receiverInput').value;

    if (textInput.length > 0)
    {
        socket.emit('newMessage', textInput, receiver);

        createElementFun('newMessageMe', textInput);
    }else{
        return false;
    }
});

socket.on('quitUser', (pseudo) => {
    createElementFun('quitUser', pseudo);
});

socket.on('newUser', (pseudo) => {
    createElementFun('newUser', pseudo);
});

socket.on('newUserInDb', (pseudo) => {
    newOptions = document.createElement('option');
    newOptions.textContent = pseudo;
    newOptions.value = pseudo;
    document.getElementById('receiverInput').appendChild(newOptions);
});

socket.on('newMessageAll', (content) =>  {
    createElementFun('newMessageAll',content);
});

socket.on('whisper', (content) => {
    createElementFun('whisper', content);
});

socket.on('oldWhispers', (messages) => {
   setTimeout(() => {
    messages.reverse().forEach(message => {
        
        createElementFun('oldWhispers', message)
    });
   }, 10);

});

socket.on('writting', (pseudo) => {
    document.getElementById('isWritting').textContent = pseudo + ' est en train d\'écrire';
});

socket.on('notwritting', () => {
    document.getElementById('isWritting').textContent = '';
});

socket.on('oldMessages', (messages) => {
    console.log(messages);
    messages.reverse().forEach(message => {
        if (message.sender == pseudo){
            createElementFun('oldMessagesMe', message)
        } else {
            createElementFun('oldMessages', message);
        }
    });
});

//Fonction

function writting(){
    socket.emit('writting', pseudo);
}

function notwritting(){
    socket.emit('notwritting');
}

function createElementFun(element,content){
    const newElement = document.createElement('div');
    switch(element){
        case 'newUser': 
            newElement.classList.add(element, 'message');
            newElement.textContent = content + ' a rejoint le jeu !';
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'quitUser': 
        //newElement.classList.add(element, 'message');
        //newElement.textContent = content + ' a quitté le chat';
        //document.getElementById('msgContainer').appendChild(newElement);
        break;
        
        case 'newMessageMe' :
            var now = new Date();
            newElement.classList.add(element, 'message');
            newElement.innerHTML = pseudo + ": " + content +  "   - " + now.getHours() + ":" + now.getMinutes();
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'newMessageAll' :
            var now = new Date();
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.pseudo + ": " + content.message +  "   - " + now.getHours() + ":" + now.getMinutes();
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'whisper' :
            var now = new Date();
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.sender + " vous a chuchoté: " + content.message  +  "   - " + now.getHours() + ":" + now.getMinutes();
            document.getElementById('msgContainer').appendChild(newElement);
            break;
        
        case 'oldMessages':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.sender + ": " + content.content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'oldMessagesMe':
            newElement.classList.add('newMessageMe', 'message');
            newElement.innerHTML = content.sender + ": " + content.content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;

        case 'oldWhispers':
            newElement.classList.add(element, 'message');
            newElement.innerHTML = content.sender + " vous a chuchoté: " + content.content;
            document.getElementById('msgContainer').appendChild(newElement);
            break;
    }
}




//JEU

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
const keys = [];

const locker = new Image();
locker.src='casier.png'
const textures = new Image();
textures.src='textures.png'
const wooden = new Image();
wooden.src='dark-wood.png'
const bckgrnd = new Image();
const playerSprite1 = new Image();
playerSprite1.src='schoolboy.png';
const playerSprite2 = new Image();
playerSprite2.src='deadpool.png';
const playerSprite3 = new Image();
playerSprite3.src='thor.png';
const playerSprite4 = new Image();
playerSprite4.src='leia.png';
bckgrnd.src = 'woodexEx.png';


socket.on('newPos',function(data){
    
    ctx.drawImage(bckgrnd, 0, 0, canvas.width, canvas.height);
   
    ctx.drawImage(locker, 0, 0, 25, 50, 320, 290, 25, 50);//casier
    ctx.drawImage(locker, 0, 0, 25, 50, 320, 220, 25, 50);//casier
    ctx.drawImage(locker, 0, 0, 25, 50, 320, 360, 25, 50);//casier
    ctx.drawImage(locker, 0, 0, 25, 50, 320, 430, 25, 50);//casier
    ctx.drawImage(locker, 0, 0, 25, 50, 320, 500, 25, 50);//casier
    
    
    ctx.drawImage(textures, 671, 431, 97, 146, 360, 400, 97, 146);//tapis
    ctx.drawImage(textures, 671, 431, 97, 146, 360, 200, 97, 146);//tapis
    ctx.drawImage(textures, 527, 432, 145, 95, 175, 90, 145, 95);//tapis
    ctx.drawImage(textures, 527, 432, 145, 95, 500, 90, 145, 95);//tapis
    
    ctx.drawImage(textures, 385, 526, 47, 99, 20, 120, 47, 99);//plante
    ctx.drawImage(textures, 385, 526, 47, 99, 735, 120, 47, 99);//plante

    ctx.drawImage(wooden, 98, 802, 93, 30, 190, 200, 93+93*0.2, 30+30*0.2);//mur coté
    ctx.drawImage(wooden, 98, 802, 93, 30, -10, 200, 93+93*0.2, 30+30*0.2);//mur coté
    ctx.drawImage(wooden, 98, 802, 93, 30, 510, 200, 93+93*0.2, 30+30*0.2);//mur coté
    ctx.drawImage(wooden, 98, 802, 93, 30, 700, 200, 93+93*0.2, 30+30*0.2);//mur coté
    ctx.drawImage(wooden, 98, 802, 93, 30, 520, 400, 93+93*0.2, 30+30*0.2);//mur coté
    ctx.drawImage(wooden, 98, 802, 93, 30, 700, 400, 93+93*0.2, 30+30*0.2);//mur coté

    ctx.drawImage(wooden, 224, 132, 18, 86, 300, 200, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 300, 250, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 300, 300, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 300, 350, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 300, 400, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 300, 450, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 300, 500, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 300, 550, 21.6, 103.2);//mur 

    ctx.drawImage(wooden, 224, 132, 18, 86, 500, 200, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 500, 250, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 500, 300, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 500, 350, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 500, 400, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 500, 450, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 500, 500, 21.6, 103.2);//mur
    ctx.drawImage(wooden, 224, 132, 18, 86, 500, 550, 21.6, 103.2);//mur 

    ctx.drawImage(wooden, 319, 128, 32, 59, 563, 0, 32+32*0.2, 59+59*0.2); // bibliothèque vide
    ctx.drawImage(wooden, 353, 127, 31, 59, 600, 0, 37.2, 70.8);// bibliothèque pleine
    ctx.drawImage(wooden, 353, 127, 31, 59, 637, 0, 37.2, 70.8);// bibliothèque pleine
    ctx.drawImage(wooden, 319, 128, 32, 59, 674, 0, 32+32*0.2, 59+59*0.2); // bibliothèque vide

    ctx.drawImage(wooden, 384, 752, 95, 73, 350, 0, 114, 89); // cheminée
    ctx.drawImage(wooden, 63, 768, 65, 33, 630, 480, 78, 39.6); // bureau
    ctx.drawImage(wooden, 352, 418, 32, 65, 755, 380, 32+32*0.2, 68+68*0.2); // tirroir
    ctx.drawImage(wooden, 352, 418, 32, 65, 715, 380, 32+32*0.2, 68+68*0.2); // tirroir
    ctx.drawImage(wooden, 419, 678, 24, 26, 653, 520, 24+24*0.2, 26+26*0.2); // chaise derriere

    ctx.drawImage(wooden, 0, 628, 64, 75, 520, 380, 64+64*0.2, 75+75*0.2); // Armoire face
    ctx.drawImage(wooden, 79, 843, 64, 70, 100, 0, 64+64*0.2, 70+70*0.2); // Piano accueil
   

    ctx.drawImage(wooden, 388, 575, 21, 32, 100, 305, 21+21*0.2, 32+32*0.2); // Chaise coté
    ctx.drawImage(wooden, 388, 575, 21, 32, 50, 305, 21+21*0.2, 32+32*0.2); // Chaise coté
    ctx.drawImage(wooden, 388, 575, 21, 32, 100, 355, 21+21*0.2, 32+32*0.2); // Chaise coté
    ctx.drawImage(wooden, 388, 575, 21, 32, 50, 355, 21+21*0.2, 32+32*0.2); // Chaise coté
    ctx.drawImage(wooden, 388, 575, 21, 32, 100, 405, 21+21*0.2, 32+32*0.2); // Chaise coté
    ctx.drawImage(wooden, 388, 575, 21, 32, 50, 405, 21+21*0.2, 32+32*0.2); // Chaise coté
    ctx.drawImage(wooden, 388, 575, 21, 32, 100, 455, 21+21*0.2, 32+32*0.2); // Chaise coté
    ctx.drawImage(wooden, 388, 575, 21, 32, 50, 455, 21+21*0.2, 32+32*0.2); // Chaise coté
    ctx.drawImage(wooden, 262, 746, 19, 73, 275, 190, 19+19*0.2, 73+73*0.2); // Pendule

    ctx.drawImage(wooden, 102, 64, 25, 84, 200, 315, 25+25*0.2, 84+84*0.2); // table
    ctx.drawImage(wooden, 102, 64, 25, 84, 200, 390, 25+25*0.2, 84+84*0.2); // table
    
    ctx.drawImage(wooden, 192, 0, 128, 51, 585, 280, 128+128*0.2, 51+51*0.2); // Manger
    

    for(var i=0;i < data.length; i++){
        switch (data[i].char) {
            case "1":
                if (data[i].name.length > 15){
                    ctx.font = "bold 12px Arial";
                }else{
                    ctx.font = "bold 16px Arial";
                }
                ctx.fillStyle = "white";
                ctx.textAlign = 'center';
                ctx.fillText(data[i].name, data[i].x+16, data[i].y);
                drawSprite(playerSprite1, data[i].width * data[i].frameX, data[i].height * data[i].frameY, data[i].width, data[i].height, data[i].x, data[i].y, data[i].width, data[i].height);
                break;
            case "2":
                if (data[i].name.length > 15){
                    ctx.font = "bold 12px Arial";
                }else{
                    ctx.font = "bold 16px Arial";
                }
                ctx.fillStyle = "white";
                ctx.textAlign = 'center';
                ctx.fillText(data[i].name, data[i].x+16, data[i].y);
                drawSprite(playerSprite2, data[i].width * data[i].frameX, data[i].height * data[i].frameY, data[i].width, data[i].height, data[i].x, data[i].y, data[i].width, data[i].height);
                break;
            case "3":
                if (data[i].name.length > 15){
                    ctx.font = "bold 12px Arial";
                }else{
                    ctx.font = "bold 16px Arial";
                }
                ctx.fillStyle = "white";
                ctx.textAlign = 'center';
                ctx.fillText(data[i].name, data[i].x+16, data[i].y);
                drawSprite(playerSprite3, data[i].width * data[i].frameX, data[i].height * data[i].frameY, data[i].width, data[i].height, data[i].x, data[i].y, data[i].width, data[i].height);
                break;
            case "4":
                if (data[i].name.length > 15){
                    ctx.font = "bold 12px Arial";
                }else{
                    ctx.font = "bold 16px Arial";
                }
                ctx.fillStyle = "white";
                ctx.textAlign = 'center';
                ctx.fillText(data[i].name, data[i].x+16, data[i].y);
                drawSprite(playerSprite4, data[i].width * data[i].frameX, data[i].height * data[i].frameY, data[i].width, data[i].height, data[i].x, data[i].y, data[i].width, data[i].height);
                break;
        }

    }
});

function drawSprite(img,sX,sY,sW,sH,dX,dY,dW,dH)
{
    ctx.drawImage(img,sX,sY,sW,sH,dX,dY,dW,dH);
}


window.addEventListener("keydown", function(event){
    
    if ((event.key === "ArrowUp" || event.key === "z") ){ //&& this.y > 0
        socket.emit('keyPress',{inputId:'up',state:true});
    }
    if ((event.key === "ArrowLeft" || event.key === "q") ){ //&& this.x > 0
        socket.emit('keyPress',{inputId:'left',state:true});
    }
    if ((event.key === "ArrowDown" || event.key === "s")){ //UP  && this.y < canvas.height - this.height
        socket.emit('keyPress',{inputId:'down',state:true});
    }
    if ((event.key === "ArrowRight" || event.key === "d") ){ //&& this.x < canvas.width - this.width
        socket.emit('keyPress',{inputId:'right',state:true});
    }
    keys[event.key] = true;
});

window.addEventListener("keyup", function(event){
    if ((event.key === "ArrowUp" || event.key === "z")){
        socket.emit('keyPress',{inputId:'up',state:false});
    }
    if ((event.key === "ArrowLeft" || event.key === "q")){
        socket.emit('keyPress',{inputId:'left',state:false});
    }
    if ((event.key === "ArrowDown" || event.key === "s")){ //UP
        socket.emit('keyPress',{inputId:'down',state:false});
    }
    if ((event.key === "ArrowRight" || event.key === "d")){
        socket.emit('keyPress',{inputId:'right',state:false});
    }
    delete keys[event.key];

});