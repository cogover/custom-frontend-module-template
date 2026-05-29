export function checkMobileDevice() {
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth < 1367;
}
