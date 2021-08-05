if((navigator.userAgent.indexOf("Android") == -1) && (navigator.userAgent.indexOf("iPhone OS") == -1)) {
    location.href = "/checkers/";
}

//Variables globales
var squareSize = 80
var boardWidth = squareSize * 8;
var boardHeight = squareSize * 8;
var red = "#e7eaf6";
var blue = "#000000";
var whosTurnIs = red;

//Array para saber la locacion de las piezas
var pieceTracker = new Array();
var board;
var boardContext;
var pieceBeingMoved;
var gameInProgress;
var cursorLocation = [0,0];
var jumpLocation = [0,0];
var CupHeadScore = 0;
var MugmanScore = 0;

//Funcion para inicializar juego
function initializeGame(){
    board = document.getElementById("board");
    boardContext = board.getContext("2d");

//Toma los elementos de los jugadores del HTML
scoreCard = document.getElementById("score_card");
scoreCard.innerHTML = "<div id='restart_game' class='butn' onclick='restartGame(); return false;'>Start New Game</div>";
scoreCard.innerHTML+= "<div id='save_game' class='butn' onclick='saveGame(); '>Save Game</div>";
scoreCard.innerHTML+= "<div id='load_game' class='butn' onclick='LoadGame(); '>Load Game</div>";
scoreCard.innerHTML+= "<div id='add_player' class='butn' onclick='addPlayer();'>Add Player</div>";
scoreCard.innerHTML += "<div id='player_one' class='player'> <img src='images/cuphead.png'>Player 1: <span id='player_one_score'></span> <input id='player1'type='text' value='enter your name'/></div>";
scoreCard.innerHTML += "<div id='player_two' class='player'> <img src='images/mugman.png'>Player 2: <span id='player_two_score'></span> <input id='player2'type='text' value='enter your name'/></div>";
scoreCard.innerHTML += "<div id='whosturn'></div>";


}

window.onload = function(){
    initializeGame();
    initializePieces();
    newGame();
}

//Funcion para nuevo juego,resetea todo
function newGame(){
whosTurnIs = red;
pieceTracker = new Array();
gameInProgress = true;
cursorLocation = [0,0];
jumpLocation = [0,0];
CupHeadScore = 0;
MugmanScore = 0;
initializeGame();


//Resetea puntos
document.getElementById("player_one_score").innerHTML = CupHeadScore;
document.getElementById("player_two_score").innerHTML = MugmanScore;

initializePieces();
   
    drawGame();
    

}

//Para inicializar
function initializePieces(){
    var redCounter = 0;
    var blueCounter = 0;
    var pieceCounter = 0;

    for (var j = 1; j < 9; j++) {
        
        for (var i = 1; i < 9; i+=2) {
           if (j<4) {//Añada piezas rojas al tablero
               pieceTracker.push(new piece(i + (j % 2),j,false,red));
               //Añada piezas azules al tablero
           } else if (j > 5) {
               pieceTracker.push(new piece(i + (j % 2),j,false,blue));
           }
            
        }
    }


}

//Funcion para setear fila, columna, rey,color
function piece(x,y,k,c){
this.col = x;
this.row = y;
this.king = k;
this.color = c;
}


function drawGame()
{            
   
    board.width = boardWidth;
    board.height = boardHeight;
    
               
    positionBoard();
    
   
    drawBoard();
    
   
    drawPieces();
    
  
    if(whosTurnIs == red) {
        document.getElementById("whosturn").innerHTML = "Cuphead";
        document.getElementById("whosturn").style.color = whosTurnIs;
    } else if(whosTurnIs == blue) {
        document.getElementById("whosturn").innerHTML = "Mugman";
        document.getElementById("whosturn").style.color = whosTurnIs;
    }
    
   
    document.getElementById("player_one_score").innerHTML = CupHeadScore;
    document.getElementById("player_two_score").innerHTML = MugmanScore;            
}



function positionBoard(){
    if ((browserWidth() - boardWidth) /2 > 250 ) {
        board.style.left =(browserWidth() - boardWidth) / 2 + "px";
        document.getElementById("score_card").style.width = board.offsetLeft + "px";
    } else{
        board.style.left = "250px";
        document.getElementById("score_card").style.width = "250px";
    }


}

//Dibuja los cuadrados usando los indices de las columnas y las filas
function drawBoard(){
    for (var i = 1; i< 9; i++) {
        
        for (var j = 1; j < 9; j++) {
           
           drawSquare(i,j);
        }
    }

    board.addEventListener("mousedown", clickPiece, false);
}

//Funcion para dibujar usando columnas y filas
function drawSquare(x,y){
var color;

if(((x % 2 == 0) && (y % 2 == 0)) || ((x % 2 == 1) && (y % 2 == 1))) {
    color = red;
} else if(((x % 2 == 0) && (y % 2 == 1)) || ((x % 2 == 1) && (y % 2 == 0))) {
    color = blue;
}


boardContext.beginPath();
boardContext.fillStyle = color;
boardContext.moveTo((x -1) * squareSize, (y - 1 ) * squareSize);
boardContext.lineTo( x * squareSize,(y - 1) * squareSize);
boardContext.lineTo(x * squareSize, y * squareSize);
boardContext.lineTo((x-1) * squareSize, y * squareSize );
boardContext.lineTo((x - 1 ) * squareSize,(y - 1) * squareSize);
boardContext.closePath();
boardContext.fill();     

}

//
function drawPieces(){
    //Dibuja todas las piezas en el array
    for(var i = 0; i < pieceTracker.length; i++) {
        boardContext.beginPath();
        boardContext.fillStyle = pieceTracker[i].color;
        boardContext.lineWidth = 5;
        boardContext.strokeStyle = red;
        boardContext.arc((pieceTracker[i].col - 1) * squareSize + (squareSize * 0.5) + 0.5,(pieceTracker[i].row - 1) * squareSize + (squareSize * 0.5) + 0.5,(squareSize * 0.5) - 10,0,2 * Math.PI,false);
        boardContext.closePath();
        boardContext.stroke();
        boardContext.fill();

        //Añade reina 
        if(pieceTracker[i].king) {
            boardContext.beginPath();
            boardContext.lineWidth = 2;
            boardContext.strokeStyle = "#FFD119;";
            boardContext.arc((pieceTracker[i].col - 1) * squareSize + (squareSize* 0.5) + 0.5,(pieceTracker[i].row - 1) * squareSize + (squareSize * 0.5) + 0.5,(squareSize * 0.5) - 30,0,2 * Math.PI,false);
            boardContext.closePath();
            boardContext.stroke();
        }


    } 
}


//Funcion canvas
function canvasLoc(e){
    var canvasLocation = [0,0];
    var canvasXOffset = document.getElementById("board").offsetLeft;
    var canvasYOffset = document.getElementById("board").offsetTop;

    //
    if ((e.pageX != undefined) && (e.pageY != undefined)) {
        canvasLocation[0] = e.pageX;
        canvasLocation[1] = e.pageY;
    } else {
        canvasLocation[0] = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        canvasLocation[1] = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    
    canvasLocation[0] -= canvasXOffset;
    canvasLocation[1] -= canvasYOffset;
    
    return canvasLocation;
}

function cursorLoc(e)
{
    var canvasLocation = canvasLoc(e);
                    
    /* actualizo ancho real de las casillas para la posicion relativa del puntero */
    squareSize1 = board.scrollWidth /8;
    console.log('referencia ancho de la casilla: ' + squareSize1);

    var cl1 = Math.ceil(canvasLocation[0] * (1 / squareSize1));
    var cl2 = Math.ceil(canvasLocation[1] * (1 / squareSize1));
    cursorLocation = [cl1,cl2];
    
    /* calculo posicion en tiempo real del cursor */
    var cp1 = canvasLocation[0] * (1 / squareSize1);
    var cp2 = canvasLocation[1] * (1 / squareSize1);
    cursorPosition = [cp1,cp2];

    console.log('valor de cursorLocation: ' + cursorLocation);
    console.log('valor de cursorPosition: ' + cursorPosition);
}

//
function clickPiece(e){
    //obtiene la ubicacion actual del cuadrado 
    cursorLoc(e)

    var isPiece = checkForPiece();
    //Si es el turno de la pieza, continua el juego
    if (isPiece == whosTurnIs) {
        for (var i = 0; i < pieceTracker.length; i++) {
            if ((pieceTracker[i].col == cursorLocation [0]) && (pieceTracker[i].row == cursorLocation[1]) ) {
                pieceBeingMoved = pieceTracker[i];
                pieceTracker.splice(i,1);
            }
            
        }

        //Añade EventListener para arrastrar y soltar la pieza
        board.addEventListener("mousemove",dragPiece,false);
        board.addEventListener("mouseup",dropPiece,false);
    }
}


function checkForPiece()
{
    //Se fija si el cuadrado tiene una pieza y retorna el color
    
    var pieceColor = null;
    for(var i = 0; i < pieceTracker.length; i++) {
        if((pieceTracker[i].col == cursorLocation[0]) && (pieceTracker[i].row == cursorLocation[1])) {
            pieceColor = pieceTracker[i].color;
        }
    }
    
    return pieceColor;
}

function dragPiece(e)
{

    cursorLoc(e);
    drawGame();

    //Arrastra la pieza y redibuja el juego
    var canvasLocation = canvasLoc(e);
    boardContext.beginPath();
    boardContext.fillStyle = whosTurnIs;
    boardContext.lineWidth = 5;
    boardContext.strokeStyle = red;

    boardContext.arc(((cursorPosition[0])*squareSize),((cursorPosition[1])*squareSize),(squareSize * 0.5) - 10,0,2 * Math.PI,false);
    
    boardContext.closePath();
    boardContext.stroke();
    boardContext.fill();
    
    
    //Convierte en reina 
    if(pieceBeingMoved.king) {
        boardContext.beginPath();
        boardContext.lineWidth = 2;
        boardContext.strokeStyle = "#FFD119;";
        boardContext.arc(canvasLocation[0],canvasLocation[1],(squareSize * 0.5) - 30,0,2 * Math.PI,false);
        boardContext.closePath();
        boardContext.stroke();
    }
}

function dropPiece(e)
{
    
    cursorLoc(e);
    var checkPiece = checkForPiece();
    var checkDiag = checkDiagonalMove();
    var checkJump = checkJumpOver();
    
    
   
    if(!checkPiece && checkDiag && checkJump) {
        
        var newPiece = new piece(cursorLocation[0],cursorLocation[1],checkKingMe(),whosTurnIs);
        pieceTracker.push(newPiece);
        
        
        if(checkJump == 1) {
            removePiece();
        }

       
        checkForWin();
    } else {
       
        pieceTracker.push(pieceBeingMoved);
    }

    //Remueve los EventListener y redibuja 
    board.removeEventListener("mousemove",dragPiece,false);
    board.removeEventListener("mouseup",dropPiece,false);
    drawGame();

    pieceBeingMoved = false;
}

//Funcion diagonal
function checkDiagonalMove()
{
    var diagonalMove = true;
    
    
    if(pieceBeingMoved.king) {
        if((cursorLocation[0] == pieceBeingMoved.col) || (cursorLocation[1] == pieceBeingMoved.row) || (Math.abs(pieceBeingMoved.col - cursorLocation[0]) != Math.abs(pieceBeingMoved.row - cursorLocation[1]))) {
            diagonalMove = false;
        }
    } else {
        if(whosTurnIs == red) {
            if((cursorLocation[0] == pieceBeingMoved.col) || (cursorLocation[1] <= pieceBeingMoved.row) || (Math.abs(pieceBeingMoved.col - cursorLocation[0]) > 2) || (Math.abs(pieceBeingMoved.col - cursorLocation[0]) != Math.abs(pieceBeingMoved.row - cursorLocation[1]))) {
                diagonalMove = false;
            }
        } else {
            if((cursorLocation[0] == pieceBeingMoved.col) || (cursorLocation[1] >= pieceBeingMoved.row) || (Math.abs(pieceBeingMoved.col - cursorLocation[0]) > 2) || (Math.abs(pieceBeingMoved.col - cursorLocation[0]) != Math.abs(pieceBeingMoved.row - cursorLocation[1]))) {
                diagonalMove = false;
            }
        }
    }
    
    return diagonalMove;
}


function checkJumpOver()
{
    var jumpOver = 0;
    
    //Si la pieza es rey tiene movimientos diferentes
   
    if(pieceBeingMoved.king) {
        
        var colDifference = pieceBeingMoved.col - cursorLocation[0];
        var rowDifference = pieceBeingMoved.row - cursorLocation[1];
        var colTemp = pieceBeingMoved.col;
        var rowTemp = pieceBeingMoved.row;
        var pieceCounter = 0;
        var colorMatch = 0;
        
        //Para iterar a traves de los cuadrados 
       
        for(var i = 0; i < Math.abs(colDifference); i++) {
           
            colTemp -= colDifference/Math.abs(colDifference);
            rowTemp -= rowDifference/Math.abs(rowDifference);
            
           
            for(var j = 0; j < pieceTracker.length; j++) {
                if((pieceTracker[j].col == colTemp) && (pieceTracker[j].row == rowTemp)) {
                    if(pieceTracker[j].color == pieceBeingMoved.color) {
                        colorMatch++;
                    } else {
                        jumpLocation[0] = pieceTracker[j].col;
                        jumpLocation[1] = pieceTracker[j].row;
                        pieceCounter++;
                    }
                }
            }
        }
            
        
        if(pieceCounter == 0 && colorMatch == 0) {
            jumpOver = 2;
        } else if(pieceCounter == 1 && colorMatch == 0) {
            jumpOver = 1;
        }
    } else {
        if((Math.abs(pieceBeingMoved.col - cursorLocation[0]) == 2 ) && (Math.abs(pieceBeingMoved.row - cursorLocation[1]) == 2)) {
            
            if(pieceBeingMoved.col - cursorLocation[0] > 0) {
                jumpLocation[0] = pieceBeingMoved.col - 1;
            } else {
                jumpLocation[0] = pieceBeingMoved.col + 1;
            }
            if(pieceBeingMoved.row - cursorLocation[1] < 0) {
                jumpLocation[1] = pieceBeingMoved.row + 1;
            } else {
                jumpLocation[1] = pieceBeingMoved.row - 1;
            }
            
           
            for(var i = 0; i < pieceTracker.length; i++) {
                if((pieceTracker[i].col == jumpLocation[0]) && (pieceTracker[i].row == jumpLocation[1]) && (pieceTracker[i].color != pieceBeingMoved.color)) {
                    jumpOver = 1;
                }
            }
        } else {
            jumpOver = 2;
        }
    }
    
    return jumpOver;
}



function removePiece()
{
    
    for(var i = 0; i < pieceTracker.length; i++) {
        if((pieceTracker[i].col == jumpLocation[0]) && (pieceTracker[i].row == jumpLocation[1])) {
            //Actualiza score
            if(pieceTracker[i].color == red) {
                MugmanScore += 1;
            } else {
                CupHeadScore += 1;
            }
            
           
            pieceTracker.splice(i,1);
        }
    }
}

//Funcion para agregar jugadores

let players = []
const addPlayer = () =>{


    let player ={
        player1: document.getElementById('player1').value,
        player2: document.getElementById('player2').value
    }

    players.push(player);
    console.warn('added', {players});
    document.getElementById("add_player").addEventListener('click',addPlayer);
    alert("Jugadores añadidos");
}





//Funcion para verificar ganador
function checkForWin()
{
    
    if((CupHeadScore == 12) || (MugmanScore == 12)) {
        
        var winner = (CupHeadScore == 12) ? "Player One" : "Player Two";
        
       
        board.removeEventListener("mousedown",clickPiece,false);
        board.removeEventListener("mousemove",dragPiece,false);
        board.removeEventListener("mouseup",dropPiece,false);
        drawGame();
        
      
        gameInProgress = false;
        
       //Muestra cartel ganador y resetea juego
        alert("The winner is " + winner + "!");
        newGame();
    } else {
        
        if(whosTurnIs == red) {
            whosTurnIs = blue;
        } else if(whosTurnIs == blue) {
            whosTurnIs = red;
        }
    }

   
}

//Funcion para guardar
function saveGame()
{
   
    
        localStorage.setItem("checkersgameinprogress",gameInProgress);
        localStorage.setItem("checkersplayeronescore",CupHeadScore);
        localStorage.setItem("checkersplayertwoscore",MugmanScore);
        localStorage.setItem("whosturnisit",whosTurnIs);
        let tracker = JSON.stringify(pieceTracker);
        localStorage.setItem("checkerspiecetracker",tracker);
        window.localStorage["player1"] = document.getElementById("player1").value;
        window.localStorage["player2"] = document.getElementById("player2").value;

        alert("Su partida ha sido guardada.");
       
        
    
}

//Funcion para cargar

function LoadGame(){
localStorage.getItem("checkersgameinprogress");
CupHeadScore = parseInt(localStorage.getItem("checkersplayeronescore"));
MugmanScore = parseInt(localStorage.getItem("checkersplayertwoscore"));
localStorage.getItem("whosturnisit");
tracker = JSON.parse(localStorage.getItem("checkerspiecetracker"));
pieceTracker = tracker;
document.getElementById("player1").value = window.localStorage["player1"];
document.getElementById("player2").value = window.localStorage["player2"];

drawGame();
alert("Su partida ha sido cargada.");

}

function checkKingMe()
{
    var kingMe = false;
    
    
    if((pieceBeingMoved.color == red) && (cursorLocation[1] == 8)) {
        kingMe = true;
    } else if((pieceBeingMoved.color == blue) && (cursorLocation[1] == 1)) {
        kingMe = true;
    } else if(pieceBeingMoved.king) {
        kingMe = true;
    }
    
    return kingMe;
}

//Funcion para resetear juego
function restartGame()
{
  
    var answer = confirm("Start a New Game?");
    if(answer == true) {
        newGame();
    }
}




//Funcion para obtener la altura de la ventana del navegador
function browserHeight()
{
    var height;

   
    if (typeof window.innerWidth != 'undefined') {
        height = window.innerHeight;
    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        height = document.documentElement.clientHeight;
    } else {
        height = document.getElementsByTagName('body')[0].clientHeight;
    }

    return height;  
}

//Funcion para obtener el ancho de la ventana del navegador
function browserWidth()
{
    var width;
    
    
    if (typeof window.innerWidth != 'undefined') {
        width = window.innerWidth;
    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        width = document.documentElement.clientWidth;
    } else {
        width = document.getElementsByTagName('body')[0].clientWidth;
    }
    
    return width;
}