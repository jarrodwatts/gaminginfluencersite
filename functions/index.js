const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const puppeteer = require('puppeteer');

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
        functions.logger.info(user);
        return admin
            .firestore()
            .collection('users')
            .doc(user.uid)
            .set(JSON.parse(JSON.stringify(user)));
    }
    catch (error) {
        functions.logger.info("Failed to write user", error), { structuredData: true };
        return null;
    }
});


exports.updateTwitter = functions.firestore.document('/users/{documentId}')
    .onUpdate(async (snap, context) => {
        const documentId = context.params.documentId;
        const before = snap.before.data();
        const after = snap.after.data();

        const twitterUsername = after["socialMediaPlatforms"]["twitter"];

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        await page.goto(`https://twitter.com/${twitterUsername}`, {
            waitUntil: 'networkidle2',
        });
        page.setDefaultNavigationTimeout(0);

        await page.waitForSelector(
            '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-13awgt0.r-18u37iz.r-1w6e6rj > div:nth-child(2) > a > span.css-901oao.css-16my406.r-18jsvk2.r-1qd0xha.r-b88u0q.r-ad9z0x.r-bcqeeo.r-qvutc0 > span'
            , { timeout: 0 });

        const followersElement = await page.$('#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-13awgt0.r-18u37iz.r-1w6e6rj > div:nth-child(2) > a > span.css-901oao.css-16my406.r-18jsvk2.r-1qd0xha.r-b88u0q.r-ad9z0x.r-bcqeeo.r-qvutc0 > span');

        const content = await followersElement.getProperty('textContent');

        const value = await content.jsonValue();
        console.log(value);

        await browser.close();
        // works ... sometimes...

    });

// exports.updateInstagram = functions.firestore.document('/users/{documentId}')
//     .onUpdate((snap, context) => {
//         const documentId = context.params.documentId;
//         const before = snap.before.data();
//         const after = snap.after.data();

//         const igUsername = before["socialMediaPlatforms"]["instagram"]

//         functions.logger.log("Ig: ", igUsername);
//         fetch(`https://www.instagram.com/${igUsername}`)
//             .then(res => res.text())
//             .then(
//                 body => {
//                     const DOM = new jsdom.JSDOM(body);

//                     let qs = DOM.window.document.querySelector("head > meta:nth-child(39)");

//                     const followers = qs.content.split(" ")[0];
//                     const following = qs.content.split(" ")[2];
//                     const posts = qs.content.split(" ")[4];
//                     const username = qs.content.split("@")[1].split(")")[0]
//                     const imageUrl = DOM.window.document.querySelector("head > meta:nth-child(41)").content;

//                     //Make check for changes to avoid infinite loop
//                     if (
//                         //ESLint is preventing me from Optional Chaining here idk why...
//                         before.socialMediaPlatforms &&
//                         after.socialMediaPlatforms &&
//                         before.socialMediaPlatforms.instagram === after.socialMediaPlatforms.instagram
//                     ) {
//                         functions.logger.log("Saw no changes, not writing anything")
//                         return null
//                     }
//                     else {
//                         functions.logger.log("Writing new instagram data")
//                         return admin.
//                             firestore().collection('users').doc(documentId)
//                             .update({
//                                 socialStatistics: {
//                                     instagram: {
//                                         followers: followers,
//                                         following: following,
//                                         posts: posts,
//                                         username: username,
//                                         imageUrl: imageUrl
//                                     }
//                                 }
//                             })
//                     }
//                 })

//             .catch((err) => functions.logger.warn(err))
//     });

// exports.updateTwitter = functions.firestore.document('/users/{documentId}')
//     .onUpdate((snap, context) => {
//         const documentId = context.params.documentId;
//         const before = snap.before.data();
//         const after = snap.after.data();

//         //if twitterUsername is being added for the first time, then use after
//         const 
//             twitterUsername = 
//             before["socialMediaPlatforms"]["twitter"] ?
//             before["socialMediaPlatforms"]["twitter"] :
//             after["socialMediaPlatforms"]["twitter"]


//         functions.logger.log("Twitter: ", twitterUsername);
//         fetch(`https://www.twitter.com/${twitterUsername}`)
//             .then(res => res.text())
//             .then(
//                 body => {
//                     const DOM = new jsdom.JSDOM(body);

//                     functions.logger.log(DOM);
//                     return null;
//                 })

//             .catch((err) => functions.logger.warn(err))
//     });