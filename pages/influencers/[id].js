import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Header from '../../components/Header';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import initFirebase from '../../utils/auth/initFirebase';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import SocialMediaListItem from '../../components/SocialMediaListItem';

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
        //color: theme.palette.text.secondary,
    },
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        //marginRight: theme.spacing(7)
    },
}));

export default function Profile({ user }) {
    const classes = useStyles();
    const [userInformation] = useState(user)
    const [firebaseUserInformation, setUserInformation] = useState({})
    const [isUserSavedAlready, setIsUserSavedAlready] = useState(false)

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
                        setUserInformation(doc.data())
                        setIsUserSavedAlready(doc.data()["savedInfluencers"].filter(infl => infl.uid === "778oqKFK0zMjpDOCQ1Yjr9AQ4gS2").length > 0)
                    }
                })
            }
            else {
                setUserInformation = { type: "new" }
                console.log("Loading")
            }
        })
    }, [])
    //-----End Firebase--------//

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    const renderPlatform = (key, value) => {
        return (
            <SocialMediaListItem
                key={key}
                platformName={key}
                details={value} />
        )
    }

    const renderSaveButton = () => {
        if (!isUserSavedAlready) {
            return (
                <Button onClick={() => handleSaveClick()} variant="contained" color="secondary">
                    <FavoriteIcon style={{ marginRight: '16px' }} /> Save Influencer
                </Button>
            )
        }
        else { //User is saved already
            return (
                <Button onClick={() => handleSaveClick()} variant="contained" color="primary">
                    <FavoriteBorderIcon style={{ marginRight: '16px' }} /> Unsave Influencer
                </Button>
            )
        }
    }

    const handleSaveClick = () => {
        setIsUserSavedAlready(!isUserSavedAlready)
        console.log(isUserSavedAlready)
        console.log(firebaseUserInformation.uid) //us
        console.log(user.uid) //the influencer we want to save

        //handle firebase code
        initFirebase();
        let db = firebase.firestore();
        let userDoc = db.collection('users').doc(firebaseUserInformation.uid)

        if (!isUserSavedAlready) { //We're saving them
            userDoc.update({
                savedInfluencers: firebase.firestore.FieldValue.arrayUnion(user)
            })
                .then(() => console.log("Success"))
                .catch((error) => console.log("Error", error))
        }

        else { //We're removing them
            userDoc.update({
                savedInfluencers: firebase.firestore.FieldValue.arrayRemove(user)
            })
                .then(() => console.log("Success"))
                .catch((error) => console.log("Error", error))
        }
    }

    console.log(userInformation);
    return (
        <React.Fragment>
            <CssBaseline />
            <Header />

            <main>
                <Container className={classes.cardGrid} maxWidth="lg">
                    <Grid container spacing={4}>
                        <div className={classes.root}>
                            {/* Avatar and Name */}
                            <Grid container spacing={3}>
                                <Grid item xs={3} sm={3}>
                                    <Paper className={classes.paper}>
                                        <img src="https://source.unsplash.com/random"
                                            alt="Random Image"
                                            width="100%"
                                            style={{ marginBottom: '16px' }}
                                        />
                                        <Typography variant="h4" gutterBottom component="h1" color="primary">
                                            {userInformation.displayName}
                                        </Typography>
                                        <Divider style={{ marginBottom: "16px" }} />
                                        <Typography variant="h5" gutterBottom component="h2" color="inherit">
                                            <b>{userInformation.category}</b> Influencer
                                        </Typography>
                                        <Divider style={{ marginBottom: "16px" }} />
                                        <Typography variant="h5" gutterBottom component="h2" color="inherit">
                                            Located in <b>{capitalize(userInformation.region)}</b>
                                        </Typography>

                                    </Paper>
                                </Grid>

                                <Grid item xs={9} >
                                    <Paper className={classes.paper}>
                                        {/* Avatar and Name */}
                                        <Grid container direction="row" alignItems="center" justify="space-between" style={{ paddingBottom: '32px', paddingLeft: '32px' }} spacing={2}>
                                            <Grid container alignItems="center" direction="row" item xs={8}>
                                                <Avatar className={classes.large} alt="Cindy Baker" src={userInformation.photoURL ? userInformation.photoURL : null} />
                                                <Typography variant="h2" style={{ paddingLeft: '16px' }}>
                                                    {userInformation.displayName}
                                                </Typography>
                                            </Grid>
                                            <Grid container item xs={4}>
                                                {firebaseUserInformation.type == "Brand" ? renderSaveButton() : null}
                                            </Grid>
                                        </Grid>

                                        <Divider style={{ marginBottom: '32px' }} />

                                        {/* About */}
                                        <Grid container direction="column" alignItems="flex-start" spacing={2} style={{ marginBottom: '32px', paddingLeft: '32px' }}>
                                            <Typography variant="h6">About {userInformation.displayName}</Typography>
                                            <Typography>
                                                {userInformation.description}
                                            </Typography>
                                        </Grid>
                                        <Divider style={{ marginBottom: '24px' }} />
                                        {/* About */}
                                        <Grid container direction="column" alignItems="flex-start" spacing={2} style={{ paddingLeft: '32px' }}>
                                            <Typography variant="h6">{userInformation.displayName}'s Social Media Platforms</Typography>

                                        </Grid>

                                        {userInformation.detailedSmpInformation ?
                                            <Table size="medium" style={{ marginTop: '16px' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Platform</TableCell>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell>Followers</TableCell>
                                                        <TableCell>Following</TableCell>
                                                        <TableCell>Posts</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {
                                                        Object.entries(userInformation.detailedSmpInformation).map(([key, value]) => {
                                                            return (
                                                                renderPlatform(key, value)
                                                            )
                                                        })}
                                                </TableBody>
                                            </Table>

                                            : null //end check of generic
                                        }


                                    </Paper>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Container>
            </main>
        </React.Fragment>

    )
}

export async function getServerSideProps(context) {
    const id = context.query.id;
    let user = null;
    //-----Firebase------------//
    initFirebase();
    let db = firebase.firestore();

    await db.collection('users').doc(id).get()
        .then((thisUserDoc) => {
            if (thisUserDoc.exists) {
                user = thisUserDoc.data();
            }
            else {
                // doc.data() will be undefined in this case
                console.log("No such user!");
            }
        })
        .catch((error) => { console.log("Error getting document:", error); })
    //-----End Firebase--------//

    console.log(user);
    return {
        props: {
            user: JSON.parse(JSON.stringify(user))
        }
    };
}