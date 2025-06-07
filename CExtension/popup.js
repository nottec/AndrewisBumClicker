
console.log("popup loaded");

//initialize
let count = 0;
let passivecount = 0;
let increment = 1;
let passivecost = 500;
let incrementcost = 100;
let passive = false;

updateCount()

const port = chrome.runtime.connect({name: "popup"});

port.onMessage.addListener((message) => {
  
  if(message.type === "changeupdate"){
  document.getElementById("timer").innerText = message.data
  }
  else{
  //load it baybeeeeeee
  loadData();
  }
})
//normal click
document.getElementById("clickButton").addEventListener("click", function() {
  count=count+increment;
  saveData();
  updateCount();
});

//reset game button
document.getElementById("resetButton").addEventListener("click", function() {
  reset();
});

//----------------------------------------------------------------------------------------------------------------------
//delete social media delete buy button
document.getElementById("sdelButton").addEventListener("click", function() {
  if(count>=incrementcost){
    buyincrement();
  }
  saveData();
  updateCount();
});

//actual buy social media delete process
function buyincrement(){
  count=count-incrementcost
  increment++;
  incrementcost = 100+(100*(increment-1));
  saveData()
  updateCount()
}

//---------------------------------------------------------------------------------------------------------------------
//volunteer gig buy button
document.getElementById("volunteerGigButton").addEventListener("click", function() {
  if(count>=passivecost){
    buypassive();
  }
  saveData();
  updateCount();
});

//actual buy volunteer gig process (also starts the passive counting)
function buypassive(){
  count=count-passivecost;
  passivecount++;
  passivecost = 500+(200*passivecount);
  passive=true;
  saveData()
  updateCount()
}

//---------------------------------------------------------------------------------------------------------------------
//updates values for all count displays
function updateCount() {
  document.getElementById("clickCount").innerText = count;
  document.getElementById("volunteerGigCount").innerText = passivecount;
  document.getElementById("volunteerGigButton").innerText = "Buy passive clicks: (" + passivecost + ")";
  document.getElementById("sdelButton").innerText = "Buy click increase: (" + incrementcost + ")";
  document.getElementById("sdelCount").innerText = increment-1;
} 

setInterval(updateCount, 1000);

setInterval(() => {
  if (passive) {
      count=count+passivecount;    
      chrome.storage.local.set({
        count
      })
  }
  else{
    console.log("not constantly adding passivecount or storing")
  }
},1000
)


//saves numbers
function saveData() {
  chrome.storage.local.set({
    count,
    passivecount,
    passivecost,
    incrementcost,
    increment,
    passive
  })
}

//function that loads numbers in when reopening extension
function loadData() {
  chrome.storage.local.get([
    'count',
    'passivecount',
    'passivecost',
    'incrementcost',
    'increment',
    'passive',
    'newcount'
  ], (data) => {
    passivecount = data.passivecount ?? 0;
    passivecost = data.passivecost ?? 500;
    incrementcost = data.incrementcost ?? 100;
    increment = data.increment ?? 1;
    passive = data.passive ?? false;
    if(passive){
    count = data.newcount??data.count??0
    }
    else{
    count=data.count??0
    }
    updateCount();
    if(passivecount>0){
      passive=true;
    }
  })
}

//reset function
function reset() {
  count = 0;
  passivecount = 0;
  increment = 1;
  incrementcost = 100;
  passivecost = 500;
  passive = false;
  newcount = 0;
  chrome.storage.local.set({
  startTime: Date.now()
  });
  document.getElementById("timer").innerText = 0;
  saveData();
  updateCount();
}


