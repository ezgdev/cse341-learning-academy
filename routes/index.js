const router = require("express").Router();

// router.use('/', require('./swagger'));

router.get("/", (req, res) => {
  //#swagger.tags = ['Home']
  res.send("Learning Academy API");
});

module.exports = router;
