import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Header from '../../components/Header';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import initFirebase from '../../utils/auth/initFirebase';
import getImage from '../../utils/helperFunctions/getImage';
import { convertDate } from '../../utils/helperFunctions/stringFormatting';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    cardGrid: {
        marginTop: theme.spacing(4)
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    list: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));


export default function Offer({ offer, applicants }) {
    const classes = useStyles();
    const [offerImage, setOfferImage] = useState(null)
    const [firebaseUserInformation, setUserInformation] = useState({})
    const [alreadyApplied, setAlreadyApplied] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            const res = await getImage(offer.image)
            setOfferImage(res);
        }
        if (offer.image) {
            initFirebase();
            fetchImage()
        }
    }, [offer.image])

    useEffect(() => {
        initFirebase();
        let db = firebase.firestore();
        firebase.auth().onAuthStateChanged((userLoggedInAs) => {
            //this "user" (userLoggedIn) is the user currently logged in.
            if (userLoggedInAs) {
                //now ask for user info
                let userDoc = db.collection('users').doc(userLoggedInAs.uid);

                userDoc.get().then(async (doc) => {
                    if (doc.exists) {
                        setUserInformation(doc.data())
                        setAlreadyApplied(applicants.filter(applicant => applicant.uid === userLoggedInAs.uid).length > 0);
                    }
                })
            }
        })
    }, [])
    //-----End Firebase--------//

    console.log(offer)
    console.log("Aplicants:", applicants)
    console.log("Already applied?", alreadyApplied)

    const handleApply = async () => {
        console.log("handling...")
        setAlreadyApplied(!alreadyApplied)
        //We have a list of applicants available to us through "applicants"
        console.log("Firebaseuser:", firebaseUserInformation)
        if (firebaseUserInformation) {
            //push the user to subcolleciton
            initFirebase();
            let db = firebase.firestore();
            let offerDoc = db.collection('offers').doc(offer.id)
            let applicantsSubcollection = offerDoc.collection('applicants');

            if (!alreadyApplied) { //We're saving them
                applicantsSubcollection.doc(firebaseUserInformation.uid).set(
                    JSON.parse(JSON.stringify(firebaseUserInformation))
                )
                    .then(() => console.log("Success"))
                    .catch((error) => console.log("Error", error))
            }

            else { //We're removing them
                applicantsSubcollection.doc(firebaseUserInformation.uid).delete()
                    .then(() => console.log("Success"))
                    .catch((error) => console.log("Error", error))
            }

        }
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Header />

            <main>
                <Container className={classes.cardGrid} maxWidth="md">
                    <div className={classes.root}>
                        <Grid container spacing={3} justify="center" alignItems="center">

                            {/* LEFT SIDE COLUMN */}
                            <Grid item xs={8}>
                                {/* Title */}
                                <Typography variant="h4" gutterBottom><b>{offer.title}</b></Typography>

                                {/* Author / Brand */}
                                <Grid container item direction="row" alignItems="center" >
                                    <Typography variant="h6" gutterBottom> Posted by: </Typography>
                                    <Typography color="secondary" variant="h6" gutterBottom style={{ marginLeft: '8px' }}><b>{offer.creatorName}</b></Typography>
                                </Grid>
                                <Typography gutterBottom> <b>Posted at:</b> {convertDate(offer.dateCreated.seconds)} </Typography>

                                {/* Image */}
                                <Paper className={classes.paper}>
                                    <img src={offerImage}
                                        alt="Random Image"
                                        style={{
                                            width: '100%',
                                            maxHeight: '420px',
                                            objectFit: "cover", //makes it zoom, not stretch
                                            marginTop: '16px',
                                        }}
                                        onClick={() => { console.log("image clicked") }}
                                    />
                                </Paper>

                                <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />

                                {/* Relevant Social Platforms */}
                                <Typography variant="h6" gutterBottom>Relevant Social Platforms</Typography>
                                <Grid container item direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                    {
                                        Object.entries(offer.socials).map((value, key) => {
                                            return value[1] ?
                                                <Grid item key={key}>
                                                    <Avatar src={`/assets/${value[0]}.png`} />
                                                </Grid> : null
                                        })
                                    }
                                </Grid>

                                <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />

                                {/* Description */}
                                <Typography variant="h6" gutterBottom>About This Offer</Typography>
                                <Typography>{offer.description}</Typography>

                            </Grid>

                            {/* RIGHT SIDE COLUMN */}
                            <Grid item xs={4}>
                                <Paper className={classes.paper}>
                                    {/* Searching for criteria */}
                                    <Typography variant="h6" color="secondary" gutterBottom>
                                        {offer.creatorName} is looking for:
                                    </Typography>

                                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} />

                                    <div className={classes.list}>
                                        <List component="nav" aria-label="main mailbox folders">
                                            {
                                                offer.criteria.map((item, key) =>
                                                    <ListItem button key={key}>
                                                        <ListItemIcon >
                                                            <DoneIcon color="secondary" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={item} />
                                                    </ListItem>
                                                )
                                            }
                                        </List>

                                    </div>

                                    {/* Apply Button */}
                                    {!alreadyApplied ?
                                        <Button
                                            onClick={() => { handleApply() }}
                                            variant="contained"
                                            color="primary">
                                            Apply for Offer
                                        </Button>
                                        :
                                        <Button
                                            onClick={() => { handleApply() }}
                                            variant="contained"
                                            color="secondary">
                                            Withdraw Application
                                        </Button>
                                    }


                                </Paper>

                                <Grid container item alignItems="center" justify="center"
                                    style={{ marginTop: '32px', width: '100%' }}>
                                    {/* Contact Sller Button */}
                                    <Button style={{ width: '100%' }}
                                        onClick={() => { console.log("Contacted") }}
                                        variant="outlined"
                                        color="secondary">
                                        Contact {offer.creator}
                                    </Button>
                                </Grid>

                            </Grid>

                        </Grid>
                    </div>
                </Container>
            </main>
        </React.Fragment>
    )
}

export async function getServerSideProps(context) {
    const id = context.query.id;
    let offer = null;
    let applicants = null;
    global.XMLHttpRequest = require("xhr2");

    initFirebase();
    let db = firebase.firestore();

    await db.collection('offers').doc(id) //can add WHERE clause here
        .get()
        .then((thisOfferDoc) => {
            if (thisOfferDoc.exists) {
                offer = thisOfferDoc.data();
            }
            else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            return thisOfferDoc
        })
        .then(async (thisOfferDoc) => {
            //Get Subcollection 'applicants'
            const applicantsRef = await thisOfferDoc.ref.collection('applicants').get();
            const applicantsData = applicantsRef.docs.map(doc => doc.data());
            console.log(applicantsData)
            applicants = applicantsData;
        })
        .catch((error) => { console.log("Error getting document:", error); })

    return {
        props: {
            offer: JSON.parse(JSON.stringify(offer)),
            applicants: JSON.parse(JSON.stringify(applicants))
        }
    };
}