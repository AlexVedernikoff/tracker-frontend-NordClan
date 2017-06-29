import React from 'react';
import SvgIcon from './SvgIcon';
import * as css from './Icons.scss';

export const AccountSwitch = (props) => (
  <SvgIcon {...props}>
    <path d="M16,9C18.33,9 23,10.17 23,12.5V15H17V12.5C17,11 16.19,9.89 15.04,9.05L16,9M8,9C10.33,9 15,10.17 15,12.5V15H1V12.5C1,10.17 5.67,9 8,9M8,7A3,3 0 0,1 5,4A3,3 0 0,1 8,1A3,3 0 0,1 11,4A3,3 0 0,1 8,7M16,7A3,3 0 0,1 13,4A3,3 0 0,1 16,1A3,3 0 0,1 19,4A3,3 0 0,1 16,7M9,16.75V19H15V16.75L18.25,20L15,23.25V21H9V23.25L5.75,20L9,16.75Z" />
  </SvgIcon>
);

export const IconExitApp = (props) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
  </SvgIcon>
);

export const IconPlus = (props) => (
  <SvgIcon {...props}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </SvgIcon>
);

export const IconMinus = (props) => (
  <SvgIcon {...props}>
    <path d="M19 13H5v-2h14v2z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </SvgIcon>
);

export const IconFileDocument = (props) => (
  <SvgIcon {...props}>
    <path d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z" />
  </SvgIcon>
);

export const IconFilePdf = (props) => (
  <SvgIcon {...props}>
    <path d="M14,9H19.5L14,3.5V9M7,2H15L21,8V20A2,2 0 0,1 19,22H7C5.89,22 5,21.1 5,20V4A2,2 0 0,1 7,2M11.93,12.44C12.34,13.34 12.86,14.08 13.46,14.59L13.87,14.91C13,15.07 11.8,15.35 10.53,15.84V15.84L10.42,15.88L10.92,14.84C11.37,13.97 11.7,13.18 11.93,12.44M18.41,16.25C18.59,16.07 18.68,15.84 18.69,15.59C18.72,15.39 18.67,15.2 18.57,15.04C18.28,14.57 17.53,14.35 16.29,14.35L15,14.42L14.13,13.84C13.5,13.32 12.93,12.41 12.53,11.28L12.57,11.14C12.9,9.81 13.21,8.2 12.55,7.54C12.39,7.38 12.17,7.3 11.94,7.3H11.7C11.33,7.3 11,7.69 10.91,8.07C10.54,9.4 10.76,10.13 11.13,11.34V11.35C10.88,12.23 10.56,13.25 10.05,14.28L9.09,16.08L8.2,16.57C7,17.32 6.43,18.16 6.32,18.69C6.28,18.88 6.3,19.05 6.37,19.23L6.4,19.28L6.88,19.59L7.32,19.7C8.13,19.7 9.05,18.75 10.29,16.63L10.47,16.56C11.5,16.23 12.78,16 14.5,15.81C15.53,16.32 16.74,16.55 17.5,16.55C17.94,16.55 18.24,16.44 18.41,16.25M18,15.54L18.09,15.65C18.08,15.75 18.05,15.76 18,15.78H17.96L17.77,15.8C17.31,15.8 16.6,15.61 15.87,15.29C15.96,15.19 16,15.19 16.1,15.19C17.5,15.19 17.9,15.44 18,15.54M8.83,17C8.18,18.19 7.59,18.85 7.14,19C7.19,18.62 7.64,17.96 8.35,17.31L8.83,17M11.85,10.09C11.62,9.19 11.61,8.46 11.78,8.04L11.85,7.92L12,7.97C12.17,8.21 12.19,8.53 12.09,9.07L12.06,9.23L11.9,10.05L11.85,10.09Z" />
  </SvgIcon>
);

export const IconFileWord = (props) => (
  <SvgIcon {...props}>
    <path d="M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.9,22 4,21.1 4,20V4C4,2.9 4.9,2 6,2M13,3.5V9H18.5L13,3.5M7,13L8.5,20H10.5L12,17L13.5,20H15.5L17,13H18V11H14V13H15L14.1,17.2L13,15V15H11V15L9.9,17.2L9,13H10V11H6V13H7Z"/>
  </SvgIcon>
);

export const IconFileVideo = (props) => (
  <SvgIcon {...props}>
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M17,19V13L14,15.2V13H7V19H14V16.8L17,19Z"/>
  </SvgIcon>
);

export const IconFilePowerPoint = (props) => (
  <SvgIcon {...props}>
    <path d="M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.9,22 4,21.1 4,20V4C4,2.9 4.9,2 6,2M13,3.5V9H18.5L13,3.5M8,11V13H9V19H8V20H12V19H11V17H13C14.66,17 16,15.66 16,14C16,12.34 14.66,11 13,11H8M13,13C13.55,13 14,13.45 14,14C14,14.55 13.55,15 13,15H11V13H13Z"/>
  </SvgIcon>
);

export const IconFileAudio = (props) => (
  <SvgIcon {...props}>
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M9,16C7.9,16 7,16.9 7,18C7,19.1 7.9,20 9,20C10.1,20 11,19.1 11,18V13H14V11H10V16.27C9.71,16.1 9.36,16 9,16Z"/>
  </SvgIcon>
);

export const IconFileChart = (props) => (
  <SvgIcon {...props}>
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M7,20H9V14H7V20M11,20H13V12H11V20M15,20H17V16H15V20Z"/>
  </SvgIcon>
);

export const IconFileImage = (props) => (
  <SvgIcon {...props}>
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9C6.9,9 6,9.9 6,11C6,12.1 6.9,13 8,13C9.1,13 10,12.1 10,11C10,9.9 9.1,9 8,9Z"/>
  </SvgIcon>
);

export const IconFileText = (props) => (
  <SvgIcon {...props}>
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"/>
  </SvgIcon>
);

export const IconFileExel = (props) => (
  <SvgIcon {...props}>
    <path d="M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.9,22 4,21.1 4,20V4C4,2.9 4.9,2 6,2M13,3.5V9H18.5L13,3.5M17,11H13V13H14L12,14.67L10,13H11V11H7V13H8L11,15.5L8,18H7V20H11V18H10L12,16.33L14,18H13V20H17V18H16L13,15.5L16,13H17V11Z"/>
  </SvgIcon>
);

export const IconDelete = (props) => (
  <SvgIcon {...props}>
    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
  </SvgIcon>
);

export const IconDownload = (props) => (
  <SvgIcon {...props}>
    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
  </SvgIcon>
);

export const IconEye = (props) => (
  <SvgIcon {...props}>
    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
  </SvgIcon>
);

export const IconSearch = (props) => (
  <SvgIcon {...props}>
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </SvgIcon>
);

export const IconPlay = (props) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </SvgIcon>
);

export const IconPause = (props) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z"/>
  </SvgIcon>
);

export const IconClose = (props) => (
  <SvgIcon {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </SvgIcon>
);

export const IconCheck = (props) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </SvgIcon>
);

export const IconCompareArrows = (props) => (
  <SvgIcon {...props}>
    <defs>
        <path d="M0 0h24v24H0V0z" id="a"/>
    </defs>
    <clipPath id="b">
        <use overflow="visible" href="#a"/>
    </clipPath>
    <path clipPath="url(#b)" d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"/>
  </SvgIcon>
);

export const IconLink = (props) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
  </SvgIcon>
);

export const IconArrowRight = (props) => (
  <SvgIcon {...props}>
    <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/>
    <path d="M0-.25h24v24H0z" fill="none"/>
  </SvgIcon>
);

export const IconArrowDown = (props) => (
  <SvgIcon {...props}>
    <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
    <path d="M0-.75h24v24H0z" fill="none"/>
  </SvgIcon>
);

export const IconTime = (props) => (
  <SvgIcon {...props}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
  </SvgIcon>
);

export const IconFolderOpen = (props) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
  </SvgIcon>
);

export const IconEdit = (props) => (
  <SvgIcon {...props}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </SvgIcon>
);

export const IconPreloader = (props) => (
  <SvgIcon {...props} viewBox="0 0 100 100">
    <rect fill="none" height="100" width="100" x="0" y="0" />
    <g>
      <animate attributeName="opacity" begin="-1s" dur="2s" keyTimes="0;0.33;1" repeatCount="indefinite" values="1;1;0"/>
      <circle className={css.stroked} cx="50" cy="50" fill="none" r="40" strokeLinecap="round" strokeWidth="6">
        <animate attributeName="r" begin="-1s" dur="2s" keyTimes="0;0.33;1" repeatCount="indefinite" values="0;22;44" />
      </circle>
    </g>
    <g>
      <animate attributeName="opacity" begin="0s" dur="2s" keyTimes="0;0.33;1" repeatCount="indefinite" values="1;1;0" />
      <circle className={css.stroked} cx="50" cy="50" fill="none" r="40" strokeLinecap="round" strokeWidth="6">
        <animate attributeName="r" begin="0s" dur="2s" keyTimes="0;0.33;1" repeatCount="indefinite" values="0;22;44" />
      </circle>
    </g>
  </SvgIcon>
);

export const IconSkype = (props) => (
  <SvgIcon {...props}>
    <path d="M18,6C20.07,8.04 20.85,10.89 20.36,13.55C20.77,14.27 21,15.11 21,16A5,5 0 0,1 16,21C15.11,21 14.27,20.77 13.55,20.36C10.89,20.85 8.04,20.07 6,18C3.93,15.96 3.15,13.11 3.64,10.45C3.23,9.73 3,8.89 3,8A5,5 0 0,1 8,3C8.89,3 9.73,3.23 10.45,3.64C13.11,3.15 15.96,3.93 18,6M12.04,17.16C14.91,17.16 16.34,15.78 16.34,13.92C16.34,12.73 15.78,11.46 13.61,10.97L11.62,10.53C10.86,10.36 10,10.13 10,9.42C10,8.7 10.6,8.2 11.7,8.2C13.93,8.2 13.72,9.73 14.83,9.73C15.41,9.73 15.91,9.39 15.91,8.8C15.91,7.43 13.72,6.4 11.86,6.4C9.85,6.4 7.7,7.26 7.7,9.54C7.7,10.64 8.09,11.81 10.25,12.35L12.94,13.03C13.75,13.23 13.95,13.68 13.95,14.1C13.95,14.78 13.27,15.45 12.04,15.45C9.63,15.45 9.96,13.6 8.67,13.6C8.09,13.6 7.67,14 7.67,14.57C7.67,15.68 9,17.16 12.04,17.16Z" />
  </SvgIcon>
);

export const IconMail = (props) => (
  <SvgIcon {...props}>
    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
  </SvgIcon>
);

export const IconPhone = (props) => (
  <SvgIcon {...props}>
    <path d="M17.25,18H6.75V4H17.25M14,21H10V20H14M16,1H8A3,3 0 0,0 5,4V20A3,3 0 0,0 8,23H16A3,3 0 0,0 19,20V4A3,3 0 0,0 16,1Z" />
  </SvgIcon>
);

export const IconSend = (props) => (
  <SvgIcon {...props}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </SvgIcon>
);
