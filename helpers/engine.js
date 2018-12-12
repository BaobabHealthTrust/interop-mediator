const _ = require('lodash')
const moment = require('moment')
const axios = require('axios')
const winston = require('winston')
const { OrganizationUnits, ArtDataElements } = require('../models')

const { dhamisLog, dhamisPercentage, dhamisRecords, resetNotifications } = require('./firebase')

const getDhamisData = async (quarter, year) => {
  dhamisLog('Collecting DHAMIS data values')
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
  dhamisLog('Done collecting data values from DHAMIS')
  return data
}

const getDhisDataElements = async () => ArtDataElements.find({})

const getOrgUnits = async () => OrganizationUnits.find({})

const postPayLoad = async (payload) => {
  const username = 'haroontwalibu'
  const password = 'Mamelodi@19'
  const url = 'http://testdhis.kuunika.org:1414/dhis/api/dataValueSets'
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
    }).then(data => console.log(data.data.description))
  } catch (err) {
    console.log(err)
  }
}

const engine = async (quarter, year) => {
  resetNotifications()
  dhamisLog('Beginning migration')
  const period = `${year}Q${quarter}`
  const dataElements = await getDhisDataElements()
  const dataValues = await getDhamisData(quarter, year)
  const orgUnits = await getOrgUnits()

  const dataSet = 'mLAtASimykI'
  const username = 'haroontwalibu'
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
  let counter = 0
  for (const dataValue of dataValues) {
    dhamisPercentage.set({
      state: `${Math.floor((counter / dataValues.length) * 100)}`
    })
    dhamisLog(`Migrating record number ${counter + 1}`)
    dhamisRecords.set({
      state: `${counter}|${dataValues.length}`
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
      if (dataElementId) {
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
  }
  dhamisLog(`Migration Done`)
}
module.exports = engine
