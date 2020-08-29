import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Avatar from '@material-ui/core/Avatar';
import Header from '../components/Header';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import { useForm } from 'react-hook-form';
import { Divider } from '@material-ui/core';

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
    const socials = ["twitch", "youtube", "instagram", "twitter", "facebook",];
    const regions = ["africa", "asia", "europe", "northAmerica", "oceania", "southAmerica", "other"]
    const classes = useStyles();
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = data => saveOffer(data)

    let [socialToggles, setToggle] = React.useState({
        twitch: false,
        youtube: false,
        instagram: false,
        twitter: false,
        facebook: false,
    })

    let [regionToggles, setToggleRegion] = React.useState({
        africa: false,
        asia: false,
        europe: false,
        northAmerica: false,
        oceania: false,
        southAmerica: false,
        other: false
    })

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
                                            <TextField style={{ width: '100%' }} type="text" label="Offer Title" name="title" inputRef={register} />
                                        </Grid>
                                    </Grid>

                                    <Divider style={{ marginBottom: '8px', marginTop: '16px' }} />

                                    <Grid container direction="row" alignItems="center" justify="space-between">
                                        <Grid item>
                                            <Typography color="primary"><b>Description: </b></Typography>
                                        </Grid>

                                        <Grid item xs={8}>
                                            <TextField style={{ width: '100%' }} type="text" multiline label="Offer Description" name="description" inputRef={register} />
                                        </Grid>
                                    </Grid>
                                    <Divider style={{ marginBottom: '8px', marginTop: '32px' }} />

                                    <Grid style={{ paddingTop: '8px',}} container direction="row" alignItems="center" justify="space-between">
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
                                                                {item}
                                                            </Typography>
                                                        </Grid>
                                                    </Button>
                                                </Grid>
                                            )}
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