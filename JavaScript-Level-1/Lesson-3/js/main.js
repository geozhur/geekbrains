// Шаблон для формирования анимации
var template = document.querySelector('[type^=application]').textContent;
var keyframeContainer;
var idFrame = 0; // для подсчета перемещений
var currentAnimationId = 1;

var arr = [];
var arr_old = [];
var arrLeft = []; //временный массив, для формирования анимации

///////////////////////////////////
//
// Случайное число 
//
///////////////////////////////////
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArray(len) {
    len = len || 10;
    for (var i = 0, arr = []; i < len; i++) {
        arr.push(getRandomInt(0, 100));
    }
    return arr;
}

//////////////////////////////////////////
//
// Добавляем div с числом и формируем для него id
//
//////////////////////////////////////////

function addDiv(num,index)
{
  var newDiv=document.createElement('div');
  newDiv.innerHTML=num;
  newDiv.id="num-"+index;
  newDiv.setAttribute("class","num");
  var l=index*50 + 10;
  newDiv.style.left=(index*60)+"px";
  document.getElementById('pole').appendChild(newDiv);
}

//////////////////////////////////////
//
//  Печатает несортированный массив чисел
//
//////////////////////////////////////


function RandomNumPrint(arr)
{

   var block;
   for(var i=0 ; i<10 ; i++)
   {
     if(document.getElementById('num-'+i))
     document.getElementById('num-'+i).remove();
      addDiv(arr[i],i);
      arrLeft[i]= i;
   }
}

///////////////////////////////////////
//
//  Скрипт формирования анимации
//
///////////////////////////////////////

function moveItem(arr,fromIndex, toIndex, upIndex)
{
  var block =  document.getElementById('num-'+arrLeft[fromIndex] );

  var animationId = 'bouncing-'+ (currentAnimationId ++);
  var generatedKeyframes = template;
  generatedKeyframes = generatedKeyframes.replace(/\{\{animationId\}\}/g,animationId);
  generatedKeyframes = generatedKeyframes.replace(/\{\{fromIndex\}\}/g,fromIndex*60  + 'px');
  generatedKeyframes = generatedKeyframes.replace(/\{\{toIndex\}\}/g,toIndex*60 + 'px');
  generatedKeyframes = generatedKeyframes.replace(/\{\{upIndex\}\}/g,upIndex*60 + 'px');
  
  keyframeContainer.textContent = keyframeContainer.textContent + generatedKeyframes;
  document.head.appendChild(keyframeContainer);
 
 var delay = idFrame * 1;
  if (block.style.animationName)
  {
     block.style.animationName +=','+ animationId;
     block.style.animationDelay += ','+ delay +'s';
  }
  else
  {
  block.style.animationName = animationId;
  block.style.animationDelay = delay + 's';
  }
 
  block.style.animationDuration ='1s';
  block.style.animationFillMode = "forwards";

}

///////////////////////////////////////////
//
//  Меняем местами два числа в div
//
///////////////////////////////////////////

function exchangeItem(arr, more,less) {
  moveItem(arr, more,less,1);
  moveItem(arr, less,more,-1);
  t=arrLeft[more];
  arrLeft[more]=arrLeft[less];
  arrLeft[less]=t;
  idFrame++;
}

/////////////////////////////////////////////////
//
// Алгоритм быстрой сортировки
//
/////////////////////////////////////////////////

// техническая функция для обмена числами элементами массива

function swap(data, i, j) {
    if (i!=j)
      exchangeItem(data,i,j);
    var tmp = data[i];
    data[i] = data[j];
    data[j] = tmp;
}


///////////////////////////////////////
//
// Агоритм быстрой сортировки
//
//////////////////////////////////////

function Partition(sort, p, r)
{
    var i = p - 1;
 
    for(var j=p; j<=r ;j++ )
    {
        if(sort[j] <= sort[r])
        {
          i++;
          swap(sort, i, j);
        }
    }
    return ( i<r ) ? i : i-1;
}

///////////////////////////////////////
//
// Основная функция вызова сортировки
//
//////////////////////////////////////


function QuickSort(sort, p, r)
{
        if( p < r )
        {
                var q = Partition(sort, p, r);
                QuickSort(sort, p, q);
                QuickSort(sort, q+1, r);
        }
}

/////////////////////////////////////////////
//
// Сортировка шелла
//
//////////////////////////////////////////////




function shellSort (sort) {
    var step = parseInt(sort.length / 2);

    while (step > 0)//пока шаг не 0
    {
      for (var i = 0; i < sort.length - step; i++)
      {
          var j = i;
          //будем идти начиная с i-го элемента
          while (j >= 0 && sort[j] > sort[j + step])
          {
              swap(sort, j, j + step);
              j-=1; 
          }
      }
      step = parseInt(step / 2);//уменьшаем шаг
    }  
}



/////////////////////////////////////////////
//
// Пиромидальная сортировка
//
/////////////////////////////////////////////
 

function siftDown(sort, root, bottom) {
  var maxChild, temp;
  var done = 0;
  while ((root*2 <= bottom) && (!done)) {
    
    if (root*2 == bottom) {
      maxChild = root * 2;
    }
    else if (sort[root * 2] > sort[root * 2 + 1]) {
      maxChild = root * 2;
    }
    else {
      maxChild = root * 2 + 1;
    }

    if (sort[root] < sort[maxChild]) {

      swap(sort, root, maxChild) ;

      root = maxChild;
    }  else
      done = 1;
  }
}


function heapSort(sort) {
  
  var temp;

  // построение дерева
  for (var i = arr.length/2 - 1; i >= 0; i--)
  {
    siftDown(sort, i, arr.length);
  }

  for (var i = arr.length - 1; i >= 1; i--) {
    swap(sort, 0, i) ;
    siftDown(sort, 0, i-1);
  }
}


function animSort1() {
   idFrame = 0; // для подсчета перемещений
   currentAnimationId = 1;
   keyframeContainer = document.createElement('style');
   RandomNumPrint(arr);
   heapSort(arr);
}

function animSort2() {
   idFrame = 0; // для подсчета перемещений
   currentAnimationId = 1;
   keyframeContainer = document.createElement('style');
   RandomNumPrint(arr);
   QuickSort(arr, 0, 9);
 }

function animSort3() {
   idFrame = 0; // для подсчета перемещений
   currentAnimationId = 1;
   keyframeContainer = document.createElement('style');
   RandomNumPrint(arr);
   shellSort(arr);
 }

// Возвращение несортированного массива.

function animSort4() {
  arr = arr_old.slice(); 
  RandomNumPrint(arr);
}

// Создать новый несортированный массив.

function animSort5() {
  arr=getRandomArray();
  arr_old = arr.slice(); 
  RandomNumPrint(arr);
}