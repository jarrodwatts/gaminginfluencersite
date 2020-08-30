import React, { useState } from 'react';
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


export default function Offer({ offer }) {
    const classes = useStyles();
    const [offerImage, setOfferImage] = React.useState(null)

    //Now get the image
    if (offer) {
        initFirebase();
        let storage = firebase.storage();
        let pathReference = storage.ref(`offers/${offer.id}.png`);

        pathReference.getDownloadURL()
            .then((url) => {
                setOfferImage(url);
            })
            .catch((error) => {
                // Handle any errors
                console.log(error);
            });
    }

    console.log(offer)
    console.log(offerImage);
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

                                {/* Image */}
                                <Paper className={classes.paper}>
                                    <img src={offerImage}
                                        alt="Random Image"
                                        style={{
                                            width: '100%',
                                            maxHeight: '420px',
                                            objectFit: "cover", //makes it zoom, not stretch
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

                                    <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                                        <Typography>
                                            We're looking for gamers who play competitive games like poo poo
                                        </Typography>
                                    </div>

                                    <Divider />

                                    <div className={classes.list}>
                                        <List component="nav" aria-label="main mailbox folders">
                                            <ListItem button>
                                                <ListItemIcon >
                                                    <DoneIcon color="secondary" />
                                                </ListItemIcon>
                                                <ListItemText primary="Streamers" />
                                            </ListItem>
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <DoneIcon color="secondary" />
                                                </ListItemIcon>
                                                <ListItemText primary="Women" />
                                            </ListItem>
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <DoneIcon color="secondary" />
                                                </ListItemIcon>
                                                <ListItemText primary="1000+ Twitch Followers" />
                                            </ListItem>

                                        </List>

                                    </div>

                                    {/* Apply Button */}
                                    <Button
                                        onClick={() => { console.log("Applied") }}
                                        variant="contained"
                                        color="secondary">
                                        Apply for Offer
                                    </Button>

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
    let image = null;
    global.XMLHttpRequest = require("xhr2");
    //-----Firebase------------//
    //useEffect(() => {
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
        })
        .catch((error) => { console.log("Error getting document:", error); })

    //}, [])
    //-----End Firebase--------//
    return {
        props: {
            offer: JSON.parse(JSON.stringify(offer)),
        }
    };
}