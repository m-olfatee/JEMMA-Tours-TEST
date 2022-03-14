const catchAsync = require("../utils/catchAsync")

exports.getHome = catchAsync(async (req, res) => {
    res.status(200).render("home", {
        title: "Home"
    })
})