const router =require("express").Router();

router.use('/jobs',require('./jobs'))
router.use('/employers',require('./employers'))

module.exports = router