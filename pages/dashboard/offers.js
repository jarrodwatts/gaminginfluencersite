import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from '../../components/listItems';
import OfferCardAnalyticsRow from '../../components/OfferCardAnalyticsRow';
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import initFirebase from '../../utils/auth/initFirebase';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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

export default function Offers() {
  const [userInformation, setUserInformation] = useState({})
  const [offers, setOffers] = useState([])

  //-----Firebase------------//
  useEffect(() => {
    initFirebase();
    let db = firebase.firestore();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //now ask for user info
        let userDoc = db.collection('users').doc(user.uid)

        userDoc.get().then((doc) => {
          if (doc.exists) {
            console.log(doc.data())
            //Infite loop on setting userInformation below
            setUserInformation(doc.data())
          }
        })
      }

      else {
        userInformation = {}
        console.log("Loading")
      }

      let offersFromDb = [];
      //Regardless... Get offers from offers collection.
      let offersCollection = db.collection('offers') //can add WHERE clause here
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            offersFromDb.push(doc.data())
            console.log(doc.id, " => ", doc.data());
          });
          setOffers(offersFromDb);
        })

    });

  }, [])
  //-----End Firebase--------//

  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const convertDate = (date) => {
    return new Date(date * 1000).toLocaleDateString();
  }

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
          <Grid container direction="column" spacing={3}>
            {/* Offers */}

            {offers.map((offer, key) => (
              <Grid item xs={12} key={key}>
                <Paper style={{ marginBottom: '24px' }}>
                  <Grid container alignItems="center" justify="space-between" spacing={2}>
                    <Grid item xs={3}>
                      <OfferCardAnalyticsRow
                        title={offer.title}
                        description={offer.description}
                        creator={offer.creator}
                        dateCreated={offer.dateCreated}
                        id={offer.id}
                      />
                    </Grid>

                    <Grid item xs={8}>
                      <Table size="medium">
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>View</TableCell>
                            <TableCell>Options</TableCell>
                            <TableCell>Date Created</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow key={key}>
                            <TableCell>
                              <Typography>{offer.title ? offer.title : null}</Typography>
                            </TableCell>

                            <TableCell>
                              <Link color="primary" href={`/offer/${offer.id}`}><Typography>Offer Page</Typography></Link>
                            </TableCell>

                            <TableCell>
                              <Button variant="outlined" color="secondary" style={{ marginRight: '8px' }}>Edit</Button>
                              <Button variant="contained" color="secondary">Delete</Button>
                            </TableCell>
                            <TableCell>{offer.dateCreated ? convertDate(offer.dateCreated.seconds) : null}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>
                  </Grid>
                </Paper>

              </Grid>
            ))}

          </Grid>
        </Container>
      </main>

    </div>
  );
}