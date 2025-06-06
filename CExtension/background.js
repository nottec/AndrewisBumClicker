console.log("background is here")
let startTime;
chrome.storage.local.get(['passivecount'], (data) => {
if(data.passivecount){
    console.log("Pre-Port Listener Up & Passive Count True")
}
});

chrome.runtime.onConnect.addListener((port) => {
    if (port.name==="popup") {
        console.log("bgside popupwindow open connect")
        chrome.storage.local.get(['startTime', 'passivecount','count','vgcount'], (data) => {
            if(data.passivecount){
                console.log("passive count is true")
                const elapsedTime = Date.now() - (data.startTime??Date.now());
                const seconds = Math.floor((elapsedTime) / 1000);
                const newcount = (data.count ?? 0) + ((data.vgcount ?? 0)*seconds);
                console.log ((data.count??0) + "-->"+(newcount))
                chrome.storage.local.set({newcount})
                port.postMessage("data_ready")
            }
        });

        port.onDisconnect.addListener(() => {
            console.log("bgside popup disconnect; closed")
            chrome.storage.local.set({
                startTime: Date.now()
            }); 
        });
    }
})


