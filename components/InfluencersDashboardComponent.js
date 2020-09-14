import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import initFirebase from '../utils/auth/initFirebase';


function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
}));

export default function InfluencersDashboardComponent() {
    const [userInformation, setUserInformation] = useState({})
    const [influencers, setInfluencers] = useState([{}])

    //-----Firebase------------//
    useEffect(() => {
        initFirebase();
        let db = firebase.firestore();

        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                const userDocRef = db.collection('users').doc(user.uid);
                const userDocData = await userDocRef.get();
                setUserInformation(userDocData.data());

                //specifically set influencers too to map it later
                const savedInfluencers = await userDocRef.collection('savedInfluencers').get();
                const savedInfluencersData = savedInfluencers.docs.map(doc => doc.data())
                console.log(savedInfluencersData);
                setInfluencers(savedInfluencersData);
            }
            else {
                setUserInformation({})
                console.log("Loading")
            }
        });

    }, [])
    //-----End Firebase--------//
    const classes = useStyles();

    return (
        <React.Fragment>
            <Title>Your Saved Influencers</Title>

            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell>Profile Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Profile Url</TableCell>
                        <TableCell align="right">Email</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {influencers?.map((influencer, key) => (
                        <TableRow key={key}>
                            <TableCell><Avatar alt="Remy Sharp" src={influencer.photoURL} /></TableCell>
                            <TableCell><Typography>{influencer.displayName}</Typography></TableCell>
                            <TableCell><Link color="primary" href={`/profile/${influencer.uid}`}><Typography>Profile</Typography></Link></TableCell>
                            <TableCell align="right"><Typography>{influencer.email}</Typography></TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>

            <div className={classes.seeMore}>
                <Link color="primary" href="#" onClick={preventDefault}>
                    See all saved influencers
                </Link>
            </div>

        </React.Fragment>
    );

}