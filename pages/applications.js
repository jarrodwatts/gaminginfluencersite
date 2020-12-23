import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router'
import Header from '../components/Header';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import OfferCard from '../components/OfferCard';
import UserContext from '../utils/auth/UserContext';
import initFirebase from '../utils/auth/initFirebase';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));


export default function Applications() {
    const contextualUser = useContext(UserContext);
    const classes = useStyles();

    const [userInformation, setUserInformation] = useState({})
    const [offers, setOffers] = useState([])

    //-----Firebase------------//
    useEffect(() => {
        initFirebase();
        let db = firebase.firestore();

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // TODO: could use user context?
                let userDoc = db.collection('users').doc(user.uid)

                userDoc.get()
                    .then((doc) => {
                        if (doc.exists) {
                            // console.log(doc.data())
                            setUserInformation(doc.data())
                            const docData = doc.data();

                            let thisUsersApplications = db.collectionGroup('applicants').where('uid', '==', docData.uid);

                            thisUsersApplications.get()
                                .then(async (querySnapshot) => {
                                    // Avoid duplicates with state glitches
                                    setOffers([]);

                                    // Listening for live updates... probably not that necessary but nice to have
                                    querySnapshot.forEach(async (applicantsDoc) => {

                                        const thisApplicantDocData = applicantsDoc.data();

                                        console.log(thisApplicantDocData)
                                        console.log("docData:", thisApplicantDocData)
                                        // For each doc we need to query the offers collection to see the offer doc in detail via it's id stored in the applicant subdoc
                                        let docRef = db.collection("offers").doc(thisApplicantDocData.offerId);

                                        docRef.get()
                                            .then((doc) => {
                                                if (doc.exists) {
                                                    console.log("Document data:", doc.data());
                                                    setOffers([...offers, doc.data()])
                                                }
                                                else {
                                                    // doc.data() will be undefined in this case
                                                    console.log(doc.id, "doesn't exist");
                                                }
                                            })
                                            .catch((error) => {
                                                console.log("Error getting document:", error);
                                            });
                                    });
                                });
                        }
                    })
                    .catch((err) => console.error(err))
            }
        })

    }, [])
    //-----End Firebase--------//

    console.log("offers:", offers)
    return (
        <React.Fragment>
            <Header />
            <Container maxWidth="md" style={{ padding: '64px' }}>
                <Typography variant="h3">
                    Your Applications
                </Typography>
                <Typography gutterBottom>
                    👀 See which offers you've applied for...
                </Typography>

                <Grid container spacing={4} style={{ marginTop: '8px' }}>
                    {offers.map((offer, key) => (
                        <Grid item key={key} xs={12} sm={6} md={4}>
                            <OfferCard
                                title={offer.title}
                                description={offer.shortDescription}
                                creator={offer.creator}
                                dateCreated={offer.dateCreated}
                                id={offer.id}
                                image={offer.image}
                                criteria={offer.criteria}
                            />
                        </Grid>
                    ))}
                </Grid>

            </Container>
        </React.Fragment>
    )

}