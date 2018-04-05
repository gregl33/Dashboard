function getTime(){


		var  time = new Date();
		var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		var Months = ["January","Febuary","March","April","May","June","July","August","September","October", "November","December"];



		window.spanClockH.textContent = check(time.getHours());
    window.spanClockM.textContent = check(time.getMinutes())
    window.spanTOdDate.textContent = days[time.getDay()]+" "+check(time.getDate())+" "+ Months[time.getMonth()];
    toggle_visibility('sepa');//.toggle('hidden');


}

getTime();

setInterval(getTime,750);


function check(time){
	return time<10 ? "0"+time : time;
}
function toggle_visibility(id) {
       var e = document.getElementById(id);
       if(e.style.visibility == 'visible')
          e.style.visibility = 'hidden';
       else
          e.style.visibility = 'visible';
    }
