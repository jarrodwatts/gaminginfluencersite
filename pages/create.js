import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Header from '../components/Header';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'
import { Divider } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import initFirebase from '../utils/auth/initFirebase';
import 'firebase/storage';
import LinearProgress from '@material-ui/core/LinearProgress';
import { regions, socials } from '../utils/helperFunctions/constants';
import { displayRegion } from '../utils/helperFunctions/stringFormatting';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },

}));

export default function Create() {
    const [value, setValue] = useState("");
    const [criteria, setCriteria] = useState([])
    const [filePreview, setFilePreview] = useState(null);
    const classes = useStyles();
    const { register, handleSubmit } = useForm();
    const onSubmit = data => saveOffer(data)
    const [image, setImage] = useState(null);
    const router = useRouter()
    const [saving, setSaving] = useState(false);


    let [socialToggles, setToggle] = useState({
        twitch: true,
        youtube: true,
        instagram: true,
        twitter: true,
        facebook: true,
    })

    let [regionToggles, setToggleRegion] = useState({
        africa: true,
        asia: true,
        europe: true,
        northAmerica: true,
        oceania: true,
        southAmerica: true,
        other: true
    })

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

    const saveOffer = (data) => {
        console.log("Title", data.title)
        console.log("Description", data.description)
        console.log("Socials:", socialToggles)
        console.log("Regions:", regionToggles)
        console.log("Image;", image);
        console.log("Criteria:,", criteria);
        console.log("shortDesc;", data.shortDescription)

        setSaving(true)
        //firebase upload
        initFirebase();
        let db = firebase.firestore();
        let storage = firebase.storage();

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user)
                let storageRef = storage.ref();

                //1. Create a new offer doc with a generated id
                db.collection("offers").add({
                    title: data.title,
                    description: data.description,
                    socials: socialToggles,
                    regions: regionToggles,
                    creatorId: user.uid,
                    creatorName: user.displayName,
                    dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
                    criteria: criteria,
                    shortDescription: data.shortDescription,

                })
                    .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                        //2. Upload the image to storage, using the generated id name
                        let file = image
                        // Create a child reference
                        let imagesRef = storageRef.child('offers');
                        // Child references can also take paths delimited by '/'
                        let offersRef = imagesRef.child(`/${docRef.id}.png`);

                        offersRef.put(file)
                            .then(() => {
                                console.log('Uploaded a blob or file!');
                                //3. On upload success, pass the image name to the offer.
                                let existingDocRef = db.collection("offers").doc(docRef.id);

                                //Also update the id field
                                return existingDocRef.update({
                                    image: `offers/${docRef.id}`,
                                    id: docRef.id,
                                }).then(() => console.log("Updated image field"))
                                    .then(() => router.push(`/offers/${docRef.id}`))
                            })
                    })

                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
            }

            else {
                console.log("no user")
            }
        })
    }

    const handleDelete = (key) => {
        setCriteria(criteria.filter(item => item !== criteria[key]))
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const addCriteria = () => {
        if (criteria.length < 4 && !criteria.includes(value)) {
            setCriteria([...criteria, value])
            setValue("");
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Header />

            <Container maxWidth="md" className={classes.container}>

                <div className={classes.root}>
                    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>

                        <Grid container spacing={3} direction="row">
                            <Grid item xs={8}>
                                <Paper className={classes.paper}>
                                    <Grid container direction="row" alignItems="center" justify="space-between">
                                        <Grid item>
                                            <Typography color="primary"><b>Title: </b></Typography>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField style={{ width: '100%' }} type="text" label="Offer Title" name="title" inputRef={register} inputProps={{
                                                maxLength: 80
                                            }} />
                                        </Grid>
                                    </Grid>

                                    <Divider style={{ marginBottom: '8px', marginTop: '16px' }} />

                                    <Grid container direction="row" alignItems="center" justify="space-between">
                                        <Grid item>
                                            <Typography color="primary"><b>Short Description: </b></Typography>
                                        </Grid>

                                        <Grid item xs={8}>
                                            <TextField
                                                style={{ width: '100%' }}
                                                type="text"
                                                multiline
                                                label="Short, One-Sentence Offer Description"
                                                name="shortDescription"
                                                inputRef={register}
                                                inputProps={{
                                                    maxLength: 140
                                                }}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider style={{ marginBottom: '8px', marginTop: '16px' }} />

                                    <Grid container direction="row" alignItems="center" justify="space-between">
                                        <Grid item>
                                            <Typography color="primary"><b>Detailed Description: </b></Typography>
                                        </Grid>

                                        <Grid item xs={8}>
                                            <TextField style={{ width: '100%' }} type="text" multiline label="Detailed Offer Description" name="description" inputRef={register} />
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginBottom: '8px', marginTop: '32px' }} />

                                    <Grid style={{ paddingTop: '8px', }} container direction="row" alignItems="center" justify="space-between">
                                        <Grid item>
                                            <Typography color="primary"><b>Social Media Platforms: </b></Typography>
                                            <Typography >(Select any desired)</Typography>

                                        </Grid>

                                        <Grid item container direction="row" justify="space-around" alignItems="center" xs={8}>
                                            {socials.map((item, key) =>
                                                <Button
                                                    style={!socialToggles[item] ? { filter: 'grayscale(100%)' } : null}
                                                    key={key}
                                                    onClick={() => {
                                                        const st = { ...socialToggles };
                                                        st[item] = !socialToggles[item];
                                                        setToggle(st)
                                                    }}>

                                                    <Avatar src={`/assets/${item}.png`} alt={item} />
                                                </Button>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginBottom: '8px', marginTop: '16px' }} />

                                    <Grid container direction="row" alignItems="center" justify="space-between">
                                        <Grid item>
                                            <Typography color="primary"><b>Regions: </b></Typography>
                                            <Typography >(Select any desired)</Typography>
                                        </Grid>

                                        <Grid item container direction="row" xs={8}>
                                            {regions.map((item, key) =>
                                                <Grid key={key} item style={{ flexGrow: 1 }}>
                                                    <Button
                                                        style={regionToggles[item] ? { minWidth: '80px' } : { filter: 'invert(80%)', minWidth: '80px' }}
                                                        onClick={() => {
                                                            const rt = { ...regionToggles };
                                                            rt[item] = !regionToggles[item];
                                                            setToggleRegion(rt)
                                                            console.log(item, key, rt[item])
                                                        }}>
                                                        <Grid container direction="column" alignItems="center">

                                                            <Avatar
                                                                src={`/assets/${item}.png`}
                                                                alt={item}
                                                                style={regionToggles[item] ? { backgroundColor: "#556cd6" } : { filter: 'invert(80%)' }}
                                                            />
                                                            <Typography variant="button">
                                                                {displayRegion(item)}
                                                            </Typography>
                                                        </Grid>
                                                    </Button>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>

                                    <Divider style={{ marginBottom: '8px', marginTop: '24px' }} />

                                    <Grid container direction="row" alignItems="center" justify="space-between">
                                        <Grid item>
                                            <Typography color="primary"><b>Image: </b></Typography>
                                        </Grid>

                                        <Grid item xs={10} >
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
                                    </Grid>

                                    <Divider style={{ marginBottom: '16px', marginTop: '24px' }} />

                                    <Grid container direction="row" alignItems="center" justify="space-between">
                                        <Grid item>
                                            <Typography color="primary"><b>Looking For: </b></Typography>
                                            <Typography >(Four short criteria)</Typography>
                                        </Grid>

                                        <Grid item xs={8} >
                                            <Grid container direction="row" alignItems="center" justify="flex-start" spacing={2}>
                                                <TextField style={{ width: '80%' }} type="text" onChange={event => handleChange(event)} value={value} label="Criteria (E.g. 100 Twitch Followers)" name="criteria" inputRef={register} />
                                                <Button variant="contained" color="primary" onClick={addCriteria}> Add</Button>

                                                {criteria.map((word, key) =>
                                                    <Grid item key={key}>
                                                        <Chip label={word} onDelete={() => { handleDelete(key) }} color="primary" />
                                                    </Grid>
                                                )}

                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid style={{ marginTop: '24px' }} container direction="row" alignItems="center" justify="center">
                                        <Grid item>
                                            {!saving ?
                                                <Button variant="contained" color="secondary" type="submit">Create Offer</Button> :
                                                <Button variant="contained" type="disabled">Saving...</Button>
                                            }
                                            {saving ? <LinearProgress color="primary" /> : null}
                                        </Grid>
                                    </Grid>

                                </Paper>
                            </Grid>

                            <Grid item xs={4}>
                                <Paper className={classes.paper}>xs=4</Paper>
                            </Grid>

                        </Grid>

                    </form>
                </div>
            </Container>
        </div>
    );

}
