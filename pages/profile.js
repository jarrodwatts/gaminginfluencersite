import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import NavBar from '../components/Header';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import initFirebase from '../utils/auth/initFirebase';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic'

const Footer = dynamic(() => import('../Components/Footer'))

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
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    }
}));



export default function Profile() {
    const classes = useStyles();
    const [editMode, setEditMode] = useState(false);
    const [userInformation, setUserInformation] = useState({})

    //Form Editor
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = data => saveUser(data)
    if (errors.length > 0) { console.log(errors); }

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

    async function saveUser(data) {
        console.log(data);
        console.log("saved")
        initFirebase();
        let db = firebase.firestore();
        var userDocumentRef = db.collection("users").doc(userInformation.uid);
        // Set the "type" field of the value userType
        try {
            await userDocumentRef.update(JSON.parse(JSON.stringify(data)));
            console.log("Document successfully updated!");
        }
        catch (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        }

        setEditMode(false);
    }

    return (
        !editMode ?
            (
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
                                                <Grid container direction="row" alignItems="center" justify="center" style={{ paddingBottom: '32px' }} spacing={2}>
                                                    <Avatar alt="Cindy Baker" src={userInformation.photoURL ? userInformation.photoURL : null} />
                                                    <Typography style={{ paddingLeft: '16px' }}>
                                                        <b>{userInformation.displayName}</b>
                                                    </Typography>
                                                </Grid>

                                                <Typography>
                                                    {userInformation.description}
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
            :
            <React.Fragment>
                <CssBaseline />
                <NavBar />

                <main>
                    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>

                        <Container className={classes.cardGrid} maxWidth="lg">
                            <Grid container direction="column" alignItems="center" justify="center">

                                {/* About You */}
                                <Typography color="primary" variant="h5" gutterBottom>About You</Typography>
                                <Grid item style={{ marginBottom: '32px' }}>
                                    <TextField type="text" label="Display Name" name="displayName" defaultValue={userInformation.displayName ? userInformation.displayName : null} inputRef={register} />
                                    <TextField type="text" label="Your Description" name="description" defaultValue={userInformation.description ? userInformation.description : null} inputRef={register} multiline />
                                </Grid>

                                {/* Social Media Platforms */}
                                <Typography color="primary" variant="h5" gutterBottom>Social Media Links</Typography>
                                <Grid item >
                                    <TextField type="text" label="Twitch Username" name="socialMediaPlatforms.twitch" defaultValue={userInformation.socialMediaPlatforms.twitch ? userInformation.socialMediaPlatforms.twitch : null} inputRef={register} />
                                    <TextField type="text" label="YouTube Username" name="socialMediaPlatforms.youtube" defaultValue={userInformation.socialMediaPlatforms.youtube ? userInformation.socialMediaPlatforms.youtube : null} inputRef={register} />
                                </Grid>
                                <Grid item>
                                    <TextField type="text" label="Twitter Username" name="socialMediaPlatforms.twitter" defaultValue={userInformation.socialMediaPlatforms.twitter ? userInformation.socialMediaPlatforms.twitter : null} inputRef={register} />
                                    <TextField type="text" label="Facebook Username" name="socialMediaPlatforms.facebook" defaultValue={userInformation.socialMediaPlatforms.facebook ? userInformation.socialMediaPlatforms.facebook : null} inputRef={register} />
                                </Grid>
                                <Grid item>
                                    <TextField type="text" label="Instagram Username" name="socialMediaPlatforms.instagram" defaultValue={userInformation.socialMediaPlatforms.instagram ? userInformation.socialMediaPlatforms.instagram : null} inputRef={register} />
                                    <TextField type="url" label="Blog Url" name="socialMediaPlatforms.blog" defaultValue={userInformation.socialMediaPlatforms.blog ? userInformation.socialMediaPlatforms.blog : null} inputRef={register} />
                                </Grid>
                                <Grid item style={{ marginBottom: '32px' }}>
                                    <TextField type="text" label="TikTok Username" name="socialMediaPlatforms.tiktok" defaultValue={userInformation.socialMediaPlatforms.tiktok ? userInformation.socialMediaPlatforms.tiktok : null} inputRef={register} />
                                </Grid>

                                <Grid item container direction="row" spacing={3} justify="center" alignItems="center">
                                    <Button variant="outlined" color="secondary" style={{ marginRight: '8px' }} onClick={() => setEditMode(false)}>Cancel</Button>
                                    <Button variant="contained" color="secondary" type="submit" style={{ marginLeft: '8px' }}>Save</Button>
                                </Grid>

                            </Grid>
                        </Container>
                    </form>
                </main>

            </React.Fragment>
    )
}