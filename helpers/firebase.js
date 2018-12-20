const firebaseAdmin = require('firebase-admin')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

const db = firebaseAdmin.firestore()

const dhamisProgress = db.collection('dhamis').doc('progress')
const dhamisPercentage = db.collection('dhamis').doc('percentage')
const dhamisMigrating = db.collection('dhamis').doc('migrating')

const dhamisLog = (state) => {
  dhamisProgress.set({
    state
  })
}

const resetNotifications = () => {
  dhamisProgress.set({ state: '' })
  dhamisPercentage.set({ state: 0 })
  dhamisMigrating.set({ state: false })
}

module.exports = {
  dhamisPercentage,
  dhamisProgress,
  dhamisLog,
  resetNotifications,
  dhamisMigrating
}
