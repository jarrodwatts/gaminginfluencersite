import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import initFirebase from '../utils/auth/initFirebase';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useRouter } from 'next/router'
import Router from 'next/router'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 340,
        width: 300,
    },
    cardGrid: {
        marginTop: theme.spacing(4)
    }
}));

async function writeTypeToDatabase(userId, userType) {
    initFirebase();
    let db = firebase.firestore();
    var userDocumentRef = db.collection("users").doc(userId);
    // Set the "type" field of the value userType
    try {
        await userDocumentRef.update({
            type: userType
        });
        console.log("Document successfully updated!");
        Router.push('/profile')
    }
    catch (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    }
}


export default function AuthTwo() {
    const classes = useStyles();
    const [username, setUsername] = useState(null);
    const [user, setUser] = useState(null);
    const router = useRouter();

    //Get current user and set username
    initFirebase();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            setUsername(user.displayName.toString());
            setUser(user);
        } else {
            return 'loading'
        }
    });

    return (
        <React.Fragment>
            <CssBaseline />
            {/* <Header /> */}
            <main>
                <Container className={classes.cardGrid} maxWidth="lg">

                    <Typography variant="h3" gutterBottom>
                        <b>{username}</b>, what best describes you?
                    </Typography>

                    <Grid container className={classes.root} spacing={2}>
                        <Grid item xs={12}>
                            <Grid container justify="center" spacing={2} direction="row" alignItems="center">
                                {["Influencer", "Brand"].map((value, key) => (
                                    <Grid item key={key} >
                                        <Paper className={classes.paper} elevation={3}>
                                            <Grid container direction="column">
                                                <img src="https://source.unsplash.com/random"
                                                    alt="Random Image"
                                                    height="90%"
                                                    width="100%"
                                                    onClick={() => { writeTypeToDatabase(user.uid, value) }}
                                                />

                                                <Button variant="contained" color="secondary">
                                                    {value}
                                                </Button>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </main>

            {/* <Footer /> */}

        </React.Fragment>
    )
}