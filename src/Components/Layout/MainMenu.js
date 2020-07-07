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

function MainMenuItem({ key, label, icon }) {
  return (
    <ListItem
      button
      key={key}
      component={RouterLink}
      to={`/${key}`}
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
        key="dashboard"
        label="Dashboard"
        icon={<DashboardIcon />}
      />
      <MainMenuItem
        key="orders"
        label="Orders"
        icon={<ShoppingBasketIcon />}
      />
      <MainMenuItem
        key="customers"
        label="Customers"
        icon={<FaceIcon />}
      />
      <MainMenuItem
        key="coupons"
        label="Coupons"
        icon={<LocalOfferIcon />}
      />
      <Divider />
      <MainMenuItem
        key="users"
        label="Users"
        icon={<PeopleIcon />}
      />
      <MainMenuItem
        key="product"
        label="Product"
        icon={<LaptopIcon />}
      />
      <MainMenuItem
        key="settings"
        label="Settings"
        icon={<SettingsIcon />}
      />
    </List>
  );
};