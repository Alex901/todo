import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Icon from '@mdi/react';
import { mdiTranslateVariant } from '@mdi/js';
import './SelectLanguageButton.css';
import ukFlag from '../../../../../assets/language_icons/uk-flag.png';
import sweFlag from '../../../../../assets/language_icons/flag-sweden.png';
import { useTranslation } from "react-i18next";

const SelectLanguageButton = ({ isLoggedIn, isMobile, className }) => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLanguageMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    handleLanguageMenuClose();
  };

  return (
    <>
      <IconButton onClick={handleLanguageMenuClick} color="inherit" className={`language-button ${className} ${!isLoggedIn ? 'logged-out' : ''}`}>
        <Icon className={`notification-icon`} path={mdiTranslateVariant} size={1.2} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLanguageMenuClose}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isMobile ? 'left' : 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isMobile ? 'right' : 'center',
        }}
      >
        <MenuItem onClick={() => handleLanguageChange('en')}>
          <img src={ukFlag} alt="English" className="flag-icon" />
          {t('english')}
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('sv')}>
          <img src={sweFlag} alt="Swedish" className="flag-icon" />
          {t('swedish')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default SelectLanguageButton;