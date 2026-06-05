import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
* {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
}

body {
    box-sizing: border-box;
    color: rgba(0,0,0,0.87);
    background-color: #F4F6F8;
}

a, a:link,a:visited,a:focus,a:hover,a:active {
    text-decoration: none;
    color: inherit;
}

`;

export default GlobalStyles;
