import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import initFirebase from '../utils/auth/initFirebase';
import CircularProgress from '@material-ui/core/CircularProgress';
import getImage from '../utils/helperFunctions/getImage';

const useStyles = makeStyles(() => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },

    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },

    cardContent: {
        flexGrow: 1,
    },
}));

export default function OfferCard(props) {
    const classes = useStyles();
    const [offerImage, setOfferImage] = React.useState(null)

    useEffect(() => {
        const fetchImage = async () => {
            const res = await getImage(props.image)
            setOfferImage(res);
        }
        if (props.image) {
            initFirebase();
            fetchImage()
        }
    }, [props.image])
    console.log(props);

    return (
        <Link href={`/offers/${props.id}`}>
            <Card className={classes.card} >
                {offerImage ? <
                    CardMedia
                    className={classes.cardMedia}
                    image={offerImage}
                    title="Image title"
                /> : <CircularProgress style={{ marginLeft: '50%' }} color="secondary" />
                }
                <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.title}
                    </Typography>
                    <Typography>
                        {props.description}
                    </Typography>
                    <Grid alignItems="center" justify="flex-start" container direction="row" spacing={1} style={{ marginTop: '8px' }}>
                        {
                            props.criteria?.map((criteria, key) =>
                                <Grid item key={key}>
                                    <Chip label={criteria} color="primary" />
                                </Grid>
                            )
                        }
                    </Grid>
                </CardContent>
            </Card>
        </Link>
    )
}