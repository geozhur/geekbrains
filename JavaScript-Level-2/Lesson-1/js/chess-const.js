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

                document.getElementById('shah').appendChild(newDiv);
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

    var parentEnable = this.addImgToCell;
    this.addImgToCell = function(N,x,y) {     
        var img = parentEnable(conf.pieceDir+imgF[N],x,y);
        img.x1 = x;
        img.y1 = y;
        img.f = imgF[N];
        img.F = N;
        img.ondblclick = onDblClickCell;
    }

    function onDblClickCell () {

        var newDiv=document.createElement('div');
        var divTemp ={};
        newDiv.id="del-num-"+this.x1+this.y1;
        if(this.F != (this.F).toLowerCase()) {
            newDiv.setAttribute("class",elem.id+"-white");
            divTemp = document.getElementById(elem.id+'-white').appendChild(newDiv);
        } else {
            newDiv.setAttribute("class",elem.id+"-black");
            divTemp = document.getElementById(elem.id+'-black').appendChild(newDiv);  
        }

        this.remove();
        var img =parentEnable(conf.pieceDir+this.f,this.x1,this.y1,divTemp);
        img.f=this.f;
        img.x1 = this.x1;
        img.y1= this.y1;

        img.ondblclick = function() {
        
            var DivH=document.getElementById(elem.id+'-'+this.x1+this.y1 );
            var imgH=parentEnable(conf.pieceDir+this.f,this.x1,this.y1,DivH);
            newDiv.remove(); 
        }

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

    // Загружаем фигуры на доску по FEN нотации
    var ImgToCell = this.addImgToCell;
    this.load = function (fen) {
       pos = fenToObj(fen);
       for(key in pos) {
           ImgToCell(pos[key],key.charAt(0),key.charAt(1));
       }
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

