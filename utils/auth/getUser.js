import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default async function getUser(user) {
    let db = firebase.firestore();

    return new Promise((resolve, reject) => {
        if (user) {
            let userDoc = db.collection('users').doc(user.uid)
            userDoc.get()
                .then((doc) => {
                    if (doc.exists) {
                        resolve(doc.data());
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        else {
            console.log("No user found, or user is logged out");
            resolve(null);
        }

    })

}