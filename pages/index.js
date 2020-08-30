import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import dynamic from 'next/dynamic'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import initFirebase from '../utils/auth/initFirebase';

const Footer = dynamic(() => import('../components/Footer'))
const NavBar = dynamic(() => import('../components/Header'))
const OfferCard = dynamic(() => import('../components/OfferCard'))
const InfluencerCard = dynamic(() => import('../components/InfluencerCard'))

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },

  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },

  heroButtons: {
    marginTop: theme.spacing(4),
  },

  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

}));

export default function Index() {
  const classes = useStyles();
  const [userInformation, setUserInformation] = useState({})
  const [offers, setOffers] = useState([])
  const [open, setOpen] = React.useState(false);
  const [influencers, setInfluencers] = React.useState([])
  const [staticInfluencers, writeToStaticInfluencers] = React.useState()
  const [filters, setFilters] = React.useState([])

  //Filters...
  const [gender, setGender] = React.useState('');
  const [platform, setPlatform] = React.useState('');
  const [region, setRegion] = React.useState('');

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
        setUserInformation({ type: "new" })
        console.log("Loading")
      }

      //If the user is a influencer load offers...
      //if (user.type !== "Brand") {
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
      //}

      //Else load influencers
      //else {
      let influencersFromDb = [];
      db.collection('users').where("type", "==", "Influencer")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            influencersFromDb.push(doc.data())
            console.log("Influencer read:", doc.id, " => ", doc.data());
          });
          setInfluencers(influencersFromDb);
          writeToStaticInfluencers(influencersFromDb);
        })
      //}
    });

  }, [])
  //-----End Firebase--------//

  const handleChangeGender = (event) => {
    //check if event.target.value is same as current filter to revert filter
    setGender(event.target.value);
    let filtered;
    if (event.target.value != "none") {
      filtered = staticInfluencers.filter(influencer => influencer.gender == event.target.value);
    }
    else {
      console.log("reverting gender selection")
      setGender('')
      filtered = staticInfluencers.filter(influencer => influencer)
    }

    if (region != '') {
      filtered = filtered.filter(influencer => influencer.region == region);
    }
    if (platform != '') {
      filtered = filtered.filter(influencer => influencer.socialMediaPlatforms.hasOwnProperty(platform))
    }
    setInfluencers(filtered);
  };

  const handleChangePlatform = (event) => {
    setPlatform(event.target.value);
    let filtered;
    if (event.target.value != "none") {
      filtered = staticInfluencers.filter(influencer => influencer.socialMediaPlatforms.hasOwnProperty(event.target.value));
    }
    else {
      console.log("reverting platform selection")
      setPlatform('')
      filtered = staticInfluencers.filter(influencer => influencer)
    }

    if (gender != '') {
      console.log("gender is", gender)
      console.log("filtered is currently...", filtered);
      filtered = filtered.filter(influencer => influencer.gender == gender);
      console.log("now filtered is...", filtered)
    }
    if (region != '') {
      filtered = filtered.filter(influencer => influencer.region == region);
    }
    setInfluencers(filtered);
  };

  const handleChangeRegion = (event) => {
    setRegion(event.target.value);
    let filtered;
    if (event.target.value != "none") {
      filtered = staticInfluencers.filter(influencer => influencer.region == event.target.value);
    }
    else {
      console.log("reverting region selection")
      setRegion('')
      filtered = staticInfluencers.filter(influencer => influencer)
    }
    if (platform != '') {
      filtered = filtered.filter(influencer => influencer.socialMediaPlatforms.hasOwnProperty(platform))
    }
    if (gender != '') {
      filtered = filtered.filter(influencer => influencer.gender == gender);
    }
    setInfluencers(filtered);
  };

  //Brands...
  if (userInformation.type == "Brand") {
    console.log(influencers)
    return (
      // This is the code that BRANDS will see.
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <main>
          <Container className={classes.cardGrid} maxWidth="lg">
            <Grid container direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <Typography>Filter influencers by: </Typography>
              </Grid>

              {/* Gender */}
              <Grid item>
                <FormControl className={classes.formControl}>
                  <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Gender
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={gender}
                    onChange={handleChangeGender}
                    onSelect={handleChangeGender}
                    className={classes.selectEmpty}
                  >
                    <MenuItem value={"none"}>None</MenuItem>
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Platform */}
              <Grid item>
                <FormControl className={classes.formControl}>
                  <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Platform
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={platform}
                    onChange={handleChangePlatform}
                    className={classes.selectEmpty}
                  >
                    <MenuItem value={"none"}>None</MenuItem>
                    <MenuItem value={"twitch"}>Twitch</MenuItem>
                    <MenuItem value={"youtube"}>YouTube</MenuItem>
                    <MenuItem value={"twitter"}>Twitter</MenuItem>
                    <MenuItem value={"facebook"}>Facebook</MenuItem>
                    <MenuItem value={"instagram"}>Instagram</MenuItem>
                    <MenuItem value={"blog"}>Blog</MenuItem>
                    <MenuItem value={"tiktok"}>Tik Tok</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Region */}
              <Grid item>
                <FormControl className={classes.formControl}>
                  <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                    Region
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={region}
                    onChange={handleChangeRegion}
                    className={classes.selectEmpty}
                  >
                    <MenuItem value={"none"}>None</MenuItem>
                    <MenuItem value={"africa"}>Africa</MenuItem>
                    <MenuItem value={"asia"}>Asia</MenuItem>
                    <MenuItem value={"europe"}>Europe</MenuItem>
                    <MenuItem value={"northAmerica"}>North America</MenuItem>
                    <MenuItem value={"oceania"}>Oceania</MenuItem>
                    <MenuItem value={"southAmerica"}>South America</MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>

                  </Select>
                </FormControl>
              </Grid>

            </Grid>
            <Divider style={{ marginBottom: '16px' }} />

            <Grid container spacing={4}>
              {influencers.map((influencer, key) => (
                <Grid item key={key} xs={12} sm={6} md={3}>
                  <InfluencerCard
                    displayName={influencer.displayName}
                    category={influencer.category}
                    socialMediaPlatforms={influencer.socialMediaPlatforms}
                    uid={influencer.uid}
                    description={influencer.description}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
        <Footer />
      </React.Fragment>
    )
  }

  //Influencers and new users...
  if (userInformation.type !== "Brand") {
    return (
      // This is the code that influencers and new users see
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <main>

          <Container className={classes.cardGrid} maxWidth="lg">
            <Grid container spacing={4}>
              {offers.map((offer, key) => (
                <Grid item key={key} xs={12} sm={6} md={4}>
                  <OfferCard
                    title={offer.title}
                    description={offer.description}
                    creator={offer.creator}
                    dateCreated={offer.dateCreated}
                    id={offer.id}
                    image={offer.image}
                  />
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
        <Footer />
      </React.Fragment>
    );
  }

  //Loading...
  if (!userInformation.type) {
    return (
      // This is the code that influencers and new users see
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <main>
          <Typography variant="h4">Loading...</Typography>
        </main>
        <Footer />
      </React.Fragment>
    )
  }
}