const getData = async () => {
    try {
        const data = await fetch('./data.json');
        return await data.json();
    } catch (e) {
        console.log(e);
        return [];
    }
}


const root = document.getElementById('root')
const map = new Map()

map.set('facebook', 'fa-twitter')
map.set('instagram', 'fa-facebook-f')
map.set('twitter', 'fa-instagram')

function f(url) {
    if (map.has(fit(url))) {
        return map.get(fit(url));
    }
    return false
}

function createElement(type = 'div', {attributes = {}, classNames = [], events = {}}, ...chidren) {
    const elem = document.createElement(type);
    for (const [attrName, attrValue] of Object.entries(attributes)) {
        elem.setAttribute(attrName, attrValue)
    }
    for (const [eventType, eventHandler] of Object.entries(events)) {
        elem.addEventListener(eventType, eventHandler)
    }
    elem.classList.add(...classNames);
    elem.append(...chidren);
    return elem
}

function fit(url) {
    let urlObj = new URL(url);
    urlObj = urlObj.host.split('.')
    for (let i = 0; i < urlObj.length; i++) {
        if (urlObj[i] === 'facebook' || urlObj[i] === 'instagram' || urlObj[i] === 'twitter') {
            return urlObj[i]
        }
    }
    return urlObj.host
}

getData().then(data => {
    console.log({data});


})

