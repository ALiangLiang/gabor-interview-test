const path = require('path')
const express = require('express')
const multer = require('multer')
const { pick } = require('lodash')
const sanitizeHtml = require('sanitize-html')

const { User } = require('../models')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Appending extension
  }
})
const upload = multer({ storage })

function needLogin (req, res, next) {
  if (!req.session.userId) {
    return res.redirect(403, '/account/login')
  }

  next()
}

const router = express.Router()

/* GET home page. */
router.get('/', needLogin, async function (req, res, next) {
  const users = await User.findAll()
  res.render('index', { users })
})

router.get('/profile', needLogin, async function (req, res, next) {
  const queryUserId = Number(req.query.userId) || undefined
  const sessionUserId = req.session.userId
  let watched
  if (queryUserId && queryUserId !== sessionUserId) {
    watched = await User.findOne({
      where: {
        id: queryUserId
      },
      include: 'Watcher'
    })
    const watcher = await User.findOne({
      where: {
        id: sessionUserId
      }
    })

    if (!watched) {
      return res.status(404).send('找不到使用者')
    }

    await watched.addWatcher(watcher)
    console.log(watched.toJSON())
  } else {
    watched = await User.findOne({
      where: {
        id: sessionUserId
      },
      include: 'Watcher'
    })

    if (!watched) {
      return res.status(404).send('找不到使用者')
    }
  }

  const editable = (queryUserId && queryUserId === sessionUserId) || !queryUserId

  res.render('profile', { editable, user: watched, csrfToken: req.csrfToken(), watchers: watched.Watcher })
})

router.post('/profile', needLogin, upload.single('avatar'), async function (req, res, next) {
  const avatarPath = (req.file) ? `uploads/${req.file.filename}` : undefined

  // 只篩出我們要的
  const userData = pick(req.body, [
    'nickname',
    'email',
    'name',
    'intro',
    'hobbies'
  ])

  // 過濾掉所有 HTML 標籤
  for (const key in userData) {
    userData[key] = sanitizeHtml(userData[key], {
      allowedTags: []
    })
  }

  await User.update({
    nickname: userData.nickname,
    email: userData.email,
    name: userData.name,
    intro: userData.intro,
    hobbies: userData.hobbies,
    avatar: avatarPath
  }, {
    where: {
      id: req.session.userId
    }
  })
  const user = await User.findOne({
    where: {
      id: req.session.userId
    },
    include: 'Watcher'
  })
  res.render('profile', { editable: true, user, csrfToken: req.csrfToken(), watchers: user.Watcher })
})

module.exports = router
