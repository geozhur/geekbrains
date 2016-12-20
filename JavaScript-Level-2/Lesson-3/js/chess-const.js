"use strict";
//////////////
//
// Общие функции
//
/////////////


function array_flip( trans )
{
    var key, tmp_ar = {};
    for ( key in trans )
    {
        if ( trans.hasOwnProperty( key ) )
        {
            tmp_ar[trans[key]] = key;
        }
    }
    return tmp_ar;
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    var response;
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
   rawFile.send(null);
}


//////
//
// Класс создания доски. Можно создать доску произвольного 
// размера, цветами и количеством чеек.
// 
// elem     - элемент в котором рисуем доску
// sizeСell - размер ячейки доски
// colorB   - цвет черного поля 
// colorW   - цвет белого поля
// coorV    - массив координат доски по вертикали , пример [8,7,6,5,4]
// coorH    - массив координат доски по горизонтале , пример [a,b,c,d,e]
// visibleCoorV - будем ли рисовать вертикальную линейку
// visibleCoorH - будем ли рисовать горизонлаьную линейку координат 
//
//////

function Board( elem, sizeСell, colorB, colorW, coorV, coorH, 
                visibleCoorV, visibleCoorH) {

    visibleCoorV = visibleCoorV || true; 
    visibleCoorH = visibleCoorH || true;
    var lenX = coorH.length + visibleCoorV * 2;
    var lenY = coorV.length + visibleCoorH * 2;

    var el_click=""; // в переменной хранится выделенный, текущий  div

    this.getSelection = function() {
        return el_click;
    } 

    function onClickCell() {
          
        if(el_click != "") {
          el_click.classList.remove( 'item-select' );
          el_click.removeAttribute("tabIndex");
        }

        this.classList.add( 'item-select' );
        this.setAttribute("tabIndex", 0);
        el_click = this;
        this.focus();          
    }

    function onFocusCell() {
        var newDiv = document.getElementById(elem.id+"-pozition");
        newDiv.innerHTML = "Позиция: " + coorH[el_click.y]+coorV[el_click.x] ;
    }
  
  //
  // Передвигает выделение ячейки относительно текущий.
  //

    function moveSelect(mov_y, mov_x) {

      if(el_click != "") {
        mov_x = el_click.x + mov_x;
        mov_y = el_click.y + mov_y;
        mov_x = (mov_x < 0) ? coorV.length-1 : mov_x;
        mov_y = (mov_y < 0) ? coorH.length-1 : mov_y;
        mov_x = (mov_x > coorV.length-1) ? 0 : mov_x;
        mov_y = (mov_y > coorH.length-1) ? 0 : mov_y;
        el_click.classList.remove( 'item-select' );
        el_click.removeAttribute("tabIndex");
        var newDiv= document.getElementById(elem.id+"-"+mov_x+mov_y );
        newDiv.x = mov_x;
        newDiv.y = mov_y;
        newDiv.classList.add( 'item-select' );
        newDiv.setAttribute("tabIndex",0);
        el_click=newDiv;
        newDiv.focus();
       }

    }

    //
    // Отслеживаем нажатие клавиатуры на доске.
    //

    elem.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:  moveSelect(-1, 0);  break;
            case 38:  moveSelect(0, -1);  break;
            case 39:  moveSelect(1, 0);   break;
            case 40:  moveSelect(0, 1);   break;
        }
    }

    //
    // Создаем доску со всеми элементами.
    //


    this.clearTable = function() {
       for (var i = 0; i < lenY; i++) {                
            for (var j = 0; j < lenX; j++) { 
                var imgTemp=document.getElementById('img-'+elem.id+'-'+i+j);
                if(imgTemp !==null) {
                   imgTemp.remove(); 
                }
            }
        }
    }

    function createTable() {

        var x;
        var y;

        elem.style.width=(lenX * sizeСell) + 'px';

        for (var i = 0; i < lenY; i++) {                
            for (var j = 0; j < lenX; j++) { 

                x = i;
                y = j;

                var newDiv=document.createElement('div');
                newDiv.setAttribute("class","cell-sh");
                newDiv.style.width = sizeСell+'px';
                newDiv.style.height = sizeСell+'px';
                newDiv.style.lineHeight = sizeСell+'px';
                newDiv.id='line-'+elem.id+'-'+i+j;

                if( visibleCoorV && (j==0 || j==lenX-1)) {
                  
                    if (visibleCoorH)
                        newDiv.innerHTML = coorV[i-1] || "";
                    else
                        newDiv.innerHTML = coorV[i] || "";
                                
                } else if( visibleCoorH && (i==0 || i==lenY-1)) {
                  
                    if (visibleCoorV)
                        newDiv.innerHTML = coorH[j-1] || "";
                    else
                        newDiv.innerHTML = coorH[j] || "";
              
                } else {
        
                    if(visibleCoorH) x--;
                    if(visibleCoorV) y--;

                    newDiv.id=elem.id+'-'+x+y;
                    
                    if( (x+y)%2 == 0) 
                        newDiv.style.backgroundColor=colorB;
                    else
                        newDiv.style.backgroundColor=colorW;
                     
                    newDiv.x = x;
                    newDiv.y = y;
                    newDiv.onfocus = onFocusCell;
                    newDiv.onclick = onClickCell;
               //   newDiv.ondblclick = onDblClickCell;
                }

                elem.appendChild(newDiv);
            } //end for j
        } //end for i

    }

    this.run = function() {
        createTable();
    }

    //
    // Установка картинки в ячейку доски или в любой елемент el.
    //
 
    this.addImgToCell = function(srcImg, x, y, el) {
        var divTemp = {};

        if(el != undefined) 
            divTemp = el;
        else 
            divTemp=document.getElementById(elem.id+'-'+x+y);
       
        var img = document.createElement('img');
        img.src = srcImg;
        img.width = sizeСell;
        img.heigth = sizeСell;
        img.id = 'img-'+elem.id+'-'+x+y;

        divTemp.appendChild(img);

        return img;
    } 
}

/////
// 
//  Класс создания доски шахмат
//  elem - элемент, в котором рисуем доску
//  sizeСell - размер ячейки доски
//  colorB   - цвет черного поля 
//  colorW   - цвет белого поля
////

function ChessBoard(elem,sizeСell,colorB,colorW) 
{
    var cV = [8,7,6,5,4,3,2,1];
    var cH = ['a','b','c','d','e','f','h','g'];
    var cVrevers = array_flip(cV);
    var cHrevers = array_flip(cH);
    
    Board.call(this,elem,sizeСell,colorB,colorW,cV,cH,true,true);

    var pos = {}; // объект состоящий из координат фигур на доске.

    var imgF = {
          p: 'chess.svg#svgView(viewBox(225, 45, 45, 45))',
          n: 'chess.svg#svgView(viewBox(135, 45, 45, 45))',
          b: 'chess.svg#svgView(viewBox(90, 45, 45, 45))',
          r: 'chess.svg#svgView(viewBox(180, 45, 45, 45))',
          q: 'chess.svg#svgView(viewBox(45, 45, 45, 45))',
          k: 'chess.svg#svgView(viewBox(0, 45, 45, 45))',
          P: 'chess.svg#svgView(viewBox(225, 0, 45, 45))',
          N: 'chess.svg#svgView(viewBox(135, 0, 45, 45))',
          B: 'chess.svg#svgView(viewBox(90, 0, 45, 45))',
          R: 'chess.svg#svgView(viewBox(180, 0, 45, 45))',
          Q: 'chess.svg#svgView(viewBox(45, 0, 45, 45))',
          K: 'chess.svg#svgView(viewBox(0, 0, 45, 45))',

    };

    var parentAddImgToCell = this.addImgToCell;
    this.addImgToCell = function(N,x,y) {     
        var img = parentAddImgToCell(conf.pieceDir+imgF[N],x,y);
        img.x1 = x;
        img.y1 = y;
        img.F = N;
        img.ondblclick = onDblClickCell;
    }

    function returnColor(fig) {
        if(fig != fig.toLowerCase()) {
            return 'white';
        }
        else {
            return 'black';
        }
    }

    function onDblClickCell () {
        
        var newDiv=document.createElement('div');
        var divTemp ={};
        var color = returnColor(this.F);
        var xy = (this.x1+this.y1).toString();
        this.xy = xy;
        newDiv.id="del-num-"+xy;       
        newDiv.setAttribute("class","shah-"+color);
        divTemp = document.getElementById(elem.id+'-'+color).appendChild(newDiv);

        var img = document.getElementById('img-'+elem.id+'-'+xy);

        img.ondblclick = function() {
            var DivH=document.getElementById(elem.id+'-'+this.xy );
            var imgH=document.getElementById('img-'+elem.id+'-'+this.xy);
            imgH.ondblclick = onDblClickCell;
            DivH.appendChild(imgH);
            newDiv.remove(); 
        }.bind(this);

        newDiv.appendChild(img);        
    }


    function fenToObj(fen) {

        fen = fen.replace(/ .+$/, '');

        var rows = fen.split('/');
        var position = {};

        for (var i = 0; i < 8; i++) {
          var row = rows[i].split('');
          var colIndex = 0;

            for (var j = 0; j < row.length; j++) {

                if (row[j].search(/[1-8]/) !== -1) {
                    var emptySquares = parseInt(row[j], 10);
                    colIndex += emptySquares;
                }

                else {

                    var square = i.toString() + colIndex.toString() ;
                    position[square] = row[j];
                    colIndex++;
                }
            }
        }

      return position;
    }
  
    function isFigure(c) { 
        switch(c) {
          case 'p': 
          case 'n':
          case 'b': 
          case 'r':
          case 'q': 
          case 'k': 
          case 'P': 
          case 'N': 
          case 'B': 
          case 'R': 
          case 'Q': 
          case 'K': return true;
        }
        return false;
    }


    //
    // Преобразование классических координат в типа a1 в координаты доски, типа 00
    //

    function convertJsonToPos(c) {
        var x = cVrevers[c.charAt(1)];
        var y = cHrevers[c.charAt(0)];

        if (x !== 'undefined' && y !== 'undefined') {
            return (x+y).toString();
        }

        return false;
    }


    function printError(text) {
        var newDiv = document.getElementById(elem.id+"-pozition");
        newDiv.innerHTML = "Error:<br>" + text ;
    }
    
    //
    // Проверка численности фигур
    //


    function checkPos() {
        var sum;
        var text="";
        for(var key in imgF) {
            sum = 0;

            for (var key2 in pos) {
                if( pos[key2] == key ) {
                    sum++;
                }
            }

            switch(key) {
               case 'p': if(sum > 8) text+="Черных пешек больше 8<br>";
               break;
               case 'n': if(sum > 2) text+="Черных коней больше 2<br>";
               break;
               case 'b': if(sum > 2) text+="Черных слонов больше 2<br>";
               break;
               case 'r': if(sum > 2) text+="Черных лодей больше 2<br>";
               break;
               case 'q': if(sum > 1) text+="Черная королева может быть только одна<br>";
               break; 
               case 'k': if(sum != 1) text+="Черный король должен быть только один<br>";
               break; 
               case 'P': if(sum > 8) text+="Белых пешек больше 8<br>";
               break; 
               case 'N': if(sum > 2) text+="Бедых коней больше 2<br>";
               break; 
               case 'B': if(sum > 2) text+="Бедых слонов больше 2<br>";
               break;
               case 'R': if(sum > 2) text+="Бедых лодей больше 2<br>";
               break; 
               case 'Q': if(sum > 1) text+="Белая королева может быть только одна<br>";
               break; 
               case 'K': if(sum != 1) text+="Белый король должен быть только один<br>";
               break;
            }
        }
        console.log(text);
        return text;
    }

    // Проверка координат 

    function ifSah(x) {
       var ch = /([a-f][1-8]){1}/i ;
         if(ch.test(x))
          return true;
         else
          return false; 
       }
    }

    // 
    //
    // Парсинг координат из Json
    //
    //

    function parseJsonToObj(data,text) {

        var flag = 0;
        pos = {};
        for(var key in data.position) {

            var pos_key = convertJsonToPos(key);
            var check_figur = isFigure(data.position[key]);
            if(pos_key!==false && check_figur) {
              pos[pos_key] = data.position[key];
            }
            else {
              flag = 1;
            }
             // console.log("Неправильно записанны координаты или фигуры");
        }
        

        var textError= checkPos();
        if(textError!=="")
            flag=2;


        var newDiv = document.getElementById(elem.id+"-pozition");
        newDiv.innerText = "" ;
 
        if (flag == 0 ) {

            PosToChessBoard();
        }
        else
        {
            switch(flag) {
                case 1: printError("Неправильно записанны координаты или фигуры:<br>"+text);
                break;
                case 2: printError(textError+"<br>"+text);
                break;
            }
            clearChessBoard();
        }

    }




    this.JsonFileSelect = function(file) {

       readTextFile(file, function(text){
            var d = JSON.parse(text);
            var index = 0;
            var newSelect = document.createElement('select');


               var opt = document.createElement("option");
               opt.value= "";
               opt.innerHTML = "Тут выбрать позицию"; 
               newSelect.appendChild(opt); 
               index++;           
             
            for(var element in d)
            {
              console.log(element);
               var opt = document.createElement("option");
               opt.value= element;
               opt.innerHTML = element; 
               newSelect.appendChild(opt);
               index++;
            }

            newSelect.onchange = function() {
              console.log(d[this.options[this.selectedIndex].value]);
                var t = d[this.options[this.selectedIndex].value];
                
                parseJsonToObj(t,JSON.stringify(t.position)); 
                 //console.log(this.options[this.selectedIndex].value);
            }

            elem.appendChild(newSelect);
  
       });

    }

    this.JsonFileToObj = function(file) {
       readTextFile(file, function(text){
            var d = JSON.parse(text);
            parseJsonToObj(d,text);   
       });
   
    }


    var parentClearTable = this.clearTable;
    function clearChessBoard() {
        parentClearTable();
    }

    function PosToChessBoard() {
      clearChessBoard();
       for(var key in pos) {
           localAddImgToCell(pos[key],key.charAt(0),key.charAt(1));
       }
    }
    
    // Загружаем фигуры на доску по FEN нотации
    var localAddImgToCell = this.addImgToCell;
    this.load = function (fen) {
       pos = fenToObj(fen);
       PosToChessBoard();
    };
}


////
// 
//  Создаем шахматную игру.
//  (Играть пока не собираемся. 
//
/////

function Chess(elem, cB) {
    ChessBoard.call(this,elem,cB.sizeСell,cB.colorB,cB.colorW);


    var parentRun = this.run;
    this.run = function() { 
         parentRun();
    }


    var parentLoad = this.load;
    this.load = function(fen) { 
         parentLoad(fen);
    }

}

 