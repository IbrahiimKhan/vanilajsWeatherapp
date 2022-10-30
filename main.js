
const storage={
    cityName:"",
    saveData(){
        localStorage.setItem("weatherdata_city",this.cityName)
    },
    //getting data
    getItem(){
       const city=  localStorage.getItem("weatherdata_city",this.cityName)
        return city 
    }
    
}
const weatherData = {
    cityName :"",
    apiKey : `2188ced232a4292e9ffc14bc8a177bb8`,
    async getWeatherData(){
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&units=metric&appid=${this.apiKey}`)
        if (res.status == 404) {
            UI.errorMsg("Please provide correct city name")
            return
        }
     
        const data = await res.json()
        return data
    
    },
}

const UI = {

    loadSelector(){
        const heroImg = document.querySelector(".main_img")
const input = document.querySelector("#input_city")
const submit_button = document.querySelector(".submit_button")
const main_temp = document.querySelector(".main_temp")
const date = document.querySelector(".date")
const left_cloud_img = document.querySelector(".left_cloud")
const left_cloud_text = document.querySelector(".left_p1")
const left_rain_img = document.querySelector(".left_rain")
const left_rain_text = document.querySelector(".left_rain_p1")
const left_location = document.querySelector(".location_left_side")

const uv = document.querySelector(".uv_index")
const winds = document.querySelector(".wind")
const sunrice = document.querySelector(".sunrice")
const sunsets = document.querySelector(".sunset")
const humdity = document.querySelector(".humidity")
const visbility = document.querySelector(".visibility")
const aiir = document.querySelector(".air")
const form = document.querySelector("form")
const msgHolder = document.querySelector(".msgHolder")
const hum_qual = document.querySelector(".hum_qual")
const aaaj = document.querySelector(".aaaj")
const vis_quality = document.querySelector(".vis_quality")
const air_quality = document.querySelector(".air_quality")
const sohor =document.querySelector(".sohor")
return{
    heroImg,
    input,
    submit_button,
    main_temp,
    date,
    left_cloud_img,
    left_cloud_text,
    left_rain_img,
    left_rain_text,
    uv,
    winds,
    sunrice,
    sunsets,
    humdity,
    visbility,
    aiir,
    left_location,
    form,
    msgHolder,
    hum_qual,
    aaaj,
    vis_quality,
    air_quality,
    sohor

}
},
removeMsg(){
    setTimeout(() => {
        msg.remove()
    }, 2000);
},
errorMsg(msg){
    const{msgHolder}= this.loadSelector()
    const message = ` <strong  class="text-danger" id="msg">${msg}</strong>`
    msgHolder.innerHTML = message
    //remove error message
    const removeIt = this.removeMsg()
    

},
validTheInput(userInput){
    if (!userInput) {
       //show error message
      const msg =   this.errorMsg("Please write a city name accurately")
      return true
    }
    else{
        return false
    }
},
inputData() {
    const {input} = this.loadSelector()
    //validating form
    let userVal = input.value
    const isInvalid = this.validTheInput(userVal)
    console.log(isInvalid)
    if (isInvalid)return
    return userVal
    
    
},
async handleRemoteData(){
   const api_data = await weatherData.getWeatherData()
   return api_data
},
getTime  (){
    let dateArray = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
   let time =  dateFns.format(new Date(),"hh:mm:ssa")
   let day = dateArray[dateFns.getDay(new Date())]//sunday
   return `<strong>${day}</strong>,${time}`
},
humidityQual(humidity){
    if (humidity>=30 && humidity<=50) {
        return " Good Quality"
    }
    if (humidity>=51 && humidity<=80) {
        return " Average"
    }
    else return " Bad Quality"
},
visibleQual(visiblity){
    if (visiblity>=4 && visiblity<=8) {
        return " Good Quality"
    }
    if (visiblity>=8 && visiblity<=10) {
        return " Average"
    }
    else return " Bad Quality"
},
airQual(air){
    if (air>=0 && air<=50) {
        return " Good Quality"
    }
    if (air>=51 && air<=100) {
        return " Average"
    }
    else return " Bad Quality"

},
populateToUI(dataFromApi){
    const{
        heroImg,
        main_temp,
        date,left_cloud_img,
        left_cloud_text,
        left_rain_img,
        left_rain_text,
        uv,
        winds,
        sunrice,
        sunsets,
        humdity,
        visbility,aiir,
        left_location,
        form,
        msgHolder,
        hum_qual,
        vis_quality,
        air_quality,
        sohor
    }=this.loadSelector()
    const {
    weather,
    main,
    visibility,
    wind:{speed,deg},
    clouds:{all},
    dt,
    sys:{sunrise,sunset,country},
    timezone,
    name} = dataFromApi

      //pushing textcontent to dom
    main_temp.innerHTML = `${Math.ceil(main.temp)}<sup>0</sup>c`
    setInterval(() => {
    date.innerHTML = this.getTime()
    }, 1000);

    sunrice.textContent = new Date(sunrise).toLocaleTimeString()
    sunsets.textContent = new Date(sunset).toLocaleTimeString()
    left_location.textContent = `${name} ${country}`
    winds.textContent = `${speed}`
    left_cloud_text.textContent = `${weather[0].description}`
    left_rain_text.textContent=`rain - ${all}%`
    visbility.textContent = `${Number(visibility)/1000}` 
    aiir.textContent = deg
    humdity.textContent = `${main.humidity}%`
    const humQuality = this.humidityQual(main.humidity)
    hum_qual.textContent= humQuality
    const visQuality = this.visibleQual(visibility/1000)
    vis_quality.textContent = visQuality
    const airQuality = this.airQual(deg)
    air_quality.textContent = airQuality
    sohor.textContent = name
    uv.textContent = main.temp_max
    left_cloud_img.setAttribute("src",
    `http://openweathermap.org/img/w/${weather[0].icon}.png`
    )
    // heroImg.setAttribute("src",
    // `http://openweathermap.org/img/w/${weather[0].icon}.png`
    // )
    

},
setDataToStorage(inputvalue){
    storage.cityName = inputvalue
},
init(){
    const {form} = this.loadSelector()
    const {aaaj} = this.loadSelector()
    form.addEventListener("submit",async(e)=>{
        //getting input from user
        e.preventDefault()
        const inputVal = this.inputData()
        //setting data to localstorage
        this.setDataToStorage(inputVal)
        //saving data 
        storage.saveData()
        weatherData.cityName = inputVal
        //send data to api server
        const dataFromApi =  await this.handleRemoteData()
         //populate to UI
         this.populateToUI(dataFromApi)
         //getting singel days data
         aaaj.addEventListener("click",()=>{
            this.populateToUI()
         })   
    })
    document.addEventListener("DOMContentLoaded",async()=>{
           let city =  storage.getItem()
           if(!city){
                city= "dhaka"
        }
           weatherData.cityName = city
           
          weatherData.getWeatherData()
          //send data to api server
        const dataFromApi =  await this.handleRemoteData()
        //populate to UI
        this.populateToUI(dataFromApi)
    })
    
}
}
UI.init()

