const CLASS_LIST = {
    MODAL: 'modal',
    MODAL_ACTIVE: 'modal--active',
    TRIGGER_OPEN: 'form-link',
    TRIGGER_CLOSE: 'close',
};


const showScroll = (event) => {
    if (event.propertyName === 'transform') {
        document.body.style.paddingRight = '';
        document.body.style.overflow = 'visible';

        event.target.closest(`.${CLASS_LIST.MODAL}`).removeEventListener('transitionend', showScroll);
    }
}

document.addEventListener('click', (event) => {
    //open
    if (event.target.closest(`.${CLASS_LIST.TRIGGER_OPEN}`)) {
        console.log('open');
        event.preventDefault();

        const target = event.target.closest(`.${CLASS_LIST.TRIGGER_OPEN}`);
        const modalId = target.getAttribute('href').replace('#', '');
        const modal = document.getElementById(modalId);

        document.body.style.paddingRight = `${getScrollbarWidth()}px`;
        document.body.style.overflow = 'hidden';

        modal.classList.add(CLASS_LIST.MODAL_ACTIVE);
    }
    //close
    if (
        event.target.closest(`.${CLASS_LIST.TRIGGER_CLOSE}`)
        ||
        event.target.classList.contains(CLASS_LIST.MODAL_ACTIVE)
        ) {
        console.log('close');
        event.preventDefault();

        const modal = event.target.closest(`.${CLASS_LIST.MODAL}`);
        modal.classList.remove(CLASS_LIST.MODAL_ACTIVE);

        modal.addEventListener('transitionend', showScroll)

    }
})

const getScrollbarWidth = () => {
    const item = document.createElement('div');

    item.style.position = 'absolute';
    item.style.top = '-9999px';
    item.style.width = '50px';
    item.style.height = '50px';
    item.style.overflow = 'scroll';
    item.style.visibility = 'hidden';

    document.body.appendChild(item);
    const scrollBarWidth = item.offsetWidth - item.clientWidth;
    document.body.removeChild(item);

    return scrollBarWidth
    
}

//validation

const sendBtn = document.querySelector('send');

//sendBtn.preventDefault();

const regex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
const url = 'https://jsonplaceholder.typicode.com/todos'

const getResourse = async (url) => {
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const sortedData =  await data.filter(el => el.userId == 5 && el.completed == true)
        return sortedData
    }
    catch(e) {
        document.querySelector('.form').innerHTML = `<div>${e}</div>`
    }
    



}


document.querySelector('.send').onclick = (event) => {
    const form = document.querySelector('.form');
    const name = document.querySelector('.name');
    const phone = document.querySelector('.phone');
    const logo = document.querySelector('.form__logo');
    const btns = document.querySelector('.form__btns');
    const title = document.querySelector('.form__title');
    const descr = document.querySelector('.form__descr');
    const spanName = document.querySelector('.name__span');
    const spanPhone = document.querySelector('.phone__span');

    event.preventDefault();
    
    if(!validatePhone(regex, phone.value)) {
        notValide(phone, spanPhone, 'Неверный формат номера')
    }
    else {
        valide(phone, spanPhone, '')
    }

    if(!validateName(name.value)) {
        notValide(name, spanName, 'Имя должно содержать хотя бы 3 буквы')
    }
    else {
        valide(name, spanName, '')
    }

    if (validatePhone(regex, phone.value) && validateName(name.value)) {
        name.style.display = 'none';
        phone.style.display = 'none';
        logo.style.display = 'none';
        title.style.display = 'none';
        descr.style.display = 'none';
        btns.style.display = 'none';

        renderPosts(url);
    }


    async function renderPosts(url) {
        const posts = await getResourse(url);
        form.style.maxWidth = '1000px';
        document.querySelector('.form__headers').style.display = 'flex'
        console.log(posts);

        posts.map((post) => {
            form.insertAdjacentHTML('beforeend', 
            `<div class="posts__post">
                <div class="posts__user">${post.userId}</div>
                <div class="posts__id">${post.id}</div>
                <div class="posts__title">${post.title}</div>
                <div class="posts__completed">${post.completed}</div>
            </div>`)
        })
        

    }

    
    
    
}




function validatePhone(regex, phoneValue) {
    if (phoneValue === '') {
        return false
    }
    return regex.test(phoneValue)
}

function validateName(nameValue) {
        console.log(nameValue.length)
        return nameValue.trim().length > 3
    
}

function notValide(inp, el, mess) {
    inp.classList.add('is-valid');
    inp.classList.add('form__input--error');
    el.innerHTML = mess;
}

function valide(inp, el, mess) {
    inp.classList.remove('is-valid');
    inp.classList.remove('form__input--error');
    inp.classList.add('is-valid');
    el.innerHTML = mess;
}