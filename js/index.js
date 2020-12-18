process.env.TZ = 'Asia/Manila';
import Options from '../options.js';
import { DateTime } from 'luxon';
const user = new Options();

class AgeCounter{
    constructor(date){
        this.from = date.from;
        this.to = date.to;
    }
    count(){
        let day = 24*60*60*1000;    
        const year = new Date().getFullYear()%4===0 ? 366 : 365;  
        return ((this.to - Date.parse(this.from)) / day) / year;
    }
}

class LiveCount{
    constructor(element){
        this.element = element;
    }
    dateTime(config){
        let d = new Date();
        this.element.innerHTML = d.toLocaleString(config.lang, 
            { 
                dateStyle: config.dateStyle,
                hour: config.hour,
                minute: config.minute,
                hour12: config.hour12,
                timezone: config.timezone
            }
        )
    }
    dateInterval(from, to, decimalCount){
        this.element.innerHTML = new AgeCounter({from, to}).count().toFixed(decimalCount);
    }
}

const DOMElements = {
    age_container: document.querySelector('.age'),
    age_display: document.querySelector('.age-display'),
    search_btn: document.querySelector('#search'),
    search_box: document.querySelector('#search-input'),
    search: document.querySelector('#search-form'),
    nickname_container: document.querySelector('.nickname'),
    time: document.querySelector('.current-time'),
    date: document.querySelector('.current-date'),
    settings_btn: document.querySelector('#options-btn'),
    close_btn: document.querySelector('.close'),
    options_tab: document.querySelector('.options'),
    save_btn:document.querySelector('#save-btn'),
    name_input:  document.querySelector('#name-input'),
    nickname_input: document.querySelector('#nickname-input'),
    birthday_input: document.querySelector('#birthday-input')
}

const {
    nickname_container,
    age_container, 
    time, 
    date, 
    settings_btn, 
    close_btn, 
    options_tab, 
    save_btn,
    name_input,
    nickname_input,
    birthday_input,
    age_display
} = DOMElements;


settings_btn.addEventListener('click',()=>{
    settings_btn.style.transform = 'rotateZ(180deg)';
    options_tab.style.top = '0%';
})
close_btn.addEventListener('click',()=>{
    settings_btn.style.transform = 'rotateZ(0deg)';
    options_tab.style.top = '-100%';
})

save_btn.addEventListener('click',()=>{
    let birthday = DateTime.fromISO(birthday_input.value).toFormat('MM-dd-yyyy');
    let name = name_input.value;
    let nickname = nickname_input.value;
    user.setOptions({name,nickname,birthday});
    user.storeCookie();
}); 



const realTime = ()=>{
    const userBirthday = user.getCookie('birthday');

    setInterval(()=>{
        new LiveCount(time).dateTime({lang: 'en-US', hour: 'numeric', minute: 'numeric', hour12: true})
        new LiveCount(date).dateTime({lang: 'en-US', dateStyle: 'medium'})
    }, 100);
    
    if(userBirthday == undefined || userBirthday == 'Invalid date'){
        age_container.innerHTML = ';)';
        age_container.style.opacity = '.5';
        age_display.style.textAlign = 'center';
    }else{
        age_container.style.opacity = "1";
        age_display.style.textAlign = 'left';
        age_display.appendChild(document.createTextNode('yrs old'));

        setInterval(()=>{
            new LiveCount(age_container).dateInterval(userBirthday, new Date(),8)
        },100);
    }
}

window.addEventListener('load', ()=>{
    if(user.getCookie('nickname')==='undefined' || user.getCookie('nickname')==null){
        nickname_container.innerHTML = 'Druniverse';
    }else{
        nickname_container.innerHTML = `Welcome back, ${user.getCookie('nickname')}!`;
    }
    realTime();
})


