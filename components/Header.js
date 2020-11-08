import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useUser } from '../utils/auth/useUser'
import { useRouter } from 'next/router'

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
    const [username, setUsername] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const { user, userDocument, logout } = useUser()
    const router = useRouter()
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        setUserDetails(userDocument)
        setUsername(userDocument?.displayName)
    }, [userDocument]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                        gamingInfluencerSite
                    </Typography>

                    {/* Is User Logged in? Show Profile Icon */}
                    {user ? (
                        <Grid container justify="flex-end" alignItems="center" direction="row">
                            {userDetails?.type == "Brand" ?
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { router.push('/create') }}
                                    style={{ marginRight: '16px' }}>
                                    Create Offer
                                    </Button>
                                : null}
                            <Typography>{username}</Typography>

                            <IconButton
                                aria-label="account of current user"
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                onClick={handleClick}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>

                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
                                {userDetails?.type == "Brand" ? <MenuItem onClick={() => router.push('/dashboard')}>Dashboard</MenuItem> : null}
                                <MenuItem onClick={() => logout()}>Logout</MenuItem>
                            </Menu>
                        </Grid>

                    ) :
                        //If User is not Logged in Show Login and Sign Up Buttons
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