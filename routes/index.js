const router = require("express").Router();
const passport = require('passport');

router.use('/', require('./swagger'));
router.use('/student', require('./student'));
router.use('/instructor', require('./instructor'));
router.use('/course', require('./course'));
router.use('/enrollment', require('./enrollment'));

// login and logout routes
router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
  });


router.get("/", (req, res) => {
  //#swagger.tags = ['Home']
  res.send("Learning Academy API");
});

module.exports = router;
