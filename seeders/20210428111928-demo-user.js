const path = require('path')
const fs = require('fs')
const faker = require('faker')
const axios = require('axios')

async function generateUserDate () {
  const url = faker.image.avatar()
  const filename = faker.datatype.uuid()

  const imagePath = path.join(__dirname, '../public/uploads/', `${filename}.jpg`)
  const resp = await axios({
    method: 'get',
    url,
    responseType: 'stream'
  })
  resp.data.pipe(fs.createWriteStream(imagePath))

  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    nickname: faker.internet.userName(),
    name: faker.name.findName(),
    password: faker.internet.password(),
    intro: faker.lorem.sentences(),
    hobbies: faker.lorem.sentences(),
    avatar: `/uploads/${filename}.jpg`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersData = []
    for (let i = 0; i < 3; i++) {
      const userData = await generateUserDate()
      usersData.push(userData)
    }
    console.log(usersData)
    return queryInterface.bulkInsert('Users', usersData)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
