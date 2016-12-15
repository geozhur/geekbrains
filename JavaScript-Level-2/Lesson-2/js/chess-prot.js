"use strict";



function Board( elem, sizeСell, colorB, colorW, coorV, coorH, 
                visibleCoorV, visibleCoorH) {

    if(typeof visibleCoorV !== "undefined") 
        this._visibleCoorV = visibleCoorV ;
    else
        this._visibleCoorV = true ;
    if(typeof visibleCoorV !== "undefined") 
        this._visibleCoorH = visibleCoorH ; 
    else
         this._visibleCoorH = true ;
    
    this._elem = elem;

    this._lenX = coorH.length + this._visibleCoorV * 2;
    this._lenY = coorV.length + this._visibleCoorH * 2;

    this._el_click=""; // в переменной хранится выделенный, текущий  div
    this._self = self = this;
    this._sizeСell = sizeСell;
    this._colorB = colorB;
    this._colorW = colorW; 
    this._coorV = coorV;
    this._coorH = coorH;
    //
    // Отслеживаем нажатие клавиатуры на доске.
    //

    elem.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37:  self.moveSelect(-1, 0);  break;
            case 38:  self.moveSelect(0, -1);  break;
            case 39:  self.moveSelect(1, 0);   break;
            case 40:  self.moveSelect(0, 1);   break;
        }
    }

}

Board.prototype._visibleCoorV = true;
Board.prototype._visibleCoorH = true;

Board.prototype.getSelection = function() {
        return this._el_click;
} 

Board.prototype.ClickCell = function(tempDiv) {
          

        if(this._el_click != "") {
          this._el_click.classList.remove( 'item-select' );
          this._el_click.removeAttribute("tabIndex");
        }

        tempDiv.classList.add( 'item-select' );
        tempDiv.setAttribute("tabIndex", 0);
        this._el_click = tempDiv;
        tempDiv.focus();          
}

Board.prototype.onClickCell = function() {
        this.self.ClickCell(this);
}

Board.prototype.FocusCell = function(tempDiv) {
        var newDiv = document.getElementById(this._elem.id+"-pozition");
        newDiv.innerHTML = "Позиция: " + this._coorH[this._el_click.y]+this._coorV[this._el_click.x] ;
}


Board.prototype.onFocusCell = function() {
       this.self.FocusCell(this);
}
  
  //
  // Передвигает выделение ячейки относительно текущий.
  //

Board.prototype.moveSelect = function(mov_y, mov_x) {

      if(this._el_click != "") {
        mov_x = this._el_click.x + mov_x;
        mov_y = this._el_click.y + mov_y;
        mov_x = (mov_x < 0) ? this._coorV.length-1 : mov_x;
        mov_y = (mov_y < 0) ? this._coorH.length-1 : mov_y;
        mov_x = (mov_x > this._coorV.length-1) ? 0 : mov_x;
        mov_y = (mov_y > this._coorH.length-1) ? 0 : mov_y;
        this._el_click.classList.remove( 'item-select' );
        this._el_click.removeAttribute("tabIndex");
        var newDiv= document.getElementById(this._elem.id+"-"+mov_x+mov_y );
        newDiv.x = mov_x;
        newDiv.y = mov_y;
        newDiv.classList.add( 'item-select' );
        newDiv.setAttribute("tabIndex",0);
        this._el_click=newDiv;
        newDiv.focus();
       }

}

    //
    // Создаем доску со всеми элементами.
    //

Board.prototype.createTable = function() {

        var x;
        var y;


        this._elem.style.width=(this._lenX * this._sizeСell) + 'px';

        for (var i = 0; i < this._lenY; i++) {                
            for (var j = 0; j < this._lenX; j++) { 

                x = i;
                y = j;

                var newDiv=document.createElement('div');
                newDiv.setAttribute("class","cell-sh");
                newDiv.style.width = this._sizeСell+'px';
                newDiv.style.height = this._sizeСell+'px';
                newDiv.style.lineHeight = this._sizeСell+'px';
                newDiv.id='line-'+this._elem.id+'-'+i+j;

                if( this._visibleCoorV && (j==0 || j==this._lenX-1)) {
                  
                    if (this._visibleCoorH)
                        newDiv.innerHTML = this._coorV[i-1] || "";
                    else
                        newDiv.innerHTML = this._coorV[i] || "";
                                
                } else if( this._visibleCoorH && (i==0 || i==this._lenY-1)) {
                  
                    if (this._visibleCoorV)
                        newDiv.innerHTML = this._coorH[j-1] || "";
                    else
                        newDiv.innerHTML = this._coorH[j] || "";
              
                } else {
        
                    if(this._visibleCoorH) x--;
                    if(this._visibleCoorV) y--;

                    newDiv.id=this._elem.id+'-'+x+y;
                    
                    if( (x+y)%2 == 0) 
                        newDiv.style.backgroundColor=this._colorB;
                    else
                        newDiv.style.backgroundColor=this._colorW;
                     
                    newDiv.x = x;
                    newDiv.y = y;
                    newDiv.self = this;
                    newDiv.onfocus =  this.onFocusCell;
                  //      this.onFocusCell(newDiv);
                   // }.bind(this);
                    
                    newDiv.onclick = this.onClickCell; 
                   // function () { 
                   //     this.onClickCell(newDiv);
                   // }.bind(this);

               //   newDiv.ondblclick = onDblClickCell;
                }

                document.getElementById('shah').appendChild(newDiv);
            } //end for j
        } //end for i

}

Board.prototype.run = function() {
        this.createTable();
}

    //
    // Установка картинки в ячейку доски или в любой елемент el.
    //
 
Board.prototype.addImgToCell = function(srcImg, x, y, el) {
        var divTemp = {};

        if(el !== undefined) 
            divTemp = el;
        else 
            divTemp=document.getElementById(this._elem.id+'-'+x+y);
       
        var img = document.createElement('img');
        img.src = srcImg;
        img.width = this._sizeСell;
        img.heigth = this._sizeСell;

        img.id = 'img-'+this._elem.id+'-'+x+y;

        divTemp.appendChild(img);
        return img;
} 



function ChessBoard(elem,sizeСell,colorB,colorW) 
{
    this._cV = [8,7,6,5,4,3,2,1];
    this._cH = ['a','b','c','d','e','f','h','g'];
    

    Board.apply(this,[elem,sizeСell,colorB,colorW,this._cV,this._cH,true,true]);

    this.pos = {}; // объект состоящий из координат фигур на доске.
    this._sizeСell = sizeСell;
    this._colorB = colorB;
    this._colorW = colorW; 


    this._imgF = {
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
}

ChessBoard.prototype = Object.create(Board.prototype);
ChessBoard.prototype.constructor = ChessBoard;



ChessBoard.prototype.addImgToCell = function(N,x,y) { 
        var img = Board.prototype.addImgToCell.apply(this,[conf.pieceDir+this._imgF[N],x,y]);
        img.x1 = x;
        img.y1 = y;
        img.f = this._imgF[N];
        img.F = N;
        img.self = this;
        img.ondblclick = this.onDblClickCell;

}

ChessBoard.prototype.onDblClickCell = function() {
        this.self.DblClickCell(this);
}

 
ChessBoard.prototype.DblClickCell = function(tempImg) {

        var newDiv=document.createElement('div');
        var divTemp ={};
        newDiv.id="del-num-"+tempImg.x1+tempImg.y1;
        if(tempImg.F != (tempImg.F).toLowerCase()) {
            newDiv.setAttribute("class",this._elem.id+"-white");
            divTemp = document.getElementById(this._elem.id+'-white').appendChild(newDiv);
        } else {
            newDiv.setAttribute("class",this._elem.id+"-black");
            divTemp = document.getElementById(this._elem.id+'-black').appendChild(newDiv);  
        }

        tempImg.remove();
        var img =Board.prototype.addImgToCell.apply(this,[conf.pieceDir+tempImg.f,tempImg.x1,tempImg.y1,divTemp]);
        img.f=tempImg.f;
        img.x1 = tempImg.x1;
        img.y1= tempImg.y1;

        img.ondblclick = function() {
        
            var DivH=document.getElementById(this._elem.id+'-'+tempImg.x1+tempImg.y1 );
            var imgH=Board.prototype.addImgToCell.apply(this,[conf.pieceDir+tempImg.f,tempImg.x1,tempImg.y1,DivH]);
            newDiv.remove(); 
        }.bind(this);

}


ChessBoard.prototype.fenToObj = function(fen) {

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

ChessBoard.prototype.load = function (fen) {
       var pos = this._pos = this.fenToObj(fen);
       for(var key in pos) {
        var t = pos[key];
        this.addImgToCell(t,key.charAt(0),key.charAt(1));
       }
}

function Chess(elem, cB) {
    ChessBoard.apply(this,[elem,cB.sizeСell,cB.colorB,cB.colorW]);
}

Chess.prototype = Object.create(ChessBoard.prototype);
Chess.prototype.constructor = Chess;

Chess.prototype.run = function() { 
    ChessBoard.prototype.run.apply(this);
}

Chess.prototype.load = function(fen) { 
    ChessBoard.prototype.load.apply(this,[fen]);
}

