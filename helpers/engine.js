const _ = require('lodash')
const moment = require('moment')
const axios = require('axios')
const winston = require('winston')
const { OrganizationUnits, ArtDataElements } = require('../models')

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
  console.log(payload)
}

const engine = async (quarter, year) => {
  const period = `${year}Q${quarter}`
  const dataElements = await getDhisDataElements()
  const dataValues = await getDhamisData(quarter, year)
  const orgUnits = await getOrgUnits()

  const dataSet = 'mLAtASimykI'
  const username = 'administrator'
  // const password = 'adminpassword'
  // const url = 'http://testdhis.kuunika.org:8080/training/api/dataValueSets'
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

  dataValues.forEach(async dataValue => {
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

    if (!orgUnitId) return

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
      dataValues: {
        dataElement: dataElementId,
        period,
        orgUnit: orgUnitId,
        categoryOptionCombo: dataElementCategoryOptionCombo,
        attributeOptionCombo: dataElementAttributeOptionCombo,
        value,
        storedBy: username
      }
    }
  })
  postPayLoad(dataValues.length)
}
module.exports = engine
