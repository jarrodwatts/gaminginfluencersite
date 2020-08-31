import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { capitalize } from '../utils/helperFunctions/stringFormatting';

export default function SocialMediaListItem(props) {

    return (
        <TableRow>
            <TableCell>
                <Grid container direction="row" spacing={1} alignItems="center">
                    <Grid item><Avatar src={`/assets/${props.platformName}.png`} /></Grid><Grid item><Typography><b>{capitalize(props.platformName)}</b></Typography></Grid>
                </Grid>
            </TableCell>
            <TableCell><Typography>{capitalize(props.details.profileName)}</Typography></TableCell>
            <TableCell><Typography>{props.details.following}</Typography></TableCell>
            <TableCell><Typography>{props.details.followers}</Typography></TableCell>
            <TableCell><Typography>{props.details.posts}</Typography></TableCell>
        </TableRow>
    )
}

