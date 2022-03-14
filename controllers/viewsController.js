const Tour = require("../models/tourModel")
const User = require("../models/userModel")
const Booking = require("../models/bookingModel")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")

exports.getOverview = catchAsync(async (req, res) => {
    // 1) get tour data from collection
    const tours = await Tour.find()
    // 2) Render that template using tour data 1)
    res.status(200).render("overview", {
        title: "All tours",
        tours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: "reviews",
        fields: "review rating user"
    })
    if (!tour) {
        return next(new AppError("There is no tour with that name", 404))
    }
    // 2) Render template using data from 1)
    res.status(200)
        .set(
            'Content-Security-Policy',
            "default-src 'self' https://*.mapbox.com; base-uri 'self'; block-all-mixed-content; font-src 'self' https:; frame-ancestors 'self'; img-src 'self' blob: data:; object-src 'none'; script-src 'unsafe-inline' https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob:; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;"
        )
        .render('tour', {
            title: `${tour.name} Tour`,
            tour
        })
})

exports.getSignupForm = catchAsync(async (req, res) => {
    res.status(200).render('signup', {
        title: `Create your account`
    })
})

exports.getLoginForm = catchAsync(async (req, res) => {
    res.status(200).render('login', {
        title: `Log into your account`
    })
})

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: `Your account`
    })
}

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id })
    // 2 find tours with returned IDs
    const tourIDs = bookings.map(el => el.tour)
    const tours = await Tour.find({ _id: { $in: tourIDs } })
    res.status(200).render("overview", {
        title: "My tours",
        tours
    })
})

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },
        {
            new: true,
            runValidators: true
        })
    res.status(200).render('account', {
        title: `Your account`,
        user: updatedUser
    })
})