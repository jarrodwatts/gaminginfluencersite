import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import NavBar from '../components/Header';
import Footer from '../Components/Footer';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import initFirebase from '../utils/auth/initFirebase';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const useStyles = makeStyles((theme) => ({

    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

export default function Profile() {
    const classes = useStyles();
    const [editMode, setEditMode] = useState(false);
    const [userInformation, setUserInformation] = useState({})

    //-----Firebase------------//

    useEffect(() => {
        initFirebase();
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                //now ask for user info
                let db = firebase.firestore();
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
        });
    }, [])

    //-----End Firebase--------//

    console.log(userInformation);
    return (
        <React.Fragment>
            <CssBaseline />
            <NavBar />

            <main>
                <Container className={classes.cardGrid} maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid container direction="row" justify="flex-end" style={{ marginBottom: '16px' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => { setEditMode(true); }}>
                                Edit Profile
                            </Button>
                        </Grid>

                        <div className={classes.root}>
                            {/* Avatar and Description */}
                            <Grid container spacing={3}>
                                <Grid item xs={3} sm={3}>
                                    <Paper className={classes.paper}>
                                        <img src="https://source.unsplash.com/random"
                                            alt="Random Image"
                                            width="100%"
                                        />
                                    </Paper>
                                </Grid>

                                <Grid item xs={9} >
                                    <Paper className={classes.paper}>
                                        <Box style={{ paddingBottom: '32px' }}>
                                            <Typography>
                                                <b>{userInformation.displayName}</b>
                                            </Typography>
                                        </Box>

                                        <Typography>
                                            test
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Social Platforms */}
                            <Grid container direction="row" spacing={3}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <Box style={{ paddingBottom: '32px' }}><Typography><b>Social Media Platforms</b></Typography></Box>

                                        {/* .map the social platforms  */}
                                        <Grid container direction="row" spacing={3} justify="space-around" alignItems="center" >
                                            <Avatar alt="Remy Sharp" src="/assets/twitch.png" />
                                            <Typography>Name</Typography>
                                            <Typography>Data 1</Typography>
                                            <Typography>Data 2</Typography>
                                            <Typography>Data 3</Typography>
                                        </Grid>

                                        <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />

                                    </Paper>
                                </Grid>
                            </Grid>

                            {/* Twitch Embed */}
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>Twitch Embeds?</Paper>
                                    {/* .map the social platforms  */}
                                </Grid>
                            </Grid>

                            {/* Instagram */}
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>Instagram posts?</Paper>
                                    {/* .map the social platforms  */}
                                </Grid>
                            </Grid>

                            {/* etc... */}

                        </div>
                    </Grid>
                </Container>
            </main>

            <Footer />

        </React.Fragment>
    )
}