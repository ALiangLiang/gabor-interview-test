const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const csrf = require('csurf')
const helmet = require('helmet')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const indexRouter = require('./routes/index')
const accountRouter = require('./routes/account')
const { sequelize } = require('./models')

function extendDefaultFields (defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId
  }
}

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  resave: false,
  secret: 'gabor-interview-test',
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'strict'
  },
  store: new SequelizeStore({
    db: sequelize,
    modelKey: 'Session',
    tableName: 'Sessions',
    extendDefaultFields: extendDefaultFields
  })
}))
app.use(cookieParser())
app.use(function (req, res, next) {
  console.log(req.body)
  next()
})
app.use(csrf({ cookie: false }))
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", 'cdn.jsdelivr.net'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/account', accountRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
