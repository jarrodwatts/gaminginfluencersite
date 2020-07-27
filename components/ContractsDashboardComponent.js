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
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  avatarBottom: {
    marginBottom: '8px'
  },
}));

export default function Contracts() {

  const [userInformation, setUserInformation] = useState({})
  const [contracts, setContracts] = useState([{}])

  //-----Firebase------------//
  useEffect(() => {
    initFirebase();
    let db = firebase.firestore();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let userDoc = db.collection('users').doc(user.uid)
        userDoc.get().then((doc) => {
          if (doc.exists) {
            console.log(doc.data())
            //Infite loop on setting userInformation below
            let docData = doc.data();
            setUserInformation(docData);

            //specifically set contracts too to map it later
            setContracts(docData["contracts"]);
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
  const classes = useStyles();

  const convertDate = (date) => {
    return new Date(date * 1000).toLocaleDateString();
  }

  return (
    <React.Fragment>
      <Title>Your Contracts</Title>

      <Table size="medium">

        <TableHead>
          <TableRow>
            <TableCell>Offeror</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Influencer</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {contracts.map((contract, key) => (
            <TableRow key={key}>
              <TableCell>
                <Avatar alt="Remy Sharp" src={contract.creator ? contract.creator.photoURL : null} className={classes.avatarBottom} />
                <Typography>{contract.creator ? contract.creator.displayName : null}</Typography>
              </TableCell>

              <TableCell> <ArrowForwardIcon /> </TableCell>

              <TableCell>
                <Avatar alt="Remy Sharp" src={contract.receiver ? contract.receiver.photoURL : null} className={classes.avatarBottom} />
                <Typography>{contract.receiver ? contract.receiver.displayName : null}</Typography>
              </TableCell>

              <TableCell align="right">{contract.dateCreated ? convertDate(contract.dateCreated.seconds) : null}</TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>

      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See all Contracts
        </Link>
      </div>

    </React.Fragment>
  );
}