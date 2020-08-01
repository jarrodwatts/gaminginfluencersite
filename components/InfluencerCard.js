import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import { useRouter } from 'next/router'
import Router from 'next/router'

const useStyles = makeStyles((theme) => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },

    cardContent: {
        flexGrow: 1,
    },
}));

export default function InfluencerCard(props) {
    const classes = useStyles();
    return (
        <Card className={classes.card} >
            <Link color="inherit" href={`/influencer/${props.uid}`}>
                <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                />
                <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2" color="secondary">
                        <b>{props.displayName}</b>
                    </Typography>

                    <Typography gutterBottom variant="h6" component="h3">
                        {props.category}
                    </Typography>

                    <Typography gutterBottom varaint="body2">
                        {props.description}
                    </Typography>

                </CardContent>
            </Link>

            <CardActions>
                {props.socialMediaPlatforms ?
                    Object.keys(props.socialMediaPlatforms).map((platform, key) =>
                        <React.Fragment key={key}>
                            <Button onClick={() => { document.location.href = `${props.socialMediaPlatforms[platform]}` }}>
                                <Avatar src={`/assets/${platform}.png`} className={classes.small} alt={platform} />
                            </Button>
                        </React.Fragment>
                    ) : null
                }
            </CardActions>
        </Card>
    )
}