import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles(() => ({

}));

export default function SocialIcon(props) {
    const classes = useStyles();

    return (
        <Avatar
            src={`/assets/${props.platformName}.png`}
            style={{
                borderStyle: "solid",
                borderWidth: '1px',
                borderColor: '#5f85db',
                padding: '4px'
            }}>
        </Avatar>
    )
}