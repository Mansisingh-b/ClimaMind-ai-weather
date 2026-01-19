const GEO = "https://geocoding-api.open-meteo.com/v1/search";
const WEA = "https://api.open-meteo.com/v1/forecast";

const city = document.getElementById("city");
const place = document.getElementById("place");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const status = document.getElementById("dayStatus");
const clock = document.getElementById("clock");
const dateEl = document.getElementById("date");
const body = document.body;
const card = document.getElementById("card");

let timer;

city.addEventListener("keypress", e => {
 if (e.key === "Enter") load(city.value);
});

const map = {
 0:"Clear Sky",
 1:"Mainly Clear",
 2:"Partly Cloudy",
 3:"Overcast",
 61:"Rain",
 63:"Heavy Rain",
 71:"Snow",
 95:"Thunderstorm"
};

async function load(name){
 if(!name) return;
 desc.innerText="Loading...";

 try{
  const g = await fetch(`${GEO}?name=${name}&count=1`);
  const gd = await g.json();
  const { latitude, longitude, name:cityName, country } = gd.results[0];

  const w = await fetch(`${WEA}?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
  const wd = await w.json();

  update(cityName, country, wd.current_weather, wd.timezone);
 }catch{
  desc.innerText="City not found";
 }
}

function update(c, country, data, tz){
 place.innerText = `${c}, ${country}`;
 temp.innerText = Math.round(data.temperature) + "°";
 desc.innerText = map[data.weathercode] || "Variable";

 body.classList.toggle("is-night", data.is_day === 0);
 status.innerText = data.is_day ? "Day" : "Night";

 card.classList.add("fade");
 setTimeout(()=>card.classList.remove("fade"),600);

 startClock(tz);
}

function startClock(tz){
 clearInterval(timer);
 timer = setInterval(()=>{
  const now = new Date(
   new Date().toLocaleString("en-US",{ timeZone: tz })
  );

  clock.innerText = now.toLocaleTimeString();
  dateEl.innerText = now.toLocaleDateString("en-GB",{
   day:"2-digit",
   month:"long",
   year:"numeric"
  });
 },1000);
}

load("Mumbai");
