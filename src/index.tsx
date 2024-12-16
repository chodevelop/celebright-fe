import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import styled from '@emotion/styled';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import theme from './theme';
import { OverlayProvider } from './hooks/useOverlay';

// 글로벌 스타일을 적용할 래퍼 컴포넌트
const AppWrapper = styled.div`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: Arial, sans-serif;
    color: #333;
    background-color:red;
  }
  /* 추가 글로벌 스타일 설정 가능 */
`;


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppWrapper>
        <OverlayProvider>
          <App />
        </OverlayProvider>
      </AppWrapper>
    </ThemeProvider>
  </BrowserRouter>
);
