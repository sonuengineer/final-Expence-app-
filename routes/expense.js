const express = require('express')

const expenseController = require('../controllers/expense')

const authorization = require('../middleware/authorization')

const router = express.Router()

router.post('/addExpense', authorization, expenseController.addExpense)
router.get('/getExpenses', authorization, expenseController.getExpense)
router.post('/deleteExpense/:expenseId', authorization, expenseController.deleteExpense)
router.get('/download', authorization, expenseController.downloadExpense)
router.get('/previousdownloads', authorization, expenseController.previousDownload)


module.exports = router