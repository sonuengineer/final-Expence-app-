const form = document.getElementById('login')

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const obj = {
        email: email.value,
        password: password.value
    }

    email.value = ''
    password.value = ''
    axios.post('http://localhost:3000/user/login', obj)
        .then(res => {
            localStorage.setItem('token', `${res.data.token}`)
            localStorage.setItem('rows', 5)
            alert(res.data.message)
           
        })
        .catch(err => {
            console.log(err)
            alert(err.response.data.message)
        })
})