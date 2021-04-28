const express = require('express')
const sanitizeHtml = require('sanitize-html')
const { pick } = require('lodash')

const { User } = require('../models')

const router = express.Router()

router.get('/login', async function (req, res, next) {
  res.render('login', { csrfToken: req.csrfToken() })
})

router.post('/login', async function (req, res, next) {
  const user = await User.findOne({
    where: {
      username: req.body.username
    }
  })

  if (user.validPassword(req.body.password)) {
    req.session.userId = user.id
    res.redirect('/')
  } else {
    res.render('login', { csrfToken: req.csrfToken() })
  }
})

router.get('/regist', function (req, res, next) {
  res.render('regist', { csrfToken: req.csrfToken() })
})

router.post('/regist', async function (req, res, next) {
  const userData = pick(req.body, [
    'username',
    'password',
    'email',
    'nickname'
  ])

  // 過濾掉所有 HTML 標籤
  for (const key in userData) {
    userData[key] = sanitizeHtml(userData[key], {
      allowedTags: []
    })
  }

  try {
    const user = await User.create({
      username: userData.username,
      password: userData.password,
      email: userData.email,
      nickname: userData.nickname
    })
    req.session.userId = user.id
    res.redirect('/')
  } catch (err) {
    res.status(400).send()
  }
})

module.exports = router
