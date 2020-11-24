const colors = ['#d59bf6','#fc5185','#fcbad3','#8785a2','#fefdca','#3fc1c9'];
let index = 0;
const item = document.getElementById('first-item');

item.onload = colorInterval();

function colorInterval(){
  let clear = setInterval(changeColor, 2000);
}

function changeColor(){
  item.style.color = colors[index];
  if(index == colors.length-1) {
    index = 0;
  }else{
    index++;
  }
}
