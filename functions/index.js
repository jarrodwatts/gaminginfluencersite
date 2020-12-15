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

// Social Media Selector Constants
const selectors = {
    instagram: '#react-root > section > main > div > header > section > ul > li:nth-child(2) > a > span',
    twitter: '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(1) > div > div.css-1dbjc4n.r-13awgt0.r-18u37iz.r-1w6e6rj > div:nth-child(2) > a > span.css-901oao.css-16my406.r-18jsvk2.r-1qd0xha.r-b88u0q.r-ad9z0x.r-bcqeeo.r-qvutc0 > span',
    tiktok: '#main > div.jsx-1019406857.main-body.page-with-header > div.jsx-4154131465.share-layout.compact > div > header > h2.count-infos > div:nth-child(2) > strong',
    facebook: '#PagesProfileHomeSecondaryColumnPagelet > div > div:nth-child(1) > div > div._4-u2._6590._3xaf._4-u8 > div:nth-child(2) > div > div._4bl9 > div',
}

// exports.updateTwitter = functions.runWith({ timeoutSeconds: 15, })
//     .firestore.document('/users/{documentId}')
//     .onUpdate(async (snap, context) => {
//         await performSocialUpdate("twitter", "twitter.com/", snap, context);
//     });

// exports.updateTiktok = functions.runWith({ timeoutSeconds: 30, })
//     .firestore.document('/users/{documentId}')
//     .onUpdate(async (snap, context) => {
//         await performSocialUpdate("tiktok", "tiktok.com/@", snap, context);
//     });

// exports.updateFacebook = functions.runWith({ timeoutSeconds: 15, })
//     .firestore.document('/users/{documentId}')
//     .onUpdate(async (snap, context) => {
//         await performSocialUpdate("facebook", "facebook.com/", snap, context);
//     })

// Instagram is redirecting me to the login page... not sure how to fix this. will likely need to login.
// exports.updateInstagram = functions.runWith({ timeoutSeconds: 300, })
//     .firestore.document('/users/{documentId}')
//     .onUpdate(async (snap, context) => {
//         await performSocialUpdate("instagram", "instagram.com", snap, context);
//     });

async function performSocialUpdate(platform, platformUrl, snap, context) {
    const documentId = context.params.documentId;
    const before = snap.before.data();
    const after = snap.after.data();

    console.log("Updating", platform);
    try {
        let username = null;

        if (after && after["socialMediaPlatforms"] && after["socialMediaPlatforms"][platform]) {
            username = after["socialMediaPlatforms"][platform];
        }

        if (username) {
            const followers = await scrapeFollowers(platformUrl, username, selectors[platform]);
            const existingFollowers = after["socialMediaPlatforms"][platform]
            // If follower amount is not the same as previously, (avoid endless loop) - This still runs twice...
            if (followers !== existingFollowers) {
                const isUpdateSuccess = await updateFollowersInDb(platform, followers, documentId);
                if (isUpdateSuccess === true) {
                    console.log("Update Successful on platform", platform);
                }
                else {
                    console.log(isUpdateSuccess); // Console logs an error message
                }
            }
        }
        else {
            console.log("No", platform, "username available, skipping", platform)
        }
    }
    catch (error) {
        console.log("Couldn't get statistics for platform:", platform, "Reason:", error)
    }
}

async function scrapeFollowers(platformUrl, username, selector) {


    // const puppeteer = require("puppeteer-extra");
    // const stealthPlugin = require("puppeteer-extra-plugin-stealth")();

    // ["chrome.runtime", "navigator.languages"].forEach(a =>
    //     stealthPlugin.enabledEvasions.delete(a)
    // );

    // puppeteer.use(stealthPlugin);

    // main();
    // async function main() {
    //     const browser = await puppeteer.launch();
    //     const page = await browser.newPage();

    //     await page.evaluateOnNewDocument(() => {
    //         delete navigator.__proto__.webdriver;
    //     });

    //     await page.goto(`https://www.tiktok.com/@miss_extra2.0`);
    //     await page.screenshot({ path: "./11.png" });
    //     browser.close();
    // }

    const browser = await puppeteer.launch({
        headless: false, args: [
            '--disable-web-security',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"']
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });

    await page.goto(`https://www.${platformUrl}${username}`, {
        waitUntil: 'networkidle2',
    });
    console.log("Reached", `https://www.${platformUrl}${username}`)
    console.log("selecting:", selector);
    await page.waitForSelector(
        selector
    );
    console.log("reached afetr waited fro selector")

    const followersElement = await page.$(selector);

    const content = await followersElement.getProperty('textContent');

    const value = await content.jsonValue();
    await browser.close();

    return value;
}

async function updateFollowersInDb(platform, followers, documentId) {
    var userDocRef = admin
        .firestore()
        .collection('users')
        .doc(documentId);

    try {
        await userDocRef.set(
            {
                socialMediaStats: {
                    [platform]: {
                        "followers": followers
                    }
                }
            }, { merge: true }
        )
        return true;
    }
    catch (error) {
        return error;
    }
}

function sanitiseNumbers(num, platform) {

    // TODO: Use Numeral.JS http://numeraljs.com/#use-it
}

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
