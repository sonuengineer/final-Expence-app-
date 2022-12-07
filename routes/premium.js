const express = require('express')

const premiumController = require('../controllers/premium')

const authorization = require('../middleware/authorization')

const router = express.Router()

router.post('/premium/create/order', authorization, premiumController.premiumOrderGeneration)
//router.post('/transaction/detail', authorization, premiumController.updateTransactionDetails)

router.get('/premium/leaderboard', authorization, premiumController.getAllUSer)


module.exports = router