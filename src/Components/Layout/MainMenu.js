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

function MainMenuItem({ endpoint, label, icon }) {
  return (
    <ListItem
      button
      key={endpoint}
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
  return (
    <List>
      <MainMenuItem
        endpoint="dashboard"
        label="Dashboard"
        icon={<DashboardIcon />}
      />
      <MainMenuItem
        endpoint="orders"
        label="Orders"
        icon={<ShoppingBasketIcon />}
      />
      <MainMenuItem
        endpoint="customers"
        label="Customers"
        icon={<FaceIcon />}
      />
      <MainMenuItem
        endpoint="coupons"
        label="Coupons"
        icon={<LocalOfferIcon />}
      />
      <Divider />
      <MainMenuItem
        endpoint="users"
        label="Users"
        icon={<PeopleIcon />}
      />
      <MainMenuItem
        endpoint="product"
        label="Product"
        icon={<LaptopIcon />}
      />
      <MainMenuItem
        endpoint="settings"
        label="Settings"
        icon={<SettingsIcon />}
      />
    </List>
  );
};