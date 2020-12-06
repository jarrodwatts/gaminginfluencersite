import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import UserContext from '../utils/auth/UserContext';
import getUser from '../utils/auth/getUser';
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from '../utils/auth/initFirebase';


export default function MyApp(props) {
  const { Component, pageProps } = props;
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    // Within useEffect, request getUser
    // Then, store it in state, and pass it to the UserContext Provider to wrap App
    firebase.auth().onAuthStateChanged(async (user) => {
      const res = await getUser(user);
      setUser(res);
    });

  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>gamingInfluencerSite</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* New: User Context Provider */}
        <UserContext.Provider value={user}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </UserContext.Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};