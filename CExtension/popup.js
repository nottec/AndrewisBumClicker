
console.log("Popup JS loaded!");

//initialize
let count = 0;
let vgcount = 0;
let vgtimer;
let increment = 1;
let vgcost = 500;
let sdelcost = 100;

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

//actual buy volunteer gig process
function buyvg(){
  count=count-vgcost;
  vgcount++;
  vgcost = 500+200*vgcount;
  startvgtimer()
  saveData()
  updateCount()
}

//starts timer for gradual increase in clicks
function startvgtimer(){
  if(!vgtimer){
    vgtimer = setInterval(function(){
      count=count+vgcount
      saveData()
      updateCount()
    },1000)
  }
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
  
//saves numbers
function saveData() {
  chrome.storage.local.set({
    count,
    vgcount,
    vgcost,
    sdelcost,
    increment
  })
}

//loads numbers in when reopening extension
function loadData() {
  chrome.storage.local.get([
    'count',
    'vgcount',
    'vgcost',
    'sdelcost',
    'increment'
  ], (data) => {
    count = data.count ?? 0;
    vgcount = data.vgcount ?? 0;
    vgcost = data.vgcost ?? 0;
    sdelcost = data.sdelcost ?? 0;
    increment = data.increment ?? 1;
    updateCount();
    if(vgcount>0){
      startvgtimer()
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
  saveData();
  updateCount();
}

//calls the load data function
loadData();
  




