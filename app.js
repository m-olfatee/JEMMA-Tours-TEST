const path = require("path")
const express = require("express")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const hpp = require("hpp")
const cookieParser = require("cookie-parser")
const compression = require("compression")
const csp = require("express-csp")

const AppError = require("./utils/appError")
const globalErrorHandler = require("./controllers/errorController")
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes")
const reviewRouter = require("./routes/reviewRoutes")
const bookingRouter = require("./routes/bookingRoutes")
const viewRouter = require("./routes/viewRoutes")
const homeRouter = require("./routes/homeRoutes")

const app = express()

// PUG engine activator and direction
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

// GLOBAL MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname, "public")))

// Set security HTTP headers
app.use(helmet())
csp.extend(app, {
    policy: {
        directives: {
            'default-src': ['self'],
            'style-src': ['self', 'unsafe-inline', 'https:'],
            'font-src': ['self', 'https://fonts.gstatic.com'],
            'script-src': [
                'self',
                'unsafe-inline',
                'data',
                'blob',
                'https://js.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:8828',
                // 'ws://localhost:56558/',
            ],
            'worker-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                // 'ws://localhost:*/',
            ],
            'frame-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                // 'ws://localhost:*/',
            ],
            'img-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                // 'ws://localhost:*/',
            ],
            'connect-src': [
                'self',
                'unsafe-inline',
                'data:',
                'blob:',
                // 'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
                'https://*.stripe.com',
                'https://*.mapbox.com',
                'https://*.cloudflare.com/',
                'https://bundle.js:*',
                // 'ws://localhost:*/',
            ],
        },
    },
});

// Development logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

// Limit request from same IP
const limiter = rateLimit({
    max: 100, // how many request
    windowMs: 60 * 60 * 1000,  // 1 hour in millisecond
    message: "Too many request from this IP, please try again in an hour!"
})
app.use("/api", limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
app.use(cookieParser())

// Data sanitization against NoSQL injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
    whitelist: ["duration", "ratingsAverage", "ratingsQuantity", "maxGroupSize", "difficulty", "price"]
}))

// Compression request and response / not for images
app.use(compression())

// Test middleware

app.use((req, res, next) => {
    //console.log("Hello from the middleware inside APP.JS")
    req.requestTime = new Date().toISOString()
    next()
})

// ROUTES

app.use("/", homeRouter)
app.use("/overview", viewRouter)
app.use("/api/v1/tours", tourRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/reviews", reviewRouter)
app.use("/api/v1/bookings", bookingRouter)

app.all("*", (req, res, next) => {
    next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

// START SERVER

module.exports = app
