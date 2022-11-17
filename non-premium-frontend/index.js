function notifyUser(message) {
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}</h4>`;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 2500)
}

const form = document.getElementById('expense')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const amount = document.getElementById('amount')
    const description = document.getElementById('description')
    const category = document.getElementById('category')
    const obj = {
        amount: amount.value,
        description: description.value,
        category: category.value
    }
    amount.value = '';
    description.value = '';
    category.value = '';
    axios.post('http://localhost:3000/addExpense', obj, { headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` } })
        .then(res => {
            notifyUser(res.data.message)
        })
        .catch(err => {
            console.log(err)
        })

})


//display expense
let limit;
const getExpense = document.getElementById('getExpense')
getExpense.addEventListener('click', () => {
    limit = 'all';
    displayExpenses(limit)
})


//displaying expense
function displayExpenses(limit, page = 1, rows = localStorage.getItem('rows')) {
    const displayContainer = document.getElementById('displayContainer')
    displayContainer.innerHTML = ''
    axios.get(`http://localhost:3000/getExpenses?limit=${limit}&page=${page}&rows=${rows}`, { headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` } })
        .then(response => {
            console.log(response.data.expenses)
            const table = document.createElement('table')
            table.setAttribute('class', 'styled-table')
            const thead = document.createElement('thead')
            const tbody = document.createElement('tbody')
            const tfoot = document.createElement('tfoot')
            let total = 0;
            thead.innerHTML = `
            <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th></th>
            </tr>
        `
            response.data.expenses.forEach(expense => {
                const row = document.createElement('tr')
                row.setAttribute('id', `e${expense.id}`)
                row.innerHTML = `
                <td>${expense.createdAt.substring(0, 10)}</td>
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td><button id="dltbtn" style="color:red;border-radius:5px;padding:3px;">Delete</button></td>
            `
                total += parseInt(`${expense.amount}`)
                tbody.appendChild(row);
            })
            tfoot.innerHTML = `
                <tr>
                <td>Total</td>
                <td>${total}</td>
                <td></td>
                <td></td>
                <td></td>
                </tr>
            `
            table.appendChild(thead)
            table.appendChild(tbody)
            table.appendChild(tfoot)
            displayContainer.appendChild(table)
            pagination(response)

        })
        .catch(err => {
            console.log(err)
        })
}


//logout
const logout = document.getElementById('logout')
logout.addEventListener('click', () => {
    window.location.href = '../login/login.html'
    localStorage.removeItem('token')
})




//delete expense
const displayContainer = document.getElementById('displayContainer')
displayContainer.addEventListener('click', (e) => {
    if (e.target.id == 'dltbtn') {
        const liId = e.target.parentNode.parentNode.id.substring(1);
        const li = e.target.parentNode.parentNode
        //li.remove()
        axios.post(`http://localhost:3000/deleteExpense/${liId}`, {}, { headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` } })
            .then((res) => {
                li.remove()
                notifyUser(res.data.message)
            })
            .catch(err => { console.log(err) })
    }
})


//premium
const premiumBtn = document.getElementById("premium");
const payBtn = document.getElementById('pay')
const close = document.getElementById("close");
const container = document.getElementById("popup-container");
const amount = 49900
let orderId;


premiumBtn.addEventListener("click", () => {
    container.classList.add("active");
    axios.post('http://localhost:3000/premium/create/order', { amount: amount }, { headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` } })
        .then(response => {
            orderId = response.data.order.id;
            payBtn.style = "display:block"
        })
        .catch(err => {
            console.log(err)
        })
});

close.addEventListener("click", () => {
    container.classList.remove("active");
    payBtn.style = "display:none"
});


let paymentId;
let signature;
payBtn.addEventListener('click', (e) => {
    container.classList.remove("active");
    payBtn.style = "display:none"
    var options = {
        "key": "rzp_test_ps6lSD7tRRGeh5", // Enter the Key ID generated from the Dashboard
        "amount": `${amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Expense Tracker",
        "description": "Premium",
        //"image": "https://example.com/your_logo",
        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response) {
            paymentId = response.razorpay_payment_id;
            signature = response.razorpay_signature;
            alert(`Payment successful: your order ID: ${response.razorpay_order_id} and payment ID:${response.razorpay_payment_id}`);
            window.location.href = "../premium-frontend/premium.html"

            axios.post('http://localhost:3000/transaction/detail', { orderId: orderId, paymentId: paymentId }, { headers: { 'authorization': `Bearer ${localStorage.getItem('token')}` } })
                .then()
                .catch(err => {
                    console.log(err)
                })
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert(response.error.description);
    });
    rzp1.open();
    e.preventDefault();

});



