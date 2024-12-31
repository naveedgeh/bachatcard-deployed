const admin = require('firebase-admin')
const serviceAccount = require('../firebase.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cannabis-delivery-default-rtdb.firebaseio.com",
    authDomain: "cannabis-delivery.firebaseapp.com",
})
var db = admin.database();
var driverLocationRef = db.ref("driverLocation");
exports.sendFMCNotification = async (token, title, body) => {
    await admin.messaging().sendToDevice(
        token,
        {
            notification: { title, body }
        },
        {
            // Required for background/quit data-only messages on iOS
            contentAvailable: true,
            // Required for background/quit data-only messages on Android
            priority: 'high'
        }
    )
}
exports.getDataFromFirebase = async () => {
    try {
        return new Promise((resolve, reject) => {
            driverLocationRef.on('value', async (snap) => {
                const filteredObj = Object.values(snap.val())
                resolve(filteredObj)
            })
        })

    }
    catch (err) {
        console.log(err, "in firebase")
    }
}

exports.addDataToFirebase = async () => {
    try {
        const obj = {
            id: '6226f738cb889156f8bc5495',
            latitude: '33.54815771767154',
            longitude: '73.05401555473674'
        }
        var driver = driverLocationRef;
        driver.update(obj, (err) => {
            if (err) {
                conosle.log(err)
            }
            else {
                console.log("user created sucessfully");
            }
        })
    }
    catch (err) {
        console.log(err, "in firebase")
    }
}