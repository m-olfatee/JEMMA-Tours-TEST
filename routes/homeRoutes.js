const express = require("express")
const homeController = require("../controllers/homeController")
const viewsController = require("../controllers/viewsController")
const authController = require("../controllers/authController")
const bookingController = require("../controllers/bookingController")

const router = express.Router()

router.get("/", bookingController.createBookingCheckout, authController.isLoggedIn, homeController.getHome, viewsController.getOverview,)

module.exports = router