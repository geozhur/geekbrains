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
     //target= document.getElementById('num-'+i );
     //target.style.animationName = '';
     //target.style.webkitAnimationName = '';
     // target.remove();
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

function Partition(A, p, r)
{
        var x = A[r];
        var i=p-1;
        for(var j=p; j<=r ;j++ )
        {
                if(A[j] <= x)
                {
                        i++;
                        var temp = A[i];
                        A[i] = A[j];
                        A[j] = temp;
                        if (i!=j)
                       exchangeItem(A,i,j);
                }
        }
        return i<r ?i : i-1;
}

///////////////////////////////////////
//
// Основная функция вызова сортировки
//
//////////////////////////////////////


function QuickSort(A, p, r)
{
        if(p<r)
        {
                var q = Partition(A, p, r);
                QuickSort(A, p, q);
                QuickSort(A, q+1, r);
        }
}

/////////////////////////////////////////////
//
// Сортировка шелла
//
//////////////////////////////////////////////




function shellSort (a) {
    for (var h = a.length; h = parseInt(h / 2);) {
        for (var i = h; i < a.length; i++) {

            var k = a[i];

            for (var j = i; j >= h && k < a[j - h]; j -= h)
            {
                a[j] = a[j - h];
                exchangeItem(a,j-h,j);
            }

            a[j] = k;
        }
    }
    return a;
}



/////////////////////////////////////////////
//
// Пиромидальная сортировка
//
//////////////////////////////////////////////

function swap(data, i, j) {
    exchangeItem(data,i,j);
    var tmp = data[i];
    data[i] = data[j];
    data[j] = tmp;
}
 
 function heap_sort(arr) {
    put_array_in_heap_order(arr);
    end = arr.length - 1;
    while(end > 0) {
        swap(arr, 0, end);
        sift_element_down_heap(arr, 0, end);
        end -= 1
    }
}
 
function put_array_in_heap_order(arr) {
    var i;
    i = arr.length / 2 - 1;
    i = Math.floor(i);
    while (i >= 0) {
        sift_element_down_heap(arr, i, arr.length);
        i -= 1;
    }
}
 
function sift_element_down_heap(heap, i, max) {
    var i_big, c1, c2;
    while(i < max) {
        i_big = i;
        c1 = 2*i + 1;
        c2 = c1 + 1;
        if (c1 < max && heap[c1] > heap[i_big])
            i_big = c1;
        if (c2 < max && heap[c2] > heap[i_big])
            i_big = c2;
        if (i_big == i) return;
        swap(heap,i, i_big);
        i = i_big;
    }
}

function animSort() {

     
  
   idFrame = 0; // для подсчета перемещений
   currentAnimationId = 1;
 // if (keyframeContainer)
  // keyframeContainer.remove();
   keyframeContainer = document.createElement('style');
   RandomNumPrint(arr);
 // QuickSort(arr, 0, 9);
  // shellSort(arr);
   
    heap_sort(arr);
   // exchangeItem(arr,5,1);
   // exchangeItem(arr,8,1);
}

function animSort1() {

     
  
   idFrame = 0; // для подсчета перемещений
   currentAnimationId = 1;
 // if (keyframeContainer)
  // keyframeContainer.remove();
   keyframeContainer = document.createElement('style');
   RandomNumPrint(arr);
 // QuickSort(arr, 0, 9);
  // shellSort(arr);
   
    heap_sort(arr);
   // exchangeItem(arr,5,1);
   // exchangeItem(arr,8,1);
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

function animSort4() {
  arr = arr_old.slice(); 
  RandomNumPrint(arr);
}

function animSort5() {
  arr=getRandomArray();
  arr_old = arr.slice(); 
  RandomNumPrint(arr);
}