const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firebaseConfig = {
    apiKey: "AIzaSyBJpt1wi53ctf7by7Wud5K_s83vFLlfbVg",
    authDomain: "gaminginfluencersite.firebaseapp.com",
    databaseURL: "https://gaminginfluencersite.firebaseio.com",
    projectId: "gaminginfluencersite",
    storageBucket: "gaminginfluencersite.appspot.com",
    messagingSenderId: "1063033624890",
    appId: "1:1063033624890:web:bdc9ba02824a442cb61803",
    measurementId: "G-RH71K3FJZE"
};

admin.initializeApp(
    firebaseConfig
)

exports.createUserDocument = functions.auth.user().onCreate((user) => {
    try {
        console.log("Attempting to create user");

        //Append empty fields to user object
        let userObject = user;
        userObject.category = "";
        userObject.description = "";
        userObject.detailedSmpInformation = [];
        userObject.socialMediaPlatforms = [];

        return admin
            .firestore()
            .collection('users')
            .doc(user.uid)
            .set(JSON.parse(JSON.stringify(userObject)));
    }
    catch (error) {
        functions.logger.info("Failed to write user", error), { structuredData: true };
        return null;
    }
});