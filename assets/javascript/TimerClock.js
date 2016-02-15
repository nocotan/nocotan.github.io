function fig(num) {
    var ret;
    if(num < 10) {ret = "0" + num;}
    else {ret = num;}
    return ret;
}
function TimerClock() {
    var time = new Date();
    var hour = fig(time.getHours());
    var min = fig(time.getMinutes());
    var sec = fig(time.getSeconds());
    document.getElementById("TimerClock").innerHTML = hour + ":" + min + ":" + sec;
}
setInterval('TimerClock()', 1000);