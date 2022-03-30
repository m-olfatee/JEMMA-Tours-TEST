const express = require("express")
const viewsController = require("../controllers/viewsController")
const authController = require("../controllers/authController")
const bookingController = require("../controllers/bookingController")

const router = express.Router()

router
    .get("/",
        bookingController.createBookingCheckout,
        authController.isLoggedIn,
        viewsController.getHome,
        viewsController.getOverview)
router.get("/about", authController.isLoggedIn, viewsController.getAbout)


module.exports = router