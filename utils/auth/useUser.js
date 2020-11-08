import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import cookies from 'js-cookie'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from '../auth/initFirebase'

initFirebase();

const useUser = () => {
  const [user, setUser] = useState();
  const [userDocument, setUserDocument] = useState();
  const router = useRouter()

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        cookies.remove('auth')
        setUser()
        router.push('/')
      })
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() => {
    const cookie = cookies.get('auth')
    if (!cookie) {
      //BELOW: This forces redirect to login when user is not logged in and tries to access a page.
      //router.push('/')
      return
    }
    setUser(JSON.parse(cookie))

  }, [])

  useEffect(() => {
    const getUserDetails = async () => {
      const cookie = cookies.get('auth');
      if (cookie) {
        //If there's a auth cookie present (user logged in), parse it.
        const parsedCookie = JSON.parse(cookie);

        //Open up a firestore connection
        initFirebase();
        const db = firebase.firestore();

        //Ask for the user's user document data
        const userDocRef = db.collection('users').doc(parsedCookie.id);
        const userDocData = await userDocRef.get();
        setUserDocument(userDocData.data());
      }
    }
    getUserDetails();
  }, [])

  return { user, userDocument, logout }
}

export { useUser }
