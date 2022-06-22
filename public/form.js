const form = [...document.querySelector('.form').children]

form.forEach((item, i) => {
    setTimeout(() => {
        item.style.opacity = 1;
    }, i*100)
})

// form validation

const nickname = document.querySelector('.name') || null;
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const submitBtn = document.querySelector('.submit-btn');

if(nickname == null){
    submitBtn.addEventListener('click', () => {
        fetch('api/auth/login', {
            method: 'post',
            headers: new Headers({'Content-Type' : 'application/json'}),
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.nickname) {
                alert('login successful')
            } else{
                alert(data)
            }
        })
    })
} else {
    submitBtn.addEventListener('click', () => {
        fetch('/api/users/register', {
            method: 'post',
            headers: new Headers({'Content-Type' : 'application/json'}),
            body: JSON.stringify({
                nickname: nickname.value,
                email: email.value,
                password: password.value
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.nickname) {
                alert('register successful')
            } else{
                alert(data)
            }
        })
    })
}