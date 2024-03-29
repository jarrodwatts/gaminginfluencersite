import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TableHead from '@material-ui/core/TableHead';
import Link from '@material-ui/core/Link';
import TableRow from '@material-ui/core/TableRow';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from '../../components/listItems';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import initFirebase from '../../utils/auth/initFirebase';
import { capitalize } from '../../utils/helperFunctions/stringFormatting';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  tabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

export default function Influencers() {
  const [userInformation, setUserInformation] = useState({})
  const [savedInfluencers, setInfluencers] = useState([{}])
  const [open, setOpen] = React.useState(true);
  const [value, setValue] = React.useState(0);
  const [selectedTab, setSelectedTab] = React.useState("SAVED");
  const [activeDisplayItems, setActiveDisplayItems] = React.useState(null)
  const [applicants, setApplicants] = React.useState([])

  //-----Firebase------------//
  useEffect(() => {
    initFirebase();
    let db = firebase.firestore();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let userDoc = db.collection('users').doc(user.uid)
        userDoc.get()
          .then((doc) => {
            if (doc.exists) {
              let docData = doc.data();
              setUserInformation(docData);
            }
          })
          .then(() => {
            userDoc.collection('savedInfluencers').get()
              .then((docsSnapshot) => {
                const docsDatas = docsSnapshot.docs.map(doc => doc.data())
                setInfluencers(docsDatas);
                setActiveDisplayItems(docsDatas)
              })
          })

        //Now get offers where docs match creatorId == user.uid
        let users = [];
        let offerDocData;

        db.collection('offers').where("creatorId", "==", user.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.docs.forEach((doc) => {
              offerDocData = doc.data();

              doc.ref.collection('applicants').get()
                .then((docSnapshot) => {
                  let applicantData = docSnapshot.docs.map(doc => doc.data())
                  console.log("ApplicantData:", applicantData);
                  //Append information to the document
                  applicantData.forEach((doc) => {
                    doc.offerId = offerDocData.id,
                      doc.offerTitle = offerDocData.title
                  })
                  applicantData.forEach((doc) => { users.push(doc) })
                })
            })
            setApplicants(users);
          })
          .catch((err) => { console.log("error getting doc;", err) })
      }

      else {
        setUserInformation({})
        console.log("Shieeeeet")
      }
    });

  }, [])
  //-----End Firebase--------//

  const classes = useStyles();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleApproveDenySelect = (influencer, index, type) => {
    console.log("Approve", influencer, "at index:", index)

    initFirebase();
    let db = firebase.firestore();
    var docRef = db.collection("offers").doc(influencer.offerId);

    docRef.get()
      .then(async (doc) => {
        let offerDocData = doc.data();
        let thisInfluencerRef = docRef.collection('applicants').doc(influencer.uid);
        let users = [];

        //Update the influencer's document with status
        await thisInfluencerRef.update({
          status: type
        })

        const applicantsRef = await doc.ref.collection('applicants').get();
        const applicantData = applicantsRef.docs.map(doc => doc.data());

        //Re-Append Offer Title and Id to the influencer
        applicantData.forEach((applicant) => {
          applicant.offerId = offerDocData.id,
            applicant.offerTitle = offerDocData.title
        })

        applicantData.forEach((applicant) => { users.push(applicant) })

        //Update State once everything's finished
        setApplicants(users);
        setActiveDisplayItems(users);
      })
  };

  const handleContactSelect = (influencer, index) => {
    console.log("Contact", influencer, "at index:", index)
  };

  const handleUnsaveSelect = (influencer) => {
    console.log(influencer)
    initFirebase();
    let db = firebase.firestore();

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        let userDocRef = db.collection('users').doc(user.uid)
        await userDocRef.collection('savedInfluencers').doc(influencer.uid).delete();
        console.log("successfully unsaved", influencer.uid)

        const savedInfluencersRef = await userDocRef.collection('savedInfluencers').get();
        const savedInfluencersData = savedInfluencersRef.docs.map(doc => doc.data())
        console.log("savedInfluencersData:", savedInfluencersData)

        setInfluencers(savedInfluencersData);
        setActiveDisplayItems(savedInfluencersData)
      }
    })
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedTab(event.target.innerText);

    if (newValue === 0) { //Means first item --> saved influencers
      setActiveDisplayItems(savedInfluencers);
    }
    else {
      setActiveDisplayItems(applicants);
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>

      {/* Content */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>

            {/* Offers */}
            <Grid item xs={12}>
              <React.Fragment>

                {/* Tabs */}
                <div className={classes.tabs}>
                  <Tabs value={value} onChange={handleChange}>
                    <Tab label="Saved" />
                    <Tab label="Applicants" />
                  </Tabs>
                </div>
                <Divider />

                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell>Profile Image</TableCell>
                      <TableCell>Name</TableCell>
                      {selectedTab == "APPLICANTS" ? <TableCell>Offer</TableCell> : null}
                      <TableCell>Profile Url</TableCell>
                      <TableCell>Options</TableCell>
                      {/* <TableCell align="right">Email</TableCell> */}
                    </TableRow>
                  </TableHead>

                  <TableBody>

                    {activeDisplayItems?.map((influencer, key) => (
                      <TableRow key={key} justify="center">
                        <TableCell><Avatar alt="Remy Sharp" src={influencer.photoURL} /></TableCell>
                        <TableCell><Typography>{influencer.displayName}</Typography></TableCell>
                        {selectedTab == "APPLICANTS" ? <TableCell><Typography>{influencer.offerTitle}</Typography></TableCell> : null}
                        <TableCell><Link color="primary" href={`/profile/${influencer.uid}`}><Typography>Profile</Typography></Link></TableCell>
                        <TableCell>
                          {selectedTab == "SAVED" ? <Button style={{ marginRight: '16px' }} onClick={() => handleUnsaveSelect(influencer, key)}><FavoriteIcon color="primary" /></Button> : null}
                          {selectedTab == "APPLICANTS" && (influencer.status != "approved" && influencer.status != "denied") ? <Button style={{ marginRight: '16px' }} variant="contained" color="primary" onClick={() => handleApproveDenySelect(influencer, key, "approved")}>Approve</Button> : null}
                          {selectedTab == "APPLICANTS" && (influencer.status != "approved" && influencer.status != "denied") ? <Button style={{ marginRight: '16px' }} variant="contained" color="secondary" onClick={() => handleApproveDenySelect(influencer, key, "denied")}>Deny</Button> : null}
                          {selectedTab == "APPLICANTS" && !(influencer.status != "approved" && influencer.status != "denied") ? <Typography><b>{capitalize(influencer.status)}</b></Typography> : null}
                          <Button variant="outlined" color="secondary" onClick={() => handleContactSelect(influencer, key)}>Contact</Button>
                        </TableCell>
                      </TableRow>
                    ))}

                  </TableBody>
                </Table>
              </React.Fragment>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}