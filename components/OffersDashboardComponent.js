import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import Grid from '@material-ui/core/Grid';
import OfferCard from './OfferCard';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import initFirebase from '../utils/auth/initFirebase';

// Generate Sales Data
function createData(time, amount) {
    return { time, amount };
}

const data = [
    createData('00:00', 0),
    createData('03:00', 300),
    createData('06:00', 600),
    createData('09:00', 800),
    createData('12:00', 1500),
    createData('15:00', 2000),
    createData('18:00', 2400),
    createData('21:00', 2400),
    createData('24:00', undefined),
];

export default function OffersDashboardComponent() {
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
        <React.Fragment>
            <Title>Your Offers</Title>
            <ResponsiveContainer>

                <Grid container spacing={4}>
                    {offers.map((offer, key) => (
                        <Grid item key={key} xs={12} sm={6} md={4}>
                            <OfferCard
                                title={offer.title}
                                description={offer.description}
                                creator={offer.creator}
                                dateCreated={offer.dateCreated}
                                id={offer.id}
                            />
                        </Grid>
                    ))}
                </Grid>

            </ResponsiveContainer>
        </React.Fragment>
    );
}