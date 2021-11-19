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

function getClassForSocialIcon(url) {
    if (map.has(getKeywordFromLink(url))) {
        return map.get(getKeywordFromLink(url));
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
        classNames: ['text-color']
    }, 'ACTORS');
    root.append(title)
    const cards = [];
    for (let i = 0; i < actorsList.length; i++) {
        cards.push(createCardElem(actorsList[i]));
    }
    const cardWrapper = createElement('div', {classNames: ['card-block']}, ...cards)
    root.append(cardWrapper)
    const selectedActorsWrapper = createElement('p',
        {
            attributes: {
                id: 'chosen-actors'
            },
            classNames: ['text-color']
        }, 'you choosed')
    const parentSelectedActorsWrapper = createElement('div',
        {
            classNames: ['list']
        }, selectedActorsWrapper)
    root.append(parentSelectedActorsWrapper)
}

function createCardElem(actor) {
    const {
        id = 'no_id',
        firstName = 'no_name',
        lastName = 'no_last_name',
        profilePicture = null,
        contacts = [],
    } = actor;
    const avatar = createCardImgBlock({profilePicture, firstName, lastName});
    const title = createElement('p', {
        classNames: ['p-style']
    }, `${firstName} ${lastName}`);
    const contactsBlock = createContactsBlock(contacts);
    return createElement('div', {
        attributes: {'data-actor_id': id},
        classNames: ['card'],
        events: {
            click: toggleActor
        }
    }, avatar, title, contactsBlock);
}

function createContactsBlock(arrContacts) {
    const arrIcons = [];
    const icon_classes = ['white-icon', 'fab', 'fa-brands'];
    for (let i = 0; i < arrContacts.length; i++) {
        const link = arrContacts[i];
        const iconClass = [getClassForSocialIcon(link)];
        const classes = icon_classes.concat(iconClass);
        const icon_i = createElement('i', {
            attributes: {
                'aria-hidden': 'true'
            },
            classNames: classes
        });
        const icon_elem = createElement('a', {
            classNames: ['icon-box'],
            attributes: {
                href: link,
                target: '_blank'
            }
        }, icon_i);
        arrIcons.push(icon_elem);
    }

    return createElement('div', {
        classNames: ['icons']
    }, ...arrIcons);
}

function createCardImgBlock({profilePicture, firstName, lastName}) {
    console.log({profilePicture, firstName, lastName})
    const imgElem = createElement('img', {
        attributes: {
            src: profilePicture,
            alt: `${firstName} ${lastName}`
        }
    });
    return createElement('div', {
        classNames: ['img-block']
    }, imgElem);
}

function getKeywordFromLink(url) {
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
        createStructure()
    })
})()