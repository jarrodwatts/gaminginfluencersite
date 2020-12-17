import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import FirebaseAuth from '../components/FirebaseAuth';
import Image from 'next/image';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  bgWrap: {
    zIndex: -1,
  },
}));

export default function SignInSide() {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root} alignItems="center" justify="center">
      <Image
        src="/signUpBackground.jpg"
        alt="Random Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className={classes.bgWrap}
      />

      <Grid container item xs={12} sm={8} md={5} component={Paper} elevation={6} justify="center" alignItems="center" style={{ paddingTop: '96px', paddingBottom: '96px', }}>
        <FirebaseAuth />
      </Grid>

    </Grid>
  );
}