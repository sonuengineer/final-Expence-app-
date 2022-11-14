const dotenv = require('dotenv')
dotenv.config()

const path = require('path');
const fs = require('fs');

const express = require('express')
const bodyParser = require('body-parser')


const sequelize = require('./util/database')

const User = require('./models/user')
const Expense = require('./models/expense')

const cors = require('cors')

const authRoutes = require('./routes/auth')
const expenseRoutes = require('./routes/expense')




const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors());



User.hasMany(Expense);
Expense.belongsTo(User);



app.use('/user', authRoutes);
app.use(expenseRoutes);


sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
      
        app.listen(process.env.PORT || 3000)
    })
    .catch(err => {
        console.log(err)
    })
