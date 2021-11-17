let selectedActorsList = []
let actorsList = []
const root = document.getElementById('root')
const map = new Map()
map.set('facebook', 'fa-twitter')
map.set('instagram', 'fa-facebook-f')
map.set('twitter', 'fa-instagram')


const getData = async () => {
    try {
        const data = await fetch('./data.json');
        return await data.json();
    } catch (e) {
        console.log(e);
        return [];
    }
}

function renderSelectedActors() {
    const chosen_actors_list = document.getElementById('chosen-actors')
    if (!chosen_actors_list) {
        return;
    }
    chosen_actors_list.innerText = selectedActorsList
        .map(actor_id => getActorNameById(actor_id))
        .join(', ');
}

function toggleActor() {
    const id = +this?.dataset?.actor_id;
    if (!id) {
        return;
    }
    if (selectedActorsList.indexOf(id) === -1) {
        selectedActorsList.push(id);
        this.classList.add('selected')
    } else {
        selectedActorsList = selectedActorsList.filter((idActor) => {
            return +idActor !== +id;
        });
        this.classList.remove('selected')
    }
    renderSelectedActors()
}

function getActorNameById(id) {
    const actor = actorsList.find((actor) => {
        if (+actor.id === +id) {
            return actor;
        }
    })
    if (actor) {
        const {firstName, lastName} = actor
        return `${firstName} ${lastName}`;
    }
}

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

function createStructure() {
    const title = createElement('p', {
        classNames: ['textColor']
    }, 'ACTORS');
    root.append(title)
    const cards = [];
    for (let i = 0; i < actorsList.length; i++) {
        cards.push(createElement(actorsList[i]));
    }
}

// <div className="card" data-actor_id="1">
//     <div className="img-block">
//         <img
//             src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Dwayne_Johnson_2%2C_2013.jpg/800px-Dwayne_Johnson_2%2C_2013.jpg"
//             alt="#">
//     </div>
//     <p className="p-style">Scarlett Johansson</p>
//     <div className="icons">
//         <a href="#" target="_blank" className="icon-box">
//             <i className="white-icon fab fa-brands fa-twitter"></i>
//         </a>
//         <a href="#" target="_blank" className="icon-box">
//             <i className="white-icon fab fa-brands fa-facebook-f"></i>
//         </a>
//         <a href="#" target="_blank" className="icon-box">
//             <i className="white-icon fab fa-brands fa-instagram"></i>
//         </a>
//     </div>
// </div>

function createCardElem(actor) {
const {
    id = 'no_id',
    firstName = 'no_name',
    lastName = 'no_last_name',
    profilePicture = null,
    contacts = [],
} = actor;



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

(_ => {
    getData().then(data => {
        actorsList = data;
        [...document.querySelectorAll('.card')].forEach(el => {
            el.addEventListener('click', toggleActor)
        })
    })

})()





