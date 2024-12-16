import { createTheme } from '@mui/material/styles';

const theme = createTheme({

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollbarGutter: 'stable', //스클롤바 있든 없든 돌일한 레이아웃 유지 처리
        },
        body: {
          backgroundColor: '#F8F9FF',
        }
      }
    },
    MuiModal: {
      defaultProps: {
        disableScrollLock: true, // 스클로락을 풀음, 스클롤바가 사라지면서 레이아웃 밀림 방지로
      },
    },
  },
  palette: {
    primary: {
      // main: '#9252e7',
      // main: '#7B53FF',
      main: '#A88EFF',
      contrastText: '#FFFFFF',

    },
    secondary: {
      main: '#A88EFF',
    },
  },
  breakpoints: {
    values: {
      xs: 0, // small devices, usually mobile
      sm: 600, // tablets
      md: 960, // small laptops
      lg: 1280, // desktops
      xl: 1920, // large desktops
    },
  },
});

export default theme;
