import firebase from 'firebase/app'
import 'firebase/storage';

export default async function getImage(path) {
    let storage = firebase.storage();
    let pathReference = storage.ref(`${path}.png`);

    return new Promise((resolve, reject) => {
        pathReference.getDownloadURL()
            .then((url) => {
                resolve(url);
            })
            .catch((error) => {
                reject(error)
                console.log(error);
            });
    })
}