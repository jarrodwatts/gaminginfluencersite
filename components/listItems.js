import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import PagesIcon from '@material-ui/icons/Pages';
import DescriptionIcon from '@material-ui/icons/Description';
import Router from 'next/router'

export const mainListItems = (
    <div>
        <ListItem button onClick={() => {Router.push("/dashboard")}}>
            <ListItemIcon>
                <DashboardIcon color="primary"/>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button onClick={() => {Router.push("/dashboard/offers")}}>
            <ListItemIcon>
                <PagesIcon color="primary"/>
            </ListItemIcon>
            <ListItemText primary="Offers" />
        </ListItem>

        <ListItem button onClick={() => {Router.push("/dashboard/influencers")}}>
            <ListItemIcon>
                <PeopleIcon color="primary"/>
            </ListItemIcon>
            <ListItemText primary="Influencers" />
        </ListItem>

        <ListItem button onClick={() => {Router.push("/dashboard/contracts")}}>
            <ListItemIcon>
                <DescriptionIcon color="primary"/>
            </ListItemIcon>
            <ListItemText primary="Contracts" />
        </ListItem>

    </div>
);

export const secondaryListItems = (
    <div>
        {/* <ListSubheader inset>Manage Your Profile</ListSubheader> */}
        <ListItem button onClick={() => {Router.push("/dashboard/profile")}}>
            <ListItemIcon>
                <AccountCircleIcon color="primary"/>
            </ListItemIcon>
            <ListItemText primary="Profile" />
        </ListItem>

        <ListItem button onClick={() => {Router.push("/dashboard/settings")}}>
            <ListItemIcon>
                <SettingsIcon color="primary"/>
            </ListItemIcon>
            <ListItemText primary="Settings" />
        </ListItem>

    </div>
);