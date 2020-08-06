import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Face as FaceIcon,
  LocalOffer as LocalOfferIcon,
  Laptop as LaptopIcon,
  Settings as SettingsIcon
} from '@material-ui/icons';
import Auth, { roles } from '../../Services/Auth';

// List of menu items
// Set `access` to null if all users have access

const _adminRoles = [roles.superadmin, roles.admin];

const _menu = [
  {
    endpoint: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    access: _adminRoles,
  },
  {
    endpoint: 'orders',
    label: 'Orders',
    icon: <ShoppingBasketIcon />,
    access: null,
  },
  {
    endpoint: 'customers',
    label: 'Customers',
    icon: <FaceIcon />,
    access: _adminRoles,
  },
  {
    endpoint: 'coupons',
    label: 'Coupons',
    icon: <LocalOfferIcon />,
    access: _adminRoles,
  },
  {
    content: <Divider />,
    access: _adminRoles
  },
  {
    endpoint: 'users',
    label: 'Users',
    icon: <PeopleIcon />,
    access: _adminRoles,
  },
  {
    endpoint: 'product',
    label: 'Product',
    icon: <LaptopIcon />,
    access: _adminRoles,
  },
  {
    endpoint: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    access: _adminRoles,
  },
];

function MainMenuItem({ endpoint, label, icon }) {
  return (
    <ListItem
      button
      component={RouterLink}
      to={`/${endpoint}`}
    >
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
      />
    </ListItem>
  )
}

export default function MainMenu() {
  let currentUser = Auth.currentUserValue;

  return (
    <List>
      {_menu.map(item => {
        let { access, ...itemParams } = item;

        if (access == null || access.includes(currentUser.role)) {
          if (item.endpoint) {
            return <MainMenuItem {...itemParams} />
          } else {
            return item.content;
          }
        }

        return '';
      })}
    </List>
  );
};