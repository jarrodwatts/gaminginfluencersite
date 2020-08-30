import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { useUser } from '../utils/auth/useUser'
import { useRouter } from 'next/router'
import initFirebase from '../utils/auth/initFirebase';
import firebase from 'firebase/app'
import 'firebase/auth'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));



export default function MenuAppBar() {
    const classes = useStyles();
    const [anchorEl] = React.useState(null);
    const [username, setUsername] = useState(null);
    const { user } = useUser()
    const router = useRouter()

    initFirebase();

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            setUsername(user.displayName.toString());
        } else {
            return 'loading'
        }
    });

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    {/* Left Side */}
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={() => { router.push('/') }}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>

                    <Typography variant="h6" className={classes.title}>
                        Site Name
                    </Typography>

                    {/* Is User Logged in? Show Profile Icon */}
                    {user ? (
                        <Grid container justify="flex-end" alignItems="center" direction="row">
                            {
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { router.push('/create') }}
                                    style={{ marginRight: '16px' }}>
                                    Create Offer
                                    </Button>
                            }
                            <Typography>{username}</Typography>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={() => { router.push('/profile') }}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </Grid>

                        //If User is not Logged in Show Login and Sign Up Buttons
                    ) :
                        <div>
                            <Button
                                style={{ marginRight: '16px' }}
                                onClick={() => { router.push('/auth') }}
                                variant="outlined"
                                color="secondary">
                                Log In
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => { router.push('/auth') }}>
                                Sign Up
                            </Button>
                        </div>
                    }

                </Toolbar>
            </AppBar>
        </div>
    );
}