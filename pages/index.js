import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import dynamic from 'next/dynamic'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import initFirebase from '../utils/auth/initFirebase';

const Footer = dynamic(() => import('../components/Footer'))
const NavBar = dynamic(() => import('../components/Header'))
const OfferCard = dynamic(() => import('../components/OfferCard'))

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },

  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },

  heroButtons: {
    marginTop: theme.spacing(4),
  },

  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },

  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },

  cardContent: {
    flexGrow: 1,
  },

}));

export default function Index() {
  const classes = useStyles();
  const [userInformation, setUserInformation] = useState({})
  const [offers, setOffers] = useState([])

  //-----Firebase------------//
  useEffect(() => {
    initFirebase();
    let db = firebase.firestore();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //now ask for user info
        let userDoc = db.collection('users').doc(user.uid)

        userDoc.get().then((doc) => {
          if (doc.exists) {
            console.log(doc.data())
            //Infite loop on setting userInformation below
            setUserInformation(doc.data())
          }
        })
      }

      else {
        userInformation = {}
        console.log("Loading")
      }

      let offersFromDb = [];
      //Regardless... Get offers from offers collection.
      let offersCollection = db.collection('offers') //can add WHERE clause here
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            offersFromDb.push(doc.data())
            console.log(doc.id, " => ", doc.data());
          });
          setOffers(offersFromDb);
        })

    });

  }, [])
  //-----End Firebase--------//

  return (
    // This is the code that INFLUENCERS WILL SEE.
    <React.Fragment>
      <CssBaseline />
      <NavBar />
      <main>

        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={4}>
            {offers.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <OfferCard />
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>

      <Footer />

    </React.Fragment>
  );
}