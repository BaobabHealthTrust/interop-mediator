const _ = require('lodash')
const moment = require('moment')
const axios = require('axios')
const winston = require('winston')
const { OrganizationUnits, ArtDataElements } = require('../models')

const firebaseAdmin = require('firebase-admin')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: 'kuunika-test',
    clientEmail: 'firebase-adminsdk-bffkc@kuunika-test.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDYVgBwS8LiF+r\nR6lgpaYqy6iiP1ll0FuLF+cJHGMkCddjhxalAWi+29BQunTM9+j7qS8yAKQquBYT\ngxOb+9yuu1qmfIQcwHowNu+T3WYhkGTwz3MbofIsY34Kq9J5FH6nqkOMEtIneaPL\nNOZDgolWyTj3ByO5cOGQE8/wE3/O65WTz9Sa/lm94PbvE3M19QBug4BPhrj7NeyA\n5mJnAlWw6FyF6tXGfzjw82Q4ZPruQxun2zxahqQ65vijjzVBeZCJ6J9h8JFoSlDZ\nyLf0/wnaXDzrcWwtvoCyboZpYWjGbB7yvUbj4MpOaEXH0Vv/kpffI/axLWQ1wB20\n1dcBU3ebAgMBAAECggEADca2WuFRPOHvxPb3lW34qnnTuST4W7p2Sfd0fer3fpoH\nCuiCiz3vMc30AU00YSN11RDX2BG9gZmbTOLoJg57QALL4INVGWXk97NX7zgkNGen\nBmfKOP+RQNn/ECePXqQ4TgAuZRkKomfsSa7AMbBpmKn1j018kl3IOc170vS9BUzt\nisKvS6TA/DLpM71ezYkVsb+NPRy56/mqzWLftufU7RIgBWkLCiIezFW6LH0sUcIz\nnl5ITDizyN7tBMCgjvfP8DfR7hx2z8V0R5uh5xoi8b/o9Xw0qNwiD1NK4ReMzyWK\naUAkDkJKjRBaZn0xuu7sERfEc133Kg1AVa0voQl3QQKBgQDyFRT3Dy1GB4AnIT3v\nPuTxrL980OzqO96Q9nbwtinGFA+yA3DAlKlqJguMJmNsKJAP0GhhW/yKsKCNJsGW\nIDEP3PYgOY/r18Ayx+8AhjaBg2v68ST8il1WTdgjlCycF3D1DsFllcnJ3pS2AAf5\nVwKOA/BlXF4iCtV0IKuqoiKooQKBgQDOnOj0WjtMRxY43EL0Uex6hIkuK6uIkrZT\nAZ35UgcM4DWCl7D1Yr5u3wq3pliZvr7hfCf5YW1Y4pj4jUbDN6TbwBLJSSbsy4Zn\nI05b7YjgUee+DNkkZwF+2fV+ycUs7cjUiCggjIFvKQgN7uvGs9P1PzTP0HANl8DQ\nh0iD4+wKuwKBgQCtXMWfzEGa1gJDg33MGJlyLUkQhLo1YFyaKbax2XJ/BJzc2bPk\nZlIQz2ATpOYsbbwFZzVpC6wGUkkX7HpUHYelGZM1LqPPvLlKZH3XPUZJZ6lrk0fu\nhtQi2yp/CD0OJ4dgJ4n+Ss+wfnK3B7yuJk6RD2cX35cV//Yu7LqjPutdIQKBgGkj\nxBAEksRgMFjDDXdS8Snvo/dQ1btsHUfkPMWRDnFo7xIDq1NT6mB1M/j8t32VaYFJ\nMvZes8xVk054ZhgVitkgxu6TQTGi6EQ33To+iDbOt0UpOJ6jpEkvFRRuDN6uKlKs\n7u6RUZSFpsmgWW8GN8hHX9KY2UyxercjAK3NIGLdAoGAXoD0k9CA1fvDnlKMcQO7\nQze17w4POm8HcvqWQ4Ovn6yvrEuwrRm8aR0dQrUyMTxTKl2QuScDrSud1NXQTFY+\nqJsKBhbr3ZEHpjr+WnB9y8b1NFg3v1BgMST5UHihwzAw2qw1Il9yQuL4fxbErYjQ\nawQCNPWZx2OFXDOxrLZWY6w=\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: 'https://kuunika-test.firebaseio.com'
})

const db = firebaseAdmin.database()

const dhamisProgress = db.ref('dhamis-progress')

const getDhamisData = async (quarter, year) => {
  const url = process.env.DHAMIS_API_URL
  const apiKey = process.env.DHAMIS_API_KEY
  const dhamisPeriodData = (await axios.get(`${url}/api/quarters/${apiKey}`)).data
  const id = dhamisPeriodData.find(dpd => (Number(dpd.year) === year && Number(dpd.quarter) === quarter)).id
  if (!id) {
    winston.error('Invalid period')
    return []
  }
  const artRegistrations = (await axios.get(`${url}/api/artclinic/get/${apiKey}/${id}`)).data
  const hccRegistrations = (await axios.get(`${url}/api/hivcareclinic/get/${apiKey}/${id}`)).data
  const primaryAndSecondaryOutcomes = (await axios.get(`${url}/api/artoutcomesprimarysecondary/get/${apiKey}/${id}`)).data

  const data = [
    ...artRegistrations,
    ...hccRegistrations,
    ...primaryAndSecondaryOutcomes
  ]
  console.log('tranferring logic to dhis2')
  console.log(data.length)
  return data
}

const getDhisDataElements = async () => ArtDataElements.find({})

const getOrgUnits = async () => OrganizationUnits.find({})

const postPayLoad = async (payload) => {
  const username = 'haroontwalibu'
  const password = 'Mamelodi@19'
  const url = 'http://testdhis.kuunika.org:1414/dhis/api/dataValueSets'
  console.log(payload)
  try {
    await axios({
      method: 'post',
      url,
      auth: {
        username,
        password
      },
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    }).then(data => console.log(data))
  } catch (err) {
    console.log(err)
  }
}

const engine = async (quarter, year) => {
  const period = `${year}Q${quarter}`
  const dataElements = await getDhisDataElements()
  const dataValues = await getDhamisData(quarter, year)
  const orgUnits = await getOrgUnits()

  const dataSet = 'mLAtASimykI'
  const username = 'haroontwalibu'
  const password = 'Mamelodi@19'
  const url = 'http://testdhis.kuunika.org:1414/dhis/api/dataValueSets'
  const date = moment(Date.now()).format('Y-M-D')

  const orgUnitsMap = {}

  orgUnits.forEach(orgUnit => {
    orgUnitsMap[_.trim(orgUnit.DHAMISName)] = {
      orgunitid: orgUnit.DHIS2Id
    }
  })

  const dataElementIdMap = {}
  const categoryComboIdMap = {}
  const attributeIdMap = {}

  dataElements.forEach(dataElement => {
    const code = dataElement['Code']
    dataElementIdMap[code] = dataElement['DataElementID']
    categoryComboIdMap[code] = dataElement['CategoryID']
    attributeIdMap[code] = dataElement['AttributeID']
  })

  const orgUnitIdentifier = {
    orgunitidentifiername: '',
    orgunitidentifiercode: ''
  }
  console.log('migrating...')
  let counter = 0
  for (const dataValue of dataValues) {
    dhamisProgress.set({
      progress: `${counter + 1}:${dataValues.length}`,
      percentage: Math.floor((counter / dataValues.length) * 100)
    })
    counter += 1
    const orgUnitIdentifierName = dataValue['site']
    if (orgUnitIdentifierName) {
      // TODO: ask Nthezemu if key is right
      orgUnitIdentifier['orgunitidentifiername'] = orgUnitIdentifierName
    }
    const orgUnitName = orgUnitIdentifier['orgunitidentifiername']
    // TODO: are there any chances that the id won't be found?
    let orgUnitId = ''
    if (orgUnitsMap[orgUnitName]) {
      orgUnitId = orgUnitsMap[orgUnitName]['orgunitid']
    }

    if (orgUnitId) {
      const dataElementCode = _.trim(dataValue['ID'])
      const dataElementType = _.trim(dataValue['reporting_period'])
      // const facilityName = _.trim(dataValue['Site'])
      const value = _.replace(_.trim(dataValue['data_value']), ',', '')

      const dataElementTypeIdentifier =
        dataElementType === 'Cumulative'
          ? dataElementCode + '-c'
          : dataElementCode + '-q'

      const dataElementId = dataElementIdMap[dataElementTypeIdentifier]

      // TODO: verify condition for missing id
      if (!dataElementId) return
      const dataElementCategoryOptionCombo =
        categoryComboIdMap[dataElementTypeIdentifier]
      const dataElementAttributeOptionCombo =
        attributeIdMap[dataElementTypeIdentifier]

      const payload = {
        dataSet,
        completeDate: date,
        period,
        orgUnit: orgUnitId,
        dataValues: [{
          dataElement: dataElementId,
          period,
          orgUnit: orgUnitId,
          categoryOptionCombo: dataElementCategoryOptionCombo,
          attributeOptionCombo: dataElementAttributeOptionCombo,
          value,
          storedBy: username
        }]
      }
      await postPayLoad(payload)
    }
  }
  console.log('migrating done...')
}
module.exports = engine
