import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CardMedia from '@material-ui/core/CardMedia';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import RoomIcon from '@material-ui/icons/Room';
import Link from '@material-ui/core/Link';
import getImage from '../utils/helperFunctions/getImage';
import CircularProgress from '@material-ui/core/CircularProgress';
import initFirebase from '../utils/auth/initFirebase';
import { useRouter } from 'next/router'
import Router from 'next/router'
import { capitalize } from '../utils/helperFunctions/stringFormatting';

const useStyles = makeStyles((theme) => ({
    avatarSize: {
        width: theme.spacing(14),
        height: theme.spacing(14),
    },
    card: {
        minHeight: '320px',
    }
}));

export default function InfluencerCard(props) {
    const classes = useStyles();
    console.log("props", props);
    const [influencerImage, setInfluencerImage] = React.useState(null)

    useEffect(() => {
        const fetchImage = async () => {
            const res = await getImage(props.image)
            setInfluencerImage(res);
        }
        if (props.image) {
            initFirebase();
            fetchImage()
        }
    }, [props.image])
    console.log(props);

    return (
        <Card className={classes.card}>
            <Grid container direction="column" alignItems="center" >
                {/* Cover Image */}
                <Grid item>
                    {influencerImage ? <img src={influencerImage}
                        style={{ maxHeight: '96px', backgroundSize: 'cover', objectFit: 'cover', width: '100%', }} />
                        : <CircularProgress color="primary" style={{ marginTop: '8px' }} />}
                </Grid>

                <Grid item>
                    {/* Profile Image */}
                    {influencerImage ? <Avatar src={influencerImage} className={classes.avatarSize}
                        style={{
                            borderStyle: 'solid',
                            borderWidth: '2px',
                            borderColor: "#fff",
                        }} />
                        : <CircularProgress color="primary" style={{ marginTop: '8px' }} />}
                </Grid>

                {/* Display Name */}
                <Grid item>
                    <Typography variant="h5" style={{ marginTop: '8px' }}>{props.displayName}</Typography>
                </Grid>

                <Grid item style={{ width: '75%', marginTop: '8px' }}>
                    <Divider style={{ width: '100%' }} />
                </Grid>

                {/* Description
                <Grid item>
                    <Typography variant="body1" style={{ marginTop: '8px' }}>{props.description}</Typography>
                </Grid>

                <Grid item style={{ width: '75%', marginTop: '8px' }}>
                    <Divider style={{ width: '100%' }} />
                </Grid> */}

                <div style={{ width: '50%' }}>
                    <Grid container item direction="row" alignItems="center" style={{ marginTop: '8px' }}>
                        <Grid item>
                            <SportsEsportsIcon color="primary" />
                        </Grid>
                        <Grid item item style={{ marginLeft: '8px' }}>
                            <Typography>{props.category}</Typography>
                        </Grid>
                    </Grid>

                    <Grid container item direction="row" alignItems="center" >
                        <Grid item>
                            <RoomIcon color="primary" />
                        </Grid>
                        <Grid item style={{ marginLeft: '8px' }}>
                            <Typography>From {capitalize(props.region)}</Typography>
                        </Grid>

                    </Grid>
                </div>
            </Grid>
        </Card>


    )
}