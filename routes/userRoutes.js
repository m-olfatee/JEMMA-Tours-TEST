const express = require("express")
const userController = require("../controllers/userController")
const authController = require("../controllers/authController")

const router = express.Router()

router.post("/signup", authController.signup)

router.post("/login", authController.login)

router.get("/logout", authController.logout)

router.post("/forgotPassword", authController.forgotPassword)

router.patch("/resetPassword/:token", authController.resetPassword)

// every route after this gonna be protected
router.use(authController.protect)

router.get("/me", userController.getMe, userController.getUserById)

router.patch("/updateMyPassword", authController.updatePassword)

router.patch("/updateMe", userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe)

router.delete("/deleteMe", userController.deleteMe)

// From here just admin allow to have access
router.use(authController.restrictTo("admin"))

router
    .route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser)

router
    .route("/:id")
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router