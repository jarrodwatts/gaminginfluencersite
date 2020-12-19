import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import initFirebase from '../utils/auth/initFirebase';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form';
import getUser from '../utils/auth/getUser';
import { capitalize, displayRegion, capitalizeFirstLetter } from '../utils/helperFunctions/stringFormatting';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        width: '100vw',
    },
    paperTwo: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        width: theme.spacing(86), // 688 (86*8)
        height: theme.spacing(64), // 512 (64*8)
    },
    cardGrid: {
        marginTop: theme.spacing(4)
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },

    hiddenPaper: {
        paddint: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    }
}));


export default function Setup() {
    const classes = useStyles();
    const [user, setUser] = useState(null);
    const [stage, setStage] = useState("Loading");
    const [region, setRegion] = useState('');
    const [gender, setGender] = useState('');

    const router = useRouter();
    //React Forms
    const { register, handleSubmit, errors } = useForm();

    const onSubmitStageTwo = data => saveUserStageTwo(data)
    const onSubmitStageThree = data => saveUserStageThree(data)

    if (errors.length > 0) { console.log(errors); }

    const socials = ["twitch", "youtube", "instagram", "twitter", "facebook", "medium"];
    initFirebase();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            const res = await getUser(user);
            setUser(res);
            console.log(res)
            if (res?.type) {
                console.log(res.type)
                // TODO: UNCOMMENT THIS
                router.push('/profile');

                // TODO: DELTE THIS
                //setStage(3)
            }
            else {
                setStage(1)
            }
        });
    }, []);

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
            setStage(2)
            // Router.push('/profile')
        }
        catch (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        }
    }

    async function saveUserStageTwo(data) {
        console.log(data);
        initFirebase();
        let db = firebase.firestore();
        var userDocumentRef = db.collection("users").doc(user.uid);
        const { displayName, email } = data; // Destructure form results into vars

        try {
            await userDocumentRef.update({
                displayName,
                region,
                gender,
                email,
            })
                .then(() => setStage(3))
            console.log("Document successfully updated!");
        }
        catch (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        }
    }

    async function saveUserStageThree(data) {
        initFirebase();
        let db = firebase.firestore();
        var userDocumentRef = db.collection("users").doc(user.uid);
        // Set the "type" field of the value userType
        try {
            await userDocumentRef.update({
                //displayName and description
                socialMediaPlatforms: {
                    twitch: data.twitch,
                    facebook: data.facebook,
                    instagram: data.instagram,
                    medium: data.medium,
                    youtube: data.youtube,
                    twitter: data.twitter,
                }
            })
                .then(() => {
                    //Navigate to Profile
                    console.log("saved")
                    router.push('/profile')
                })
        }
        catch (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        }
    }

    const handleChangeRegion = (event) => {
        setRegion(event.target.value)
    };

    const handleChangeGender = (event) => {
        setGender(event.target.value)
    };

    switch (stage) {
        case 1:
            return (
                <Fade in={true}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingTop: '10%', paddingBottom: '10%' }}>
                        <Paper style={{ height: '100%', width: '50%', paddingTop: '16px' }}>

                            <Grid container spacing={1} alignItems="center" justify="center">

                                <Grid container direction="column" alignItems="center" justify="flex-start" item xs={12} spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant="h3">👋 Hey {user?.displayName ? user.displayName : "there!"}</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography style={{ marginTop: '4px' }}>Let's get to know you...</Typography>
                                    </Grid>
                                    <Divider style={{ "width": '45%', marginTop: '12px', }} />
                                    <Grid item xs={false} display={{ xs: 'none' }}>
                                        <Typography variant="h5" style={{ marginTop: '8px' }}>What would you like to sign up as?</Typography>
                                    </Grid>
                                </Grid>

                                <Grid container direction="row" item xs={12} spacing={3} style={{ marginTop: '8px' }} >
                                    <Grid item xs={6} elevation={6}>
                                        <Paper className={classes.paper}>
                                            <img src="/assets/Brand.jpg"
                                                style={{ objectFit: 'cover', width: '100%', maxHeight: '250px', height: 'auto' }}
                                            />
                                            <Button
                                                style={{ width: '100%' }}
                                                variant="contained"
                                                color="primary"
                                                onClick={() => { writeTypeToDatabase(user.uid, "Brand") }}>
                                                Brand
                                            </Button>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6} elevation={6}>
                                        <Paper className={classes.paper}>
                                            <img src="/assets/Influencer.jpg"
                                                style={{ objectFit: 'cover', width: '100%', maxHeight: '250px', height: 'auto' }}
                                            />
                                            <Button
                                                style={{ width: '100%' }}
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => { writeTypeToDatabase(user.uid, "Influencer") }}>
                                                Influencer
                                            </Button>
                                        </Paper>
                                    </Grid>

                                </Grid>

                            </Grid>
                        </Paper>
                    </div>
                </Fade>
            )

        case 2:
            return (

                <Fade in={true}>
                    <form onSubmit={handleSubmit(onSubmitStageTwo)} className={classes.form}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingTop: '10%', paddingBottom: '10%' }}>

                            <Paper style={{ height: '70%', width: '50%', paddingTop: '16px' }}>
                                <Grid container spacing={1} alignItems="center" justify="center">

                                    <Grid container direction="column" alignItems="center" justify="center" item xs={12} spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant="h3">👋 Hey {user.displayName ? user.displayName : "there!"}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography style={{ marginTop: '4px' }}>A few more details would be great! 😜</Typography>
                                        </Grid>

                                        {/* Display Name */}
                                        <Grid container direction="row" alignItems="flex-end" justify="flex-end" item xs={12} spacing={3}>
                                            <Grid item xs={6}>
                                                <Paper className={classes.hiddenPaper} elevation={0}> {/* HACK: using Paper elveation 0 to fucking center stuff zz */}
                                                    <Typography variant="h6">Display Name: </Typography>
                                                </Paper>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Paper className={classes.hiddenPaper} elevation={0}>
                                                    <TextField
                                                        type="text"
                                                        label="Display Name"
                                                        name="displayName"
                                                        inputRef={register}
                                                        style={{ width: '99%' }}
                                                    />
                                                </Paper>
                                            </Grid>
                                        </Grid>

                                        {/* Gender */}
                                        <Grid container direction="row" alignItems="flex-end" justify="flex-end" item xs={12} spacing={3} style={{ marginTop: '16px' }}>
                                            <Grid item xs={6}>
                                                <Paper className={classes.hiddenPaper} elevation={0}>
                                                    <Typography variant="h6">Gender: </Typography>
                                                </Paper>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Paper className={classes.hiddenPaper} elevation={0}>
                                                    <Select style={{ width: '100%' }}
                                                        labelId="demo-simple-select-placeholder-label-label"
                                                        id="demo-simple-select-placeholder-label"
                                                        value={gender}
                                                        onChange={handleChangeGender}
                                                        name="gender"
                                                        inputRef={register}
                                                    >
                                                        <MenuItem value={"male"}>Male</MenuItem>
                                                        <MenuItem value={"female"}>Female</MenuItem>
                                                        <MenuItem value={"other"}>Non-Conforming</MenuItem>

                                                    </Select>
                                                </Paper>

                                            </Grid>
                                        </Grid>

                                        {/* Region */}
                                        <Grid container direction="row" alignItems="flex-end" justify="flex-end" item xs={12} spacing={3} style={{ marginTop: '24px' }}>
                                            <Grid item xs={6}>
                                                <Paper className={classes.hiddenPaper} elevation={0}>
                                                    <Typography variant="h6">Region: </Typography>
                                                </Paper>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Paper className={classes.hiddenPaper} elevation={0}>
                                                    <Select style={{ width: '100%' }}
                                                        labelId="demo-simple-select-placeholder-label-label"
                                                        id="demo-simple-select-placeholder-label"
                                                        value={region}
                                                        onChange={handleChangeRegion}
                                                        name="region"
                                                        inputRef={register}
                                                    >
                                                        <MenuItem value={"africa"}>Africa</MenuItem>
                                                        <MenuItem value={"asia"}>Asia</MenuItem>
                                                        <MenuItem value={"europe"}>Europe</MenuItem>
                                                        <MenuItem value={"northAmerica"}>North America</MenuItem>
                                                        <MenuItem value={"oceania"}>Oceania</MenuItem>
                                                        <MenuItem value={"southAmerica"}>South America</MenuItem>
                                                        <MenuItem value={"other"}>Other</MenuItem>

                                                    </Select>
                                                </Paper>
                                            </Grid>
                                        </Grid>

                                        {/* Contact Email */}
                                        <Grid container direction="row" alignItems="flex-end" justify="flex-end" item xs={12} spacing={3} style={{ marginTop: '8px' }}>
                                            <Grid item xs={6}>
                                                <Paper className={classes.hiddenPaper} elevation={0}>
                                                    <Typography variant="h6">Contact Email: </Typography>
                                                </Paper>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Paper className={classes.hiddenPaper} elevation={0}>
                                                    <TextField
                                                        type="text"
                                                        label="Email Address"
                                                        name="email"
                                                        inputRef={register}
                                                        defaultValue={user?.email}
                                                        style={{ width: '99%' }}
                                                    />
                                                </Paper>
                                            </Grid>
                                        </Grid>

                                        <Button variant="contained" color="secondary" type="submit" style={{ marginLeft: '8px', marginTop: '32px' }}>Continue</Button>

                                    </Grid>
                                </Grid>
                            </Paper>
                        </div>
                    </form>
                </Fade>
            )

        case 3:
            return (
                <Fade in={true}>
                    <form onSubmit={handleSubmit(onSubmitStageThree)} className={classes.form}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', paddingTop: '10%', paddingBottom: '10%' }}>

                            <Paper style={{ height: '100%', width: '50%', paddingTop: '16px' }}>
                                <Grid container spacing={1} alignItems="center" justify="center">

                                    <Grid container direction="column" alignItems="center" justify="center" item xs={12} spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant="h3">So, {user.displayName ? user.displayName : "there!"}</Typography>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Typography style={{ marginTop: '4px' }}>Where can we find you on your socials? 👀</Typography>
                                        </Grid>
                                        <Grid item xs={12} style={{ marginBottom: '16px' }}>
                                            <Typography style={{ marginTop: '4px' }}>Just the username ... (not the link) 🤫</Typography>
                                        </Grid>

                                        {/* Socials */}
                                        {socials.map((item, key) =>
                                            <Grid key={key} container item direction="row" spacing={4} alignItems="center" style={{ marginBottom: '8px', }}>
                                                <Grid container item direction="row" alignItems="center" justify="center" spacing={3}>
                                                    <Grid container item direction="column" alignItems="center" xs={2}>
                                                        <Grid item>
                                                            <Avatar src={`/assets/${item}.png`} style={{ marginRight: '8px', marginBottom: '2px' }} />
                                                        </Grid>
                                                        {/* <Grid item>
                                                            <Typography variant="subtitle1"><b>{capitalizeFirstLetter(item)}</b></Typography>
                                                        </Grid> */}
                                                    </Grid>
                                                    <Grid item xs={6} ><TextField style={{ width: '100%' }} type="text" label={`${capitalize(item)} Username`} name={item} inputRef={register} /></Grid>
                                                </Grid>
                                            </Grid>
                                        )}

                                        <Button variant="contained" color="primary" type="submit" style={{ marginLeft: '8px', marginTop: '16px' }}>Let's Go!</Button>

                                    </Grid>
                                </Grid>
                            </Paper>
                        </div>
                    </form>
                </Fade>
            )
        case "Loading":
            // TODO: Put a loading screen in here
            return (
                <React.Fragment>
                    <CssBaseline />
                    <p> loading...</p>
                </React.Fragment>
            )
    }

}