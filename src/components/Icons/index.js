import React from 'react';
import PropTypes from 'prop-types';
import SvgIcon from './SvgIcon';
import * as css from './Icons.scss';

export const AccountSwitch = props => (
  <SvgIcon {...props}>
    <path d="M16,9C18.33,9 23,10.17 23,12.5V15H17V12.5C17,11 16.19,9.89 15.04,9.05L16,9M8,9C10.33,9 15,10.17 15,12.5V15H1V12.5C1,10.17 5.67,9 8,9M8,7A3,3 0 0,1 5,4A3,3 0 0,1 8,1A3,3 0 0,1 11,4A3,3 0 0,1 8,7M16,7A3,3 0 0,1 13,4A3,3 0 0,1 16,1A3,3 0 0,1 19,4A3,3 0 0,1 16,7M9,16.75V19H15V16.75L18.25,20L15,23.25V21H9V23.25L5.75,20L9,16.75Z" />
  </SvgIcon>
);

export const IconExitApp = props => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
  </SvgIcon>
);

export const IconPlus = props => (
  <SvgIcon {...props}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconMinus = props => (
  <SvgIcon {...props}>
    <path d="M19 13H5v-2h14v2z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconError = props => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  </SvgIcon>
);

export const IconFileDocument = props => (
  <SvgIcon {...props}>
    <path d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z" />
  </SvgIcon>
);

export const IconFilePdf = props => (
  <SvgIcon {...props}>
    <path d="M14,9H19.5L14,3.5V9M7,2H15L21,8V20A2,2 0 0,1 19,22H7C5.89,22 5,21.1 5,20V4A2,2 0 0,1 7,2M11.93,12.44C12.34,13.34 12.86,14.08 13.46,14.59L13.87,14.91C13,15.07 11.8,15.35 10.53,15.84V15.84L10.42,15.88L10.92,14.84C11.37,13.97 11.7,13.18 11.93,12.44M18.41,16.25C18.59,16.07 18.68,15.84 18.69,15.59C18.72,15.39 18.67,15.2 18.57,15.04C18.28,14.57 17.53,14.35 16.29,14.35L15,14.42L14.13,13.84C13.5,13.32 12.93,12.41 12.53,11.28L12.57,11.14C12.9,9.81 13.21,8.2 12.55,7.54C12.39,7.38 12.17,7.3 11.94,7.3H11.7C11.33,7.3 11,7.69 10.91,8.07C10.54,9.4 10.76,10.13 11.13,11.34V11.35C10.88,12.23 10.56,13.25 10.05,14.28L9.09,16.08L8.2,16.57C7,17.32 6.43,18.16 6.32,18.69C6.28,18.88 6.3,19.05 6.37,19.23L6.4,19.28L6.88,19.59L7.32,19.7C8.13,19.7 9.05,18.75 10.29,16.63L10.47,16.56C11.5,16.23 12.78,16 14.5,15.81C15.53,16.32 16.74,16.55 17.5,16.55C17.94,16.55 18.24,16.44 18.41,16.25M18,15.54L18.09,15.65C18.08,15.75 18.05,15.76 18,15.78H17.96L17.77,15.8C17.31,15.8 16.6,15.61 15.87,15.29C15.96,15.19 16,15.19 16.1,15.19C17.5,15.19 17.9,15.44 18,15.54M8.83,17C8.18,18.19 7.59,18.85 7.14,19C7.19,18.62 7.64,17.96 8.35,17.31L8.83,17M11.85,10.09C11.62,9.19 11.61,8.46 11.78,8.04L11.85,7.92L12,7.97C12.17,8.21 12.19,8.53 12.09,9.07L12.06,9.23L11.9,10.05L11.85,10.09Z" />
  </SvgIcon>
);

export const IconFileWord = props => (
  <SvgIcon {...props}>
    <path d="M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.9,22 4,21.1 4,20V4C4,2.9 4.9,2 6,2M13,3.5V9H18.5L13,3.5M7,13L8.5,20H10.5L12,17L13.5,20H15.5L17,13H18V11H14V13H15L14.1,17.2L13,15V15H11V15L9.9,17.2L9,13H10V11H6V13H7Z" />
  </SvgIcon>
);

export const IconFileVideo = props => (
  <SvgIcon {...props}>
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M17,19V13L14,15.2V13H7V19H14V16.8L17,19Z" />
  </SvgIcon>
);

export const IconFilePowerPoint = props => (
  <SvgIcon {...props}>
    <path d="M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.9,22 4,21.1 4,20V4C4,2.9 4.9,2 6,2M13,3.5V9H18.5L13,3.5M8,11V13H9V19H8V20H12V19H11V17H13C14.66,17 16,15.66 16,14C16,12.34 14.66,11 13,11H8M13,13C13.55,13 14,13.45 14,14C14,14.55 13.55,15 13,15H11V13H13Z" />
  </SvgIcon>
);

export const IconFileAudio = props => (
  <SvgIcon {...props}>
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M9,16C7.9,16 7,16.9 7,18C7,19.1 7.9,20 9,20C10.1,20 11,19.1 11,18V13H14V11H10V16.27C9.71,16.1 9.36,16 9,16Z" />
  </SvgIcon>
);

export const IconFileChart = props => (
  <SvgIcon {...props}>
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M7,20H9V14H7V20M11,20H13V12H11V20M15,20H17V16H15V20Z" />
  </SvgIcon>
);

export const IconFileImage = props => (
  <SvgIcon {...props}>
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9C6.9,9 6,9.9 6,11C6,12.1 6.9,13 8,13C9.1,13 10,12.1 10,11C10,9.9 9.1,9 8,9Z" />
  </SvgIcon>
);

export const IconFileText = props => (
  <SvgIcon {...props}>
    <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z" />
  </SvgIcon>
);

export const IconFileExel = props => (
  <SvgIcon {...props}>
    <path d="M6,2H14L20,8V20C20,21.1 19.1,22 18,22H6C4.9,22 4,21.1 4,20V4C4,2.9 4.9,2 6,2M13,3.5V9H18.5L13,3.5M17,11H13V13H14L12,14.67L10,13H11V11H7V13H8L11,15.5L8,18H7V20H11V18H10L12,16.33L14,18H13V20H17V18H16L13,15.5L16,13H17V11Z" />
  </SvgIcon>
);

export const IconRefresh = props => (
  <SvgIcon {...props} viewBox="0 0 467.871 467.871">
    <path d="M392.098 344.131c-6.597-5.014-16.007-3.729-21.019 2.868a135.56 135.56 0 0 1-2.957 3.751c-15.046 18.411-35.315 33.36-60.321 44.474a12.31 12.31 0 0 0-.369.17c-39.456 18.831-85.618 21.405-129.896 7.274-38.875-12.657-70.505-37.162-94.017-72.837-17.462-27.997-26.613-58.428-27.264-90.524-.016-.781-.015-1.564-.021-2.346h18.402c6.919 0 10.384-8.365 5.491-13.257L46.7 190.277a7.766 7.766 0 0 0-10.983 0L2.29 223.704c-4.892 4.892-1.427 13.257 5.491 13.257H26.21c.24 38.722 10.983 75.351 31.963 108.92.062.099.125.196.188.294 27.356 41.581 64.327 70.186 109.971 85.046 21.87 6.979 44.152 10.447 66.102 10.447 29.833-.001 59.045-6.407 85.737-19.113 31.267-13.929 56.432-33.243 74.793-57.405 5.013-6.596 3.729-16.006-2.866-21.019zM460.09 233.876h-18.428a212.024 212.024 0 0 0-.364-12.362c-1.913-32.411-11.568-64.326-27.921-92.295-15.945-27.271-38.292-50.932-64.626-68.426-26.774-17.787-57.774-29.226-89.649-33.079-35.426-4.283-71.452.578-104.185 14.052-32.1 13.213-60.653 34.522-82.572 61.623-5.21 6.44-4.211 15.886 2.229 21.096 6.442 5.209 15.886 4.211 21.096-2.23 1.12-1.385 2.264-2.75 3.424-4.1 18.274-21.253 41.418-38.016 67.242-48.646 27.995-11.523 58.83-15.678 89.166-12.011 27.25 3.294 53.754 13.074 76.648 28.284 22.546 14.979 41.679 35.234 55.329 58.58 13.98 23.91 22.235 51.2 23.871 78.92a182.842 182.842 0 0 1 .313 10.595h-18.426c-6.919 0-10.384 8.365-5.491 13.257l33.427 33.427a7.766 7.766 0 0 0 10.983 0l33.427-33.427c4.89-4.893 1.425-13.258-5.493-13.258z" />
  </SvgIcon>
);

export const IconDelete = props => (
  <SvgIcon {...props}>
    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
  </SvgIcon>
);

export const IconDeleteAnimate = props => (
  <SvgIcon {...props}>
    <polyline points="19,4 15.5,4 14.5,3 9.5,3 8.5,4 5,4 5,6 19,6 " className={css.animateCap} />
    <path d="M6,19c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V7H6V19z" />
  </SvgIcon>
);

export const IconDownload = props => (
  <SvgIcon {...props}>
    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
  </SvgIcon>
);

export const IconEye = props => (
  <SvgIcon {...props}>
    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
  </SvgIcon>
);

export const IconEyeDisable = props => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none" />
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
  </SvgIcon>
);

export const IconSearch = props => (
  <SvgIcon {...props}>
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconPlay = props => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </SvgIcon>
);

export const IconPause = props => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M9 16h2V8H9v8zm3-14C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-4h2V8h-2v8z" />
  </SvgIcon>
);

export const IconClose = props => (
  <SvgIcon {...props}>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconCheck = props => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </SvgIcon>
);

export const IconCheckAll = props => (
  <SvgIcon {...props}>
    <path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" />
  </SvgIcon>
);

export const IconCheckCircle = props => (
  <SvgIcon {...props}>
    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
  </SvgIcon>
);

export const IconCompareArrows = props => (
  <SvgIcon {...props}>
    <defs>
      <path d="M0 0h24v24H0V0z" id="a" />
    </defs>
    <clipPath id="b">
      <use overflow="visible" href="#a" />
    </clipPath>
    <path clipPath="url(#b)" d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z" />
  </SvgIcon>
);

export const IconLink = props => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
  </SvgIcon>
);

export const IconArrowLeft = props => (
  <SvgIcon {...props}>
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconArrowRight = props => (
  <SvgIcon {...props}>
    <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
    <path d="M0-.25h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconArrowDown = props => (
  <SvgIcon {...props}>
    <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
    <path d="M0-.75h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconArrowUp = props => (
  <SvgIcon {...props}>
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconPointingArrowRight = props => (
  <SvgIcon {...props} viewBox="0 0 31.49 31.49">
    <svg {...props}>
      <path d="M21.205 5.007a1.112 1.112 0 0 0-1.587 0 1.12 1.12 0 0 0 0 1.571l8.047 8.047H1.111A1.106 1.106 0 0 0 0 15.737c0 .619.492 1.127 1.111 1.127h26.554l-8.047 8.032c-.429.444-.429 1.159 0 1.587a1.112 1.112 0 0 0 1.587 0l9.952-9.952a1.093 1.093 0 0 0 0-1.571l-9.952-9.953z" />
    </svg>
  </SvgIcon>
);

export const IconTime = props => (
  <SvgIcon {...props}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </SvgIcon>
);

export const IconCalendar = props => (
  <SvgIcon {...props}>
    <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1" />
  </SvgIcon>
);

export const IconFolderOpen = props => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
  </SvgIcon>
);

export const IconEdit = props => (
  <SvgIcon {...props}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconPreloader = props => (
  <SvgIcon {...props} viewBox="0 0 100 100">
    <rect fill="none" height="100" width="100" x="0" y="0" />
    <g>
      <animate
        attributeName="opacity"
        begin="-1s"
        dur="2s"
        keyTimes="0;0.33;1"
        repeatCount="indefinite"
        values="1;1;0"
      />
      <circle className={css.stroked} cx="50" cy="50" fill="none" r="40" strokeLinecap="round" strokeWidth="6">
        <animate attributeName="r" begin="-1s" dur="2s" keyTimes="0;0.33;1" repeatCount="indefinite" values="0;22;44" />
      </circle>
    </g>
    <g>
      <animate
        attributeName="opacity"
        begin="0s"
        dur="2s"
        keyTimes="0;0.33;1"
        repeatCount="indefinite"
        values="1;1;0"
      />
      <circle className={css.stroked} cx="50" cy="50" fill="none" r="40" strokeLinecap="round" strokeWidth="6">
        <animate attributeName="r" begin="0s" dur="2s" keyTimes="0;0.33;1" repeatCount="indefinite" values="0;22;44" />
      </circle>
    </g>
  </SvgIcon>
);

export const IconSkype = props => (
  <SvgIcon {...props}>
    <path d="M18,6C20.07,8.04 20.85,10.89 20.36,13.55C20.77,14.27 21,15.11 21,16A5,5 0 0,1 16,21C15.11,21 14.27,20.77 13.55,20.36C10.89,20.85 8.04,20.07 6,18C3.93,15.96 3.15,13.11 3.64,10.45C3.23,9.73 3,8.89 3,8A5,5 0 0,1 8,3C8.89,3 9.73,3.23 10.45,3.64C13.11,3.15 15.96,3.93 18,6M12.04,17.16C14.91,17.16 16.34,15.78 16.34,13.92C16.34,12.73 15.78,11.46 13.61,10.97L11.62,10.53C10.86,10.36 10,10.13 10,9.42C10,8.7 10.6,8.2 11.7,8.2C13.93,8.2 13.72,9.73 14.83,9.73C15.41,9.73 15.91,9.39 15.91,8.8C15.91,7.43 13.72,6.4 11.86,6.4C9.85,6.4 7.7,7.26 7.7,9.54C7.7,10.64 8.09,11.81 10.25,12.35L12.94,13.03C13.75,13.23 13.95,13.68 13.95,14.1C13.95,14.78 13.27,15.45 12.04,15.45C9.63,15.45 9.96,13.6 8.67,13.6C8.09,13.6 7.67,14 7.67,14.57C7.67,15.68 9,17.16 12.04,17.16Z" />
  </SvgIcon>
);

export const IconMail = props => (
  <SvgIcon {...props}>
    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
  </SvgIcon>
);

export const IconPhone = props => (
  <SvgIcon {...props}>
    <path d="M17.25,18H6.75V4H17.25M14,21H10V20H14M16,1H8A3,3 0 0,0 5,4V20A3,3 0 0,0 8,23H16A3,3 0 0,0 19,20V4A3,3 0 0,0 16,1Z" />
  </SvgIcon>
);

export const IconSend = props => (
  <SvgIcon {...props}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconGarbage = props => (
  <SvgIcon viewBox="0 0 486.4 486.4" {...props}>
    <path d="M446 70H344.8V53.5c0-29.5-24-53.5-53.5-53.5h-96.2c-29.5 0-53.5 24-53.5 53.5V70H40.4c-7.5 0-13.5 6-13.5 13.5S32.9 97 40.4 97h24.4v317.2c0 39.8 32.4 72.2 72.2 72.2h212.4c39.8 0 72.2-32.4 72.2-72.2V97H446c7.5 0 13.5-6 13.5-13.5S453.5 70 446 70zM168.6 53.5c0-14.6 11.9-26.5 26.5-26.5h96.2c14.6 0 26.5 11.9 26.5 26.5V70H168.6V53.5zm226 360.7c0 24.9-20.3 45.2-45.2 45.2H137c-24.9 0-45.2-20.3-45.2-45.2V97h302.9v317.2h-.1z" />
    <path d="M243.2 411c7.5 0 13.5-6 13.5-13.5V158.9c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v238.5c0 7.5 6 13.6 13.5 13.6zM155.1 396.1c7.5 0 13.5-6 13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v208.9c0 7.5 6.1 13.5 13.5 13.5zM331.3 396.1c7.5 0 13.5-6 13.5-13.5V173.7c0-7.5-6-13.5-13.5-13.5s-13.5 6-13.5 13.5v208.9c0 7.5 6 13.5 13.5 13.5z" />
  </SvgIcon>
);

export const IconLock = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </SvgIcon>
);

export const IconBook = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M19,2L14,6.5V17.5L19,13V2M6.5,5C4.55,5 2.45,5.4 1,6.5V21.16C1,21.41 1.25,21.66 1.5,21.66C1.6,21.66 1.65,21.59 1.75,21.59C3.1,20.94 5.05,20.5 6.5,20.5C8.45,20.5 10.55,20.9 12,22C13.35,21.15 15.8,20.5 17.5,20.5C19.15,20.5 20.85,20.81 22.25,21.56C22.35,21.61 22.4,21.59 22.5,21.59C22.75,21.59 23,21.34 23,21.09V6.5C22.4,6.05 21.75,5.75 21,5.5V7.5L21,13V19C19.9,18.65 18.7,18.5 17.5,18.5C15.8,18.5 13.35,19.15 12,20V13L12,8.5V6.5C10.55,5.4 8.45,5 6.5,5V5Z" />
  </SvgIcon>
);

export const IconList = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconMenu = props => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </SvgIcon>
);

export const IconLaptop = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2H0c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2h-4zM4 5h16v11H4V5zm8 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
  </SvgIcon>
);

export const IconCall = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.58l2.2-2.21c.28-.27.36-.66.25-1.01C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM12 3v10l3-3h6V3h-9z" />
  </SvgIcon>
);

export const IconPlane = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M10.18 9" />
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconComment = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </SvgIcon>
);

export const IconComments = props => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
  </SvgIcon>
);

export const IconCase = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M14,6H10V4H14M20,6H16V4L14,2H10L8,4V6H4C2.89,6 2,6.89 2,8V19A2,2 0 0,0 4,21H20A2,2 0 0,0 22,19V8C22,6.89 21.1,6 20,6Z" />
  </SvgIcon>
);

export const IconHospital = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M18,14H14V18H10V14H6V10H10V6H14V10H18M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
  </SvgIcon>
);

export const IconPresentation = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M2,3H10A2,2 0 0,1 12,1A2,2 0 0,1 14,3H22V5H21V16H15.25L17,22H15L13.25,16H10.75L9,22H7L8.75,16H3V5H2V3M5,5V14H19V5H5M11.85,11.85C11.76,11.94 11.64,12 11.5,12A0.5,0.5 0 0,1 11,11.5V7.5A0.5,0.5 0 0,1 11.5,7C11.64,7 11.76,7.06 11.85,7.15L13.25,8.54C13.57,8.86 13.89,9.18 13.89,9.5C13.89,9.82 13.57,10.14 13.25,10.46L11.85,11.85Z" />
  </SvgIcon>
);

export const IconCheckList = props => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <defs>
      <path d="M0 0h24v24H0V0z" id="IconCheckList_a" />
    </defs>
    <clipPath id="IconCheckList_b">
      <use overflow="visible" xlinkHref="#IconCheckList_a" />
    </clipPath>
    <path
      clipPath="url(#IconCheckList_b)"
      d="M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"
    />
  </SvgIcon>
);

export const IconOrganization = props => (
  <SvgIcon viewBox="0 0 512 512" {...props}>
    <path d="M448.8,417.732H270.999v-82.465h97.467c8.284,0,15-6.717,15-15c0-70.287-57.182-127.469-127.467-127.469 S128.534,249.98,128.534,320.267c0,8.283,6.715,15,15,15h97.465v82.465H63.2c-8.285,0-15,6.717-15,15V497c0,8.285,6.715,15,15,15 c8.283,0,15-6.715,15-15v-49.268h162.799V497c0,8.285,6.716,15,15,15s15-6.715,15-15v-49.268H433.8V497c0,8.285,6.716,15,15,15 s15-6.715,15-15v-64.268C463.8,424.449,457.084,417.732,448.8,417.732z" />
    <circle cx="256" cy="63.2" r="63.2" />
  </SvgIcon>
);

export const IconCircleProgressBar = props => {
  let calculateProgress = 300;
  let other = {};
  if (props && props.progress) {
    const { progress, ...propsWithoutProgress } = props;
    other = propsWithoutProgress;
    calculateProgress = 300 - progress * 3;
  }

  return (
    <SvgIcon viewBox="-9 -9 118 118" {...other} shapeRendering="geometricprecision">
      <path
        d="M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96"
        stroke="currentColor"
        strokeWidth="1"
        fillOpacity="0"
      />
      <path
        d="M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96"
        stroke="currentColor"
        strokeWidth="10"
        fillOpacity="0"
        style={{ strokeDasharray: '301.635, 301.635', strokeDashoffset: calculateProgress }}
      />
    </SvgIcon>
  );
};
// IconCircleProgressBar.defaultProps = {progress: 0};
IconCircleProgressBar.propTypes = { progress: PropTypes.number };

export const IconBug = props => {
  return (
    <SvgIcon viewBox="0 0 465.027 465.027" {...props}>
      <path d="M81.73,23.09c2.89,0.518,70.127,14.086,84.557,89.864c-18.292,19.327-29.638,46.42-29.638,76.512 c0,0.28,0.022,0.539,0.022,0.798h191.678c0-0.259,0.043-0.518,0.043-0.798c0-30.113-11.389-57.184-29.703-76.533 c14.452-75.778,81.732-89.346,84.644-89.864c6.256-1.165,10.44-7.183,9.319-13.525c-1.208-6.32-7.183-10.462-13.482-9.362 c-0.841,0.151-78.302,15.143-100.52,96.421c-13.719-8.326-29.401-13.029-46.14-13.029c-16.674,0-32.399,4.746-46.118,13.029 C164.173,15.324,86.713,0.333,85.893,0.182C79.573-0.94,73.598,3.245,72.39,9.565C71.225,15.907,75.431,21.947,81.73,23.09z" />
      <path d="M458.313,135.733c2.524-8.197-2.049-16.868-10.225-19.414c-8.218-2.502-16.847,2.049-19.371,10.268 c0,0-18.961,61.132-22.994,74.225c-8.262,2.265-33.327,9.34-50.691,14.107c-0.626-2.761-1.165-5.544-1.769-8.24H111.8 c-0.69,2.696-1.208,5.479-1.79,8.24c-17.386-4.789-42.494-11.842-50.713-14.107c-4.055-13.137-22.994-74.268-22.994-74.268 c-2.502-8.197-11.238-12.748-19.392-10.246c-8.197,2.545-12.727,11.238-10.181,19.414l27.977,90.382l70.817,19.673 c-0.539,6.622-0.884,13.18-0.884,19.953c0,8.305,0.453,16.458,1.208,24.461l-70.709,31.644L13.07,446.805 c-1.51,8.434,4.077,16.459,12.533,17.99c8.434,1.467,16.48-4.163,17.947-12.597c0,0,16.76-94.782,19.263-108.781 c6.773-3.085,29.207-13.05,48.254-21.592c16.804,71.464,64.799,123.148,121.444,123.148c56.666,0,104.705-51.684,121.487-123.148 c19.025,8.542,41.481,18.508,48.254,21.592c2.438,13.999,19.263,108.781,19.263,108.781c1.445,8.434,9.534,14.064,17.99,12.597 c8.434-1.532,14.021-9.556,12.49-17.99l-22.089-124.981l-70.687-31.623c0.755-8.003,1.23-16.157,1.23-24.461 c0-6.73-0.388-13.331-0.884-19.953l70.817-19.673L458.313,135.733z" />
    </SvgIcon>
  );
};

export const IconUser = props => (
  <SvgIcon viewBox="0 0 53 53" {...props}>
    <g>
      <path
        fill="#E7ECED"
        d="M18.613,41.552l-7.907,4.313c-0.464,0.253-0.881,0.564-1.269,0.903C14.047,50.655,19.998,53,26.5,53  c6.454,0,12.367-2.31,16.964-6.144c-0.424-0.358-0.884-0.68-1.394-0.934l-8.467-4.233c-1.094-0.547-1.785-1.665-1.785-2.888v-3.322  c0.238-0.271,0.51-0.619,0.801-1.03c1.154-1.63,2.027-3.423,2.632-5.304c1.086-0.335,1.886-1.338,1.886-2.53v-3.546  c0-0.78-0.347-1.477-0.886-1.965v-5.126c0,0,1.053-7.977-9.75-7.977s-9.75,7.977-9.75,7.977v5.126  c-0.54,0.488-0.886,1.185-0.886,1.965v3.546c0,0.934,0.491,1.756,1.226,2.231c0.886,3.857,3.206,6.633,3.206,6.633v3.24  C20.296,39.899,19.65,40.986,18.613,41.552z"
        data-original="#E7ECED"
      />
      <g>
        <path
          fill="#2B3E50"
          d="M26.953,0.004C12.32-0.246,0.254,11.414,0.004,26.047C-0.138,34.344,3.56,41.801,9.448,46.76   c0.385-0.336,0.798-0.644,1.257-0.894l7.907-4.313c1.037-0.566,1.683-1.653,1.683-2.835v-3.24c0,0-2.321-2.776-3.206-6.633   c-0.734-0.475-1.226-1.296-1.226-2.231v-3.546c0-0.78,0.347-1.477,0.886-1.965v-5.126c0,0-1.053-7.977,9.75-7.977   s9.75,7.977,9.75,7.977v5.126c0.54,0.488,0.886,1.185,0.886,1.965v3.546c0,1.192-0.8,2.195-1.886,2.53   c-0.605,1.881-1.478,3.674-2.632,5.304c-0.291,0.411-0.563,0.759-0.801,1.03V38.8c0,1.223,0.691,2.342,1.785,2.888l8.467,4.233   c0.508,0.254,0.967,0.575,1.39,0.932c5.71-4.762,9.399-11.882,9.536-19.9C53.246,12.32,41.587,0.254,26.953,0.004z"
        />
      </g>
    </g>
  </SvgIcon>
);
