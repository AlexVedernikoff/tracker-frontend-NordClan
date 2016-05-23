import Colors from 'material-ui/lib/styles/colors';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import Spacing from 'material-ui/lib/styles/spacing';
import zIndex from 'material-ui/lib/styles/zIndex';

export default function(theme = 'default') {
  const defaultTheme = {
    spacing: Spacing,
    zIndex: zIndex,
    fontFamily: 'Roboto, sans-serif',
    palette: {
      primary1Color: Colors.purple900,
      primary2Color: Colors.cyan700,
      primary3Color: Colors.lightBlack,
      accent1Color: Colors.pinkA200,
      accent2Color: Colors.grey100,
      accent3Color: Colors.grey500,
      textColor: Colors.darkBlack,
      alternateTextColor: Colors.white,
      canvasColor: Colors.grey100,
      borderColor: Colors.grey300,
      disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
      pickerHeaderColor: Colors.cyan500,

      backgroundColor: '#f5f5f5',
      activeIcon: '#689F37'

    }
  };
  switch (theme) {
    case 'indigo':
      return {
        ...defaultTheme,
        palette: {
          primary1Color: Colors.purple700,
          primary2Color: Colors.cyan500,
          primary3Color: Colors.lightBlack,
          accent1Color: Colors.pinkA100,
          accent2Color: Colors.grey100,
          accent3Color: Colors.grey500,
          textColor: Colors.darkBlack,
          alternateTextColor: Colors.white,
          canvasColor: Colors.white,
          borderColor: Colors.grey300,
          disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
          pickerHeaderColor: Colors.cyan500
        }
      };
    default:
      return defaultTheme;
  }
}
