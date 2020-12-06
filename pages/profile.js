import React, { useState, useMemo, useEffect, useCallback } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import NavBar from '../components/Header';
import SocialIcon from '../components/SocialIcon';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import initFirebase from '../utils/auth/initFirebase';
import { Divider } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import { useDropzone } from 'react-dropzone';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { useForm } from 'react-hook-form';
import getImage from '../utils/helperFunctions/getImage';
import Tabs from '@material-ui/core/Tabs';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tab from '@material-ui/core/Tab';
import { capitalize, convertCreationTime } from '../utils/helperFunctions/stringFormatting';

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
    },
    large: {
        width: theme.spacing(24),
        height: theme.spacing(24),
    },
}));

//---Start Drag n Drop---\\
const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};
const activeStyle = {
    borderColor: '#2196f3'
};
const acceptStyle = {
    borderColor: '#00e676'
};
const rejectStyle = {
    borderColor: '#ff1744'
};



export default function Profile() {
    const classes = useStyles();
    const [editMode, setEditMode] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [userInformation, setUserInformation] = useState({})
    const [value, setValue] = useState(0);
    const [image, setImage] = useState(null);
    const [saving, setSaving] = useState(false);
    const [userImage, setUserImage] = useState(null)

    function StyledDropzone() {

        const onDrop = useCallback((acceptedFiles) => {
            acceptedFiles.forEach((file) => {
                setFilePreview(acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })));

                const reader = new FileReader()

                reader.onabort = () => console.log('file reading was aborted')
                reader.onerror = () => console.log('file reading has failed')
                reader.onload = () => {
                    // Do whatever you want with the file contents
                    const binaryStr = reader.result
                    console.log(binaryStr)
                    //Set the var for state for later
                    setImage(binaryStr);
                }
                reader.readAsArrayBuffer(file)
            })

        }, [])

        const {
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject
        } = useDropzone({ onDrop, accept: 'image/*' });

        const style = useMemo(() => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {})
        }), [
            isDragActive,
            isDragReject,
            isDragAccept
        ]);

        return (
            <div className="container">
                <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <Typography>Drag 'n' drop your image here, or click to select a file</Typography>
                </div>
            </div>
        );
    }
    //---End Drag n Drop---\\

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //Form Editor
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = data => saveUser(data)
    if (errors.length > 0) { console.log(errors); }

    //-----Firebase------------//
    useEffect(() => {
        const fetchImage = async (img) => {
            console.log("Fetching", img)
            const res = await getImage(img)
            setUserImage(res);
        }

        initFirebase();
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                let db = firebase.firestore();
                const userDoc = db.collection('users').doc(user.uid);
                const userDocGet = await userDoc.get();

                if (userDocGet.exists) {
                    const userDocData = userDocGet.data();
                    console.log("userDocData", userDocData)
                    setUserInformation(userDocData)
                    return fetchImage(userDocData.image)
                }

            }
            else {
                setUserInformation({})
                console.log("Loading")
            }
        });

    }, [])
    //-----End Firebase--------//

    async function saveUser(data) {
        console.log("Data:", data);
        initFirebase();
        let db = firebase.firestore();
        var userDocumentRef = db.collection("users").doc(userInformation.uid);
        setSaving(true)

        const updateUserInfo = async (existingDocRef) => {

        }

        try {
            await userDocumentRef.update(JSON.parse(JSON.stringify(data)));
            console.log("Document successfully updated!");
            //Image upload
            let storage = firebase.storage();
            let file = image;
            let storageRef = storage.ref();
            let imagesRef = storageRef.child('users');
            let usersRef = imagesRef.child(`/${userInformation.uid}.png`);
            let existingDocRef = db.collection("users").doc(userInformation.uid);
            
            if (image) {
                usersRef.put(file)
                    .then(async () => {
                        console.log("Uploaded profile picture")
                        await existingDocRef.update({
                            image: `users/${userInformation.uid}`,
                            id: userInformation.uid //probably not required
                        });
                        console.log("Updated image field");
                    })

                    
            }

            //Perform an update on the document
            await existingDocRef.update({
                description: data.description,
                displayName: data.displayName,
                socialMediaPlatforms: data.socialMediaPlatforms,
            })

            setSaving(false);
            return setEditMode(false);

        }
        catch (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        }
    }

    console.log("user image:", userImage)
    return (
        !editMode ?
            (
                <React.Fragment>
                    <CssBaseline />
                    <NavBar />

                    <main>
                        <Container className={classes.cardGrid} maxWidth="lg">
                            <Grid container alignItems="center" justify="center" style={{ marginBottom: '64px' }}>
                                <Grid container direction="row" justify="flex-end" style={{ marginBottom: '16px' }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => { setEditMode(true); }}>
                                        Edit Profile
                                    </Button>
                                </Grid>

                                <img src={userImage}
                                    alt="Random Image"
                                    height="280px"
                                    width="100%"
                                    style={{ marginBottom: '16px', backgroundSize: 'cover', objectFit: 'cover', }} // makes it zoom, not stretch
                                />

                                <Avatar src={userImage}
                                    style={{
                                        position: 'absolute',
                                        bottom: '45%',
                                        borderStyle: 'solid',
                                        borderWidth: '5px',
                                        borderColor: "#556cd6", //primary
                                    }} className={classes.large} />

                            </Grid>

                            <Grid container alignItems="center" justify="center" direction="column" style={{ marginBottom: '32px' }}>
                                {/* Name */}
                                <Typography variant="h3">{userInformation.displayName}</Typography>
                                {/* Bio / Description */}
                                <Typography variant="h5">{userInformation.description}</Typography>

                            </Grid>
                            <Divider style={{ marginBottom: '16px' }} />
                            <Grid container alignItems="center" justify="center" direction="column" style={{ marginBottom: '16px' }}>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                >
                                    <Tab label="Overview" />
                                    <Tab label="Social Media" />
                                    <Tab label="Contact" />
                                </Tabs>
                            </Grid>

                            <Container maxWidth="md">
                                <Grid container justify="space-between" alignItems="center" direction="row" spacing={3}>
                                    {/* Overview */}
                                    {value == 0 ?
                                        <React.Fragment>
                                            <Grid item xs={4}>
                                                <Grid item>
                                                    <Grid container item direction="row">
                                                        <Grid item>
                                                            <RoomIcon color="primary" style={{ marginRight: '4px' }} />
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography>From <b>{capitalize(userInformation?.region)}</b></Typography>
                                                        </Grid>
                                                    </Grid>

                                                    <Grid container item direction="row">
                                                        <Grid item>
                                                            <EmojiPeopleIcon color="primary" style={{ marginRight: '4px' }} />
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography>Member Since  <b>{convertCreationTime(userInformation?.metadata?.creationTime)}</b></Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Divider orientation="vertical" flexItem />

                                            <Grid item xs={7}>
                                                <Grid container direction="row" justify="space-between" alignItems="center" spacing={2}>
                                                    <Grid item >
                                                        what values they uphold and why a brand would use them
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </React.Fragment>
                                        : null}

                                    {/* Socials */}
                                    {value == 1 ?
                                        <React.Fragment>
                                            <Container maxWidth="sm">
                                                <Grid container direction="row" justify="space-between" alignItems="center" spacing={2}>
                                                    <Grid item xs={5}>
                                                        <Grid container item direction="column" alignItems="center" spacing={1}>
                                                            {Object.entries(userInformation?.socialMediaPlatforms).map((item, key) =>
                                                                item[1] ? //Is there a value of the entry?
                                                                    <React.Fragment key={key}>
                                                                        <Grid container item direction="row" alignItems="center" spacing={3}>
                                                                            <Grid item>
                                                                                <SocialIcon platformName={item[0]} />
                                                                            </Grid>

                                                                            <Grid item>
                                                                                <Typography>{capitalize(item[1])}</Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                        <Divider style={{ "width": '45%' }}></Divider>
                                                                    </React.Fragment>

                                                                    : null
                                                            )}

                                                        </Grid>
                                                    </Grid>

                                                    <Divider orientation="vertical" flexItem />

                                                    <Grid item xs={6}>
                                                        how they use their social media platforms to appeal to their audience
                                                    </Grid>
                                                </Grid>
                                            </Container>
                                        </React.Fragment>

                                        : null}

                                    {/* Contact */}
                                    {value == 2 ?
                                        <React.Fragment>
                                        </React.Fragment>

                                        : null}
                                </Grid>
                            </Container>

                        </Container>
                    </main>

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

                                {/* Cover Photo */}
                                <Typography color="primary" variant="h5" gutterBottom>Profile Image</Typography>
                                <Grid item style={{ marginBottom: '32px' }}>
                                    {filePreview ?
                                        <img
                                            src={filePreview[0].preview}
                                            style={{
                                                maxHeight: '200px'
                                            }}
                                        /> :
                                        <StyledDropzone />
                                    }
                                </Grid>

                                {/* About You */}
                                <Typography color="primary" variant="h5" gutterBottom>About You</Typography>
                                <Grid item style={{ marginBottom: '32px' }}>
                                    <TextField type="text" label="Display Name" name="displayName" defaultValue={userInformation.displayName ? userInformation.displayName : null} inputRef={register} />
                                    <TextField type="text" label="Your Description" name="description" defaultValue={userInformation.description ? userInformation.description : null} inputRef={register} multiline />
                                </Grid>

                                {/* Social Media Platforms */}
                                <Typography color="primary" variant="h5" gutterBottom>Social Media Links</Typography>
                                <Grid item >
                                    <TextField type="text" label="Twitch Username" name="socialMediaPlatforms.twitch" defaultValue={userInformation?.socialMediaPlatforms?.twitch ? userInformation?.socialMediaPlatforms?.twitch : null} inputRef={register} />
                                    <TextField type="text" label="YouTube Username" name="socialMediaPlatforms.youtube" defaultValue={userInformation?.socialMediaPlatforms?.youtube ? userInformation?.socialMediaPlatforms?.youtube : null} inputRef={register} />
                                </Grid>
                                <Grid item>
                                    <TextField type="text" label="Twitter Username" name="socialMediaPlatforms.twitter" defaultValue={userInformation?.socialMediaPlatforms?.twitter ? userInformation?.socialMediaPlatforms?.twitter : null} inputRef={register} />
                                    <TextField type="text" label="Facebook Username" name="socialMediaPlatforms.facebook" defaultValue={userInformation?.socialMediaPlatforms?.facebook ? userInformation?.socialMediaPlatforms?.facebook : null} inputRef={register} />
                                </Grid>
                                <Grid item>
                                    <TextField type="text" label="Instagram Username" name="socialMediaPlatforms.instagram" defaultValue={userInformation?.socialMediaPlatforms?.instagram ? userInformation?.socialMediaPlatforms?.instagram : null} inputRef={register} />
                                    <TextField type="url" label="Blog Url" name="socialMediaPlatforms.blog" defaultValue={userInformation?.socialMediaPlatforms?.blog ? userInformation?.socialMediaPlatforms?.blog : null} inputRef={register} />
                                </Grid>
                                <Grid item style={{ marginBottom: '32px' }}>
                                    <TextField type="text" label="TikTok Username" name="socialMediaPlatforms.tiktok" defaultValue={userInformation?.socialMediaPlatforms?.tiktok ? userInformation?.socialMediaPlatforms?.tiktok : null} inputRef={register} />
                                </Grid>

                                <Grid item container direction="row" spacing={3} justify="center" alignItems="center">
                                    <Button variant="outlined" color="secondary" style={{ marginRight: '8px' }} onClick={() => setEditMode(false)}>Cancel</Button>
                                    {!saving ?
                                        <Button variant="contained" color="secondary" type="submit">Save</Button> :
                                        <Button variant="contained" type="disabled">Saving...</Button>
                                    }
                                    {saving ? <LinearProgress color="primary" /> : null}
                                </Grid>

                            </Grid>
                        </Container>
                    </form>
                </main>

            </React.Fragment>
    )
}