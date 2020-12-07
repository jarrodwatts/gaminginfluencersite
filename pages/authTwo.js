import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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


export default function AuthTwo() {
    const classes = useStyles();
    const [user, setUser] = useState(null);
    const [stage, setStage] = useState("Loading");
    const [region, setRegion] = React.useState('');
    const [gender, setGender] = React.useState('');

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
                router.push('/profile');
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
        initFirebase();
        let db = firebase.firestore();
        var userDocumentRef = db.collection("users").doc(user.uid);
        const { displayName, description } = data;
        try {
            await userDocumentRef.update({
                displayName,
                description,
                region,
                gender,
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
                <React.Fragment>
                    <CssBaseline />
                    {/* <Header /> */}
                    <main>
                        <Container className={classes.cardGrid} maxWidth="lg">

                            <Typography variant="h3" gutterBottom>
                                What best describes you?
                            </Typography>

                            <Grid container className={classes.root} spacing={2}>
                                <Grid item xs={12}>
                                    <Grid container justify="center" spacing={2} direction="row" alignItems="center">
                                        {["Influencer", "Brand"].map((value, key) => (
                                            <Grid item key={key} >
                                                <Paper className={classes.paper} elevation={3} onClick={() => { writeTypeToDatabase(user.uid, value) }}>
                                                    <Grid container direction="column">
                                                        <img src="https://source.unsplash.com/random"
                                                            alt="Random Image"
                                                            height="90%"
                                                            width="100%"
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
                </React.Fragment>
            )

        case 2:
            return (
                <React.Fragment>
                    <CssBaseline />
                    {/* <Header /> */}
                    <main>
                        <Container className={classes.cardGrid} maxWidth="lg">

                            <Typography variant="h3" gutterBottom>
                                Doing great...
                            </Typography>

                            <Grid container direction="column" alignItems="center">
                                {/* Map each thing to a row and a textbox for them to enter their details */}
                                <form onSubmit={handleSubmit(onSubmitStageTwo)} className={classes.form}>
                                    <Container className={classes.cardGrid} maxWidth="lg">
                                        <Grid container direction="column" alignItems="center" justify="center">

                                            {/* About You */}
                                            <Typography variant="h5" color="secondary" gutterBottom><b>About You</b></Typography>
                                            <Grid container item style={{ marginBottom: '16px' }} spacing={4} alignItems="center">
                                                <Grid item><Typography variant="h6">1. What name (or Gamertag) do you go by?</Typography></Grid>
                                                <Grid item><TextField type="text" label="Display Name" name="displayName" inputRef={register} /></Grid>
                                            </Grid>

                                            <Grid container item style={{ marginBottom: '32px' }} spacing={4} alignItems="center" justify="space-between">
                                                <Grid item><Typography variant="h6">2. What gender do you identify as?</Typography></Grid>
                                                <Grid item style={{ width: '45%' }}>
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
                                                        <MenuItem value={"other"}>Other</MenuItem>

                                                    </Select>
                                                </Grid>
                                            </Grid>

                                            <Grid container item style={{ marginBottom: '32px' }} spacing={4} alignItems="center" justify="space-between">
                                                <Grid item><Typography variant="h6">3. Which Region are you located?</Typography></Grid>
                                                <Grid item style={{ width: '47.5%' }}>
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
                                                </Grid>
                                            </Grid>

                                            <Grid container item spacing={4} alignItems="center">
                                                <Grid item><Typography variant="h6">4. How would you describe yourself?</Typography></Grid>
                                            </Grid>
                                            <Grid item style={{ width: '100%', paddingBottom: '32px' }}><TextField type="text" multiline label="Description" name="description" inputRef={register} style={{ width: '100%' }} /></Grid>

                                        </Grid>

                                        <Grid container item justify="center">
                                            <Button variant="contained" color="secondary" type="submit" style={{ marginLeft: '8px' }}>Continue</Button>
                                        </Grid>
                                    </Container>
                                </form>
                            </Grid>
                        </Container>
                    </main>
                </React.Fragment>
            )

        case 3:
            return (
                <React.Fragment>
                    <CssBaseline />
                    {/* <Header /> */}
                    <main>
                        <Container className={classes.cardGrid} maxWidth="lg">

                            <Typography variant="h3" gutterBottom>
                                Almost there <b>{username}</b>...
                            </Typography>

                            <Grid container direction="column" alignItems="center">
                                {/* Map each thing to a row and a textbox for them to enter their details */}

                                <Container maxWidth="sm">
                                    <form onSubmit={handleSubmit(onSubmitStageThree)} className={classes.form}>
                                        <Typography variant="h5" color="primary" gutterBottom><b>Your Social Media</b></Typography>

                                        {/* Socials */}
                                        {socials.map((item, key) =>
                                            <Grid key={key} container item direction="row" spacing={4} alignItems="center" style={{ marginBottom: '8px', marginTop: '16px' }}>
                                                <Grid container item direction="row" alignItems="center" justify="space-between" >
                                                    <Grid item >
                                                        <Avatar src={`/assets/${item}.png`} style={{ marginRight: '8px', marginBottom: '2px' }} />
                                                        <Typography variant="button"><b>{item}</b></Typography>
                                                    </Grid>
                                                    <Grid item style={{ width: '80%' }}><TextField style={{ width: '100%' }} type="text" label={`${item} Username`} name={item} inputRef={register} /></Grid>
                                                </Grid>
                                            </Grid>
                                        )}

                                        <Grid container item justify="center">
                                            <Button variant="contained" color="secondary" type="submit" style={{ marginLeft: '8px' }}>Lets Go</Button>
                                        </Grid>
                                    </form>
                                </Container>
                            </Grid>
                        </Container>
                    </main>
                </React.Fragment>
            )
        case "Loading":
            // TODO: Put a loading screen in here 
            return (
                <React.Fragment>
                    <CssBaseline />
                </React.Fragment>
            )
    }

}