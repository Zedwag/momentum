// DOM Elements
const
    locationBtn = document.querySelector('.weather__location'),
    city = document.querySelector('.weather__city'),
    weatherImage = document.querySelector('.weather__image'),
    weatherParameters = document.querySelector('.weather__parameters'),
    time = document.querySelector('.time'),
    date = document.querySelector('.date'),
    greeting = document.querySelector('.greeting__text'),
    name = document.querySelector('.greeting__name'),
    focus = document.querySelector('.focus__value'),
    joke = document.querySelector('.joke__text'),
    jokeBig = document.querySelector('.joke__bigText'),
    jokeBtn = document.querySelector('.joke__refresh')
    leftArrowBtn = document.querySelector('.left-arrow'),
    rightArrowBtn = document.querySelector('.right-arrow')

//Global constants
const mounths = [
    'Января',
    'Февраля',
    'Марта',
    'Апреля',
    'Мая',
    'Июня',
    'Июля',
    'Августа',
    'Сентября',
    'Октября',
    'Ноября',
    'Декабря',
]

const days = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
]

// Global vars
let jokes = []
let hourForBackground
let inputWidthMultiplayer = 1.2
let bgLinksArray = []

// Show Time
function showTime() {
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds(),
        day = today.getDate(),
        month = today.getMonth(),
        dayOfWeek = today.getDay()

    // Output Time
    time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`
    date.innerHTML = `${addZero(day)}<span> </span>${mounths[month]}<span>, </span>${days[dayOfWeek]}`

    if (!hourForBackground) hourForBackground = addZero(hour)

    if (min == 0 && sec == 0) {
        hourForBackground = addZero(hour)
        setBgGreet()
    }

    setTimeout(showTime, 1000);
}

async function getWeather(url) {
    try{
        url='https://cors-anywhere.herokuapp.com/'+url
        const res = await fetch(url)
        const resJson = await res.json()
        if (resJson.cod === 200) {
            let { name, main: { temp, humidity }, wind: { speed }, weather } = resJson
            city.value = name
            city.style.width = (city.value.length * inputWidthMultiplayer) + 'rem'
            switch (weather[0].id.toString()[0]) {
                case '2':
                    weatherImage.src = './img/svg/storm.svg'
                    break
                case '3':
                case '5':
                    weatherImage.src = './img/svg/cloud.svg'
                    break
                case '6':
                    weatherImage.src = './img/svg/snow.svg'
                    break
                case '7':
                case '8':
                    weatherImage.src = './img/svg/clouds-and-sun.svg'
                    break
                default:
                    weatherImage.src = './img/svg/umbrella.svg'
                    break
            }
            weatherParameters.innerHTML = ` ${Math.round(temp)} &#8451, ${humidity} %, ${Math.round(speed)} м/с `
            localStorage.setItem('aokozlovskiy-city', resJson.name)
            city.blur()
        } else {
            weatherImage.src = './img/svg/umbrella.svg'
            weatherParameters.innerHTML = ` город не найден `
        }
    }catch(error){
        console.log(error)
    }
}

async function getWeatherByLocation() {
    navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=b64587c49ce385e9c3b1b3f704417998&units=metric&lang=ru`
        await getWeather(url)
    }, error => console.log(error), { enableHighAccuracy: false, timeout: 30000, maximumAge: 60000 })
}

async function getWeatherByCity() {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=b64587c49ce385e9c3b1b3f704417998&units=metric&lang=ru`
    await getWeather(url)
}

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

// Set Background and Greeting
function setBgGreet() {
    let hour
    let today
    if (!hourForBackground) {
        today = new Date()
        hour = addZero(today.getHours())
    } else hour = hourForBackground
    const path = bgLinksArray[+hour]
    //document.body.style.backgroundImage = "url('"+path+"')";
    const img = document.createElement('img');
    img.src = path;
    img.onload = () => {
        document.body.style.backgroundImage = `url(${path})`;
    };

    today = new Date()
    hour = today.getHours()

    if (hour < 6) {
        greeting.textContent = 'Доброй ночи, '
    } else if (hour < 12) {
        greeting.textContent = 'Доброе утро, '
    } else if (hour < 18) {
        greeting.textContent = 'Добрый день, '
    } else {
        greeting.textContent = 'Добрый вечер, '
    }
}

// Get Name
function getName() {
    if (localStorage.getItem('aokozlovskiy-name') === null) {
        name.value = '[Введите имя]'
        localStorage.setItem('aokozlovskiy-name', '[Введите имя]')
    } else {
        name.value = localStorage.getItem('aokozlovskiy-name')
    }
    name.style.width = (name.value.length * inputWidthMultiplayer) + 'rem'
}

// Set Name
function setName(e) {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            name.blur();
        }
    } else if (e.type === 'blur') {
        if (name.value.trim() === '') {
            name.value = localStorage.getItem('aokozlovskiy-name')
            name.style.width = (name.value.length * inputWidthMultiplayer) + 'rem'
            return
        }
        localStorage.setItem('aokozlovskiy-name', name.value)
        name.style.width = (name.value.length * inputWidthMultiplayer) + 'rem'
    } else if (e.type === 'focus') {
        name.value = ''
    }
}

// Get Focus
function getFocus() {
    if (localStorage.getItem('aokozlovskiy-focus') === null) {
        focus.value = '[Введите цели]'
        localStorage.setItem('aokozlovskiy-focus', '[Введите цели]')
    } else {
        focus.value = localStorage.getItem('aokozlovskiy-focus')
    }
    focus.style.width = (focus.value.length * inputWidthMultiplayer) + 'rem'
}

// Set Focus
function setFocus(e) {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            focus.blur();
        }
    } else if (e.type === 'blur') {
        if (focus.value.trim() === '') {
            focus.value = localStorage.getItem('aokozlovskiy-focus')
            focus.style.width = (focus.value.length * inputWidthMultiplayer) + 'rem'
            return
        }
        localStorage.setItem('aokozlovskiy-focus', focus.value)
        focus.style.width = (focus.value.length * inputWidthMultiplayer) + 'rem'
    } else if (e.type === 'focus') {
        focus.value = ''
    }
}

// Get City
function getCity() {
    if (localStorage.getItem('aokozlovskiy-city') === null) {
        city.value = '[Введите город]'
        localStorage.setItem('aokozlovskiy-city', '[Введите город]')
    } else {
        city.value = localStorage.getItem('aokozlovskiy-city')
        getWeatherByCity()
    }
    city.style.width = (city.value.length * inputWidthMultiplayer) + 'rem'
}

// Set City
function setCity(e) {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            city.blur();
        }
    } else if (e.type === 'blur') {
        if (city.value.trim() === '') {
            city.value = localStorage.getItem('aokozlovskiy-city')
            city.style.width = (city.value.length * inputWidthMultiplayer) + 'rem'
            return
        }
        let fixCity = city.value.toLowerCase()
        fixCity = fixCity[0].toUpperCase() + fixCity.slice(1)
        city.value = fixCity
        localStorage.setItem('aokozlovskiy-city', city.value)
        city.style.width = (city.value.length * inputWidthMultiplayer) + 'rem'
        getWeatherByCity()
    } else if (e.type === 'focus') {
        city.value = ''
    }
}

function refreshJoke() {
    let text = ''
    if (jokes.length) text = jokes[Math.floor(Math.random() * jokes.length)]
    if (text.length < 200) {
        joke.style.display = 'none'
        jokeBig.style.display = 'flex'
        jokeBig.innerHTML = text
    } else {
        jokeBig.style.display = 'none'
        joke.style.display = 'flex'
        joke.innerHTML = text
    }
}

async function getJokes() {
    if (jokes.length !== 0) return
    try{
        const res = await fetch('https://cors-anywhere.herokuapp.com/http://umorili.herokuapp.com/api/get?name=new+anekdot')
        const jokesJson = await res.json()
        jokesJson.forEach(joke => jokes.push(joke.elementPureHtml))
        refreshJoke()
    }catch(error){
        console.log(error)
    }
}

function setWidthMultiplayer() {
    const width = document.body.clientWidth
    if (width > 1600) inputWidthMultiplayer = 2.5
    else if (width < 700 && width > 500) inputWidthMultiplayer = 0.5
    else if (width < 500) inputWidthMultiplayer = 0.2
}

function addImagesFromFolder(folderName) {
    let amount = 0
    while (amount < 6) {
        const rnd = Math.floor(Math.random() * 18) + 1
        const url = `https://github.com/Zedwag/background/blob/master//background/${folderName}/${rnd}.jpg?raw=true`
        if (!bgLinksArray.includes(url)) {
            bgLinksArray.push(url)
            amount++
        }
    }
}

function makeAlert() {
    if (localStorage.getItem('aokozlovskiy-alert') === null) {
        alert('Приветсвую Вас в приложении momentum!\nДля отображения прогноза погоды можно ввести город в поле для ввода, либо воспользоваться кнопкой для определения местоположения.\nДля переключения фонового изображения используются кнопки, которые расположены по бокам экрана и становятся видимыми при наведении курсора.\nИз-за большого количества и веса фоновых изображений, я решил не хранить их локально, так что смена фона происходит не мгновенно.\nСпасибо за внимание!')
        localStorage.setItem('aokozlovskiy-alert', 'true')
    }
}

function generateBackgrounds() {
    addImagesFromFolder('night')
    addImagesFromFolder('morning')
    addImagesFromFolder('day')
    addImagesFromFolder('evening')
}

locationBtn.addEventListener('click', getWeatherByLocation)
city.addEventListener('keypress', setCity)
city.addEventListener('blur', setCity)
city.addEventListener('focus', setCity)
name.addEventListener('keypress', setName)
name.addEventListener('blur', setName)
name.addEventListener('focus', setName)
focus.addEventListener('keypress', setFocus)
focus.addEventListener('blur', setFocus)
focus.addEventListener('focus', setFocus)
jokeBtn.addEventListener('click', () => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = './sound.mp3';
    audio.play();
    refreshJoke()
})
leftArrowBtn.addEventListener('click', () => {
    if (parseInt(hourForBackground) > 0) hourForBackground = addZero(+hourForBackground-1)
    else hourForBackground = '23'
    setBgGreet()
    leftArrowBtn.disabled = true
    setTimeout(() => { leftArrowBtn.disabled = false }, 1000)
})
rightArrowBtn.addEventListener('click', () => {
    if (parseInt(hourForBackground) < 23) hourForBackground = addZero(+hourForBackground+1)
    else hourForBackground = '00'
    setBgGreet()
    rightArrowBtn.disabled = true
    setTimeout(() => { rightArrowBtn.disabled = false }, 1000)
})

// Run
showTime()
setWidthMultiplayer()
generateBackgrounds()
setBgGreet()
getName()
getFocus()
getCity()
getJokes()
makeAlert()
