
console.log("popup loaded");

//initialize
let count = 0;
let vgcount = 0;
let increment = 1;
let vgcost = 500;
let sdelcost = 100;
let passivecount = false;



const port = chrome.runtime.connect({name: "popup"});

port.onMessage.addListener(() => {
  //load it baybeeeeeee
  loadData();
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
  if(count>=sdelcost){
    buysdel();
  }
  saveData();
  updateCount();
});

//actual buy social media delete process
function buysdel(){
  count=count-sdelcost
  increment++;
  sdelcost = 100+(100*(increment-1));
  saveData()
  updateCount()
}

//---------------------------------------------------------------------------------------------------------------------
//volunteer gig buy button
document.getElementById("volunteerGigButton").addEventListener("click", function() {
  if(count>=vgcost){
    buyvg();
  }
  saveData();
  updateCount();
});

//actual buy volunteer gig process (also starts the passive counting)
function buyvg(){
  count=count-vgcost;
  vgcount++;
  vgcost = 500+(200*vgcount);
  passivecount=true;
  saveData()
  updateCount()
}

//---------------------------------------------------------------------------------------------------------------------
//updates values for all count displays
function updateCount() {
  document.getElementById("clickCount").innerText = count;
  document.getElementById("volunteerGigCount").innerText = vgcount;
  document.getElementById("volunteerGigButton").innerText = "Buy volunteering gig: (" + vgcost + ")";
  document.getElementById("sdelButton").innerText = "Buy delete a social media app: (" + sdelcost + ")";
  document.getElementById("sdelCount").innerText = increment-1;
} 

setInterval(updateCount, 1000);

setInterval(() => {
  if (passivecount) {
      count=count+vgcount;    
      chrome.storage.local.set({
        count
      })
  }
},1000
)


//saves numbers
function saveData() {
  chrome.storage.local.set({
    count,
    vgcount,
    vgcost,
    sdelcost,
    increment,
    passivecount
  })
}

//function that loads numbers in when reopening extension
function loadData() {
  chrome.storage.local.get([
    'count',
    'vgcount',
    'vgcost',
    'sdelcost',
    'increment',
    'passivecount',
    'newcount'
  ], (data) => {
    vgcount = data.vgcount ?? 0;
    vgcost = data.vgcost ?? 500;
    sdelcost = data.sdelcost ?? 100;
    increment = data.increment ?? 1;
    passivecount = data.passivecount ?? false;
    count = data.newcount??data.count??0
    updateCount();
    if(vgcount>0){
      passivecount=true;
    }
  })
}

//reset function
function reset() {
  count = 0;
  vgcount = 0;
  increment = 1;
  sdelcost = 100;
  vgcost = 500;
  passivecount = false;
  chrome.storage.local.set({
  startTime: Date.now()
  });
  saveData();
  updateCount();
}


