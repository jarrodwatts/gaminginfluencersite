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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Link from '@material-ui/core/Link';
import { Divider } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import WcIcon from '@material-ui/icons/Wc';
import { useDropzone } from 'react-dropzone';
import firebase from 'firebase/app'
import { useRouter } from 'next/router'
import 'firebase/auth'
import 'firebase/firestore'
import { useForm } from 'react-hook-form';
import getImage from '../utils/helperFunctions/getImage';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import Tabs from '@material-ui/core/Tabs';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tab from '@material-ui/core/Tab';
import initFirebase from '../utils/auth/initFirebase';
import { capitalize, convertCreationTime } from '../utils/helperFunctions/stringFormatting';
import { socials } from '../utils/helperFunctions/constants';

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
    imagePreview: {
        width: 200,
        height: 200,
    }
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
    const [gender, setGender] = useState(userInformation.gender ? userInformation.gender : "male");
    const router = useRouter()

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

    const handleChangeGender = (event) => {
        setGender(event.target.value)
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
                db.collection('users').doc(user.uid)
                    // Listen for live updates
                    .onSnapshot(async (doc) => {
                        if (doc.exists) {
                            const userDocData = doc.data();
                            console.log("userDocData", userDocData)
                            setUserInformation(userDocData)
                            return fetchImage(userDocData.image)
                        }
                    })
            }
            else {
                // Redirect them to /auth
                router.push('/auth')
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
                        })

                        console.log("Updated image field");
                        // Hack: Refresh image manually if the image was updated
                        const exDoc = await existingDocRef.get()
                            .then(async (doc) => {
                                const data = doc.data();
                                // Now the new image is available...
                                // We need to re-fetch the image?
                                const res = await getImage(data.image)
                                return setUserImage(res);
                            });

                    })
            }

            // TODO: this is inefficiently calling two updates 
            // when the user wants to update their image

            //Perform an update on the document
            await existingDocRef.update({
                description: data.description,
                gender: gender,
                category: data.category,
                displayName: data.displayName,
                socialMediaPlatforms: data.socialMediaPlatforms,
            })

            setSaving(false);

            // Case where user comes back to edit previous image in same load,
            // We need to clear state of the image being displayed 
            // Otherwise it isn't available to edit.
            setFilePreview(null);

            // Then send them back to view their profile changes
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
                        <Container className={classes.cardGrid} maxWidth="md">

                            <Grid container direction="row" justify="flex-end" style={{ marginBottom: '16px' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { setEditMode(true); }}>
                                    Edit Profile
                                    </Button>
                            </Grid>

                            <Grid container direction="row" alignItems="center" justify="center" spacing={3} style={{ marginBottom: '32px', }}>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Avatar src={userImage}
                                        style={{
                                            // position: 'absolute',
                                            // bottom: '45%',
                                            borderStyle: 'solid',
                                            borderWidth: '5px',
                                            borderColor: "#556cd6", //primary
                                        }} className={classes.large} />
                                </Grid>
                                <Grid container item direction="column" xs={12} sm={6} md={9} spacing={2}>
                                    <Grid item>
                                        {/* Name */}
                                        <Typography color="primary" variant="h3"><b>{userInformation?.displayName}</b></Typography>
                                    </Grid>
                                    <Grid item style={{ marginLeft: '8px' }}>
                                        {/* Bio / Description */}
                                        <Typography variant="h5">{userInformation?.bio}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Divider style={{ marginBottom: '16px' }} />

                            <Grid container direction="row" alignItems="baseline" justify="center" spacing={3}>
                                <Grid container item direction="column" xs={3} spacing={1}>

                                    <Grid container item direction="row" spacing={1}>
                                        <Grid item>
                                            <SportsEsportsIcon color="primary" style={{ marginRight: '4px' }} />
                                        </Grid>
                                        <Grid item>
                                            <Typography><b>{capitalize(userInformation?.category)}</b></Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container item direction="row" spacing={1}>
                                        <Grid item>
                                            <WcIcon color="primary" style={{ marginRight: '4px' }} />
                                        </Grid>
                                        <Grid item>
                                            <Typography>Identifies as <b>{capitalize(userInformation?.gender)}</b></Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container item direction="row" spacing={1}>
                                        <Grid item>
                                            <RoomIcon color="primary" style={{ marginRight: '4px' }} />
                                        </Grid>
                                        <Grid item>
                                            <Typography>From <b>{capitalize(userInformation?.region)}</b></Typography>
                                        </Grid>
                                    </Grid>

                                    <Grid container item direction="row" spacing={1}>
                                        <Grid item>
                                            <EmojiPeopleIcon color="primary" style={{ marginRight: '4px' }} />
                                        </Grid>
                                        <Grid item>
                                            <Typography>Joined <b>{convertCreationTime(userInformation?.metadata?.creationTime)}</b></Typography>
                                        </Grid>
                                    </Grid>

                                </Grid>

                                <Divider orientation="vertical" flexItem />

                                <Grid container direction="column" item xs={8} spacing={3} style={{ marginLeft: '16px' }}>

                                    <Grid container item direction="column" spacing={0}>
                                        <Grid item>
                                            <Typography color="primary" variant="h5">About {userInformation?.displayName}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1">{userInformation?.description}</Typography>
                                        </Grid>

                                    </Grid>

                                    <Grid container item spacing={0}>
                                        <Typography color="primary" variant="h5">{userInformation?.displayName}'s Social Media Profiles:</Typography>

                                        <Grid container direction="row" item spacing={2} style={{ marginTop: '8px' }} xs={12} spacing={3}>
                                            {

                                                userInformation?.socialMediaPlatforms ?
                                                    Object.entries(userInformation.socialMediaPlatforms).map(([socialName, socialValue]) =>

                                                        socialValue ?
                                                            <Grid container item direction="row" alignItems="center" justify="center" spacing={2} key={socialName} md={3} sm={4} xs={12}>
                                                                <Paper className={classes.paper} style={{ minWidth: '112px', maxWidth: '112px', minHeight: '96px' }}>

                                                                    {/* TODO: This href/ is not going to work for tik tok - it requires an @ */}
                                                                    <Link href={`//www.${socialName}.com/${socialValue}`} underline="none" color="textSecondary">
                                                                        <Grid container direction="column" alignItems="center" justify="center" spacing={1}>
                                                                            <Grid item>
                                                                                <Avatar
                                                                                    alt={socialName}
                                                                                    src={`/assets/${socialName}.png`}
                                                                                />
                                                                            </Grid>

                                                                            <Grid item>
                                                                                <Typography>{socialValue}</Typography>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Link>
                                                                </Paper>
                                                            </Grid> : null

                                                    )
                                                    :
                                                    <Typography>😞 You haven't told us your social media usernames yet.</Typography>
                                            }
                                        </Grid>

                                    </Grid>

                                </Grid>

                            </Grid>

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

                        <Container className={classes.cardGrid} maxWidth="md">
                            <Grid container direction="row" spacing={3}>

                                <Grid container direction="column" alignItems="center" item xs={5} spacing={2}>
                                    <Grid item>
                                        <Typography color="primary" variant="h5" gutterBottom>Profile Image</Typography>
                                    </Grid>
                                    <Grid item>
                                        {filePreview ?
                                            <Grid container direction="column" alignItems="center" justify="center" spacing={2}>
                                                <Grid item>
                                                    <Avatar
                                                        className={classes.imagePreview}
                                                        src={filePreview[0].preview}
                                                        style={{
                                                            maxHeight: '200px',
                                                            borderStyle: 'solid',
                                                            borderWidth: '2px',
                                                            borderColor: "#fff",

                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <Button variant="contained" color="secondary" onClick={() => setFilePreview(null)}>Reset</Button>
                                                </Grid>
                                            </Grid>
                                            :
                                            <StyledDropzone />
                                        }
                                    </Grid>
                                </Grid>

                                <Divider orientation="vertical" flexItem />

                                <Grid container item direction="column" xs={6} spacing={2}>
                                    <Grid item>
                                        <Typography color="primary" variant="h5" gutterBottom>Key Information</Typography>
                                    </Grid>

                                    <Grid item>
                                        <TextField type="text" label="Display Name" name="displayName" defaultValue={userInformation.displayName ? userInformation.displayName : null} inputRef={register} style={{ width: '100%' }} />
                                    </Grid>

                                    <Grid item>
                                        <TextField type="text" label='Title / Category' name="category" defaultValue={userInformation.category ? userInformation.category : null} inputRef={register} style={{ width: '100%' }} />
                                    </Grid>

                                    <Grid item style={{ margin: '8px' }}>
                                        <InputLabel id="gender-selection-label">Gender</InputLabel>
                                        <Select
                                            style={{ width: '50%', }}
                                            labelId="gender-selection-select"
                                            id="gender-selection"
                                            value={gender}
                                            onChange={handleChangeGender}
                                            name="gender"
                                            inputRef={register}
                                        >
                                            <MenuItem value={"male"}>Male</MenuItem>
                                            <MenuItem value={"female"}>Female</MenuItem>
                                            <MenuItem value={"other"}>Non-Conforming</MenuItem>

                                        </Select>

                                    </Grid>

                                    <Grid item>
                                        <TextField type="text" label="Your Description" name="description" defaultValue={userInformation.description ? userInformation.description : null} inputRef={register} multiline style={{ width: '90%' }} />
                                    </Grid>
                                </Grid>

                                <Divider style={{ width: '100%' }} />

                                <Grid item xs={12}>
                                    <Typography color="primary" variant="h5" gutterBottom>Social Media Profiles</Typography>
                                </Grid>

                                {socials.map((social, key) =>
                                    <Grid item xs={12} sm={6} md={4} key={key}>
                                        <Paper className={classes.paper}>
                                            <Grid container direction="row" alignItems="center" justify="center" spacing={2}>
                                                <Grid item xs={3}>
                                                    <Avatar src={`/assets/${social}.png`} />
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <Typography>{capitalize(social)}</Typography>
                                                </Grid>

                                                <Divider style={{ width: '100%' }} />

                                                <Grid item >
                                                    <TextField
                                                        type="text"
                                                        style={{ width: '80%' }}
                                                        label={`${capitalize(social)} Username`}
                                                        name={`socialMediaPlatforms.${social}`}
                                                        defaultValue={userInformation?.socialMediaPlatforms?.[social] ?
                                                            userInformation?.socialMediaPlatforms?.[social]
                                                            : null}
                                                        inputRef={register} />

                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                )}

                                <Grid container item direction="row" xs={12} justify="center" alignItems="center" spacing={3}>
                                    <Grid item>
                                        <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
                                    </Grid>
                                    <Grid item>
                                        {!saving ?
                                            <Button variant="contained" color="secondary" type="submit">Save</Button> :
                                            <Button variant="contained" type="disabled">Saving...</Button>
                                        }
                                        {saving ? <LinearProgress color="primary" /> : null}
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Container>
                    </form>
                </main>

            </React.Fragment>
    )
}