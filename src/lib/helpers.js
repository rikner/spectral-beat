// tslint:disable:no-console

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function toggleFullScreen() {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen = docEl.requestFullscreen 
        || docEl.mozRequestFullScreen 
        || docEl.webkitRequestFullScreen 
        || docEl.msRequestFullscreen;
        
    const cancelFullScreen = doc.exitFullscreen 
        || doc.mozCancelFullScreen 
        || doc.webkitExitFullscreen 
        || doc.msExitFullscreen;

    const fullscreenElement = doc.fullscreenElement 
        || doc.mozFullScreenElement 
        || doc.webkitFullscreenElement 
        || doc.msFullscreenElement

    if (!fullscreenElement) {
        if (requestFullScreen) {
            requestFullScreen.call(docEl);
        }
    } else {
        if (cancelFullScreen) {
            cancelFullScreen.call(document);
        }
    }
}
