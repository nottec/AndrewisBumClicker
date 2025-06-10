console.log("background is here")
let startTime;
let oldcount;
let change;
chrome.storage.local.get(['passive'], (data) => {
if(data.passive){
    console.log("Pre-Port Listener Up & Passive Count True")
}
else{
    console.log("Pre-Port Listener Up & Passive Count False")
}
});

chrome.runtime.onConnect.addListener((port) => {
    if (port.name==="popup") {
        console.log("bgside popupwindow open connect")
        chrome.storage.local.get(['startTime', 'passive','count','passivecount','passiveCountTwo','passiveCountThree'], (data) => {
            if(data.passive){
                console.log("passive count is true")
                const elapsedTime = Date.now() - (data.startTime??Date.now());
                const seconds = Math.floor((elapsedTime) / 1000);
                const oldcount = (data.count??0)
                const newcount = (data.count ?? 0) + (((data.passivecount ?? 0)+(data.passiveCountTwo??0)+(data.passiveCountThree??0))*seconds);
                console.log ((data.count??0) + "-->"+(newcount))
                chrome.storage.local.set({newcount})
                port.postMessage("data_ready")
                const change = newcount - oldcount;
                port.postMessage({type: "changeupdate", data: change});
            }
            port.postMessage("data_ready")
        });
        
    

        port.onDisconnect.addListener(() => {
            console.log("bgside popup disconnect; closed")
            chrome.storage.local.get(['passive'], (data) => {
                if(data.passive){
                    chrome.storage.local.set({
                        startTime: Date.now()
                    }); 
                }
            });  
        });
    }
})