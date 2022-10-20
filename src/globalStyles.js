import { injectGlobal } from 'emotion'
// todo: emotion
injectGlobal`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: Urbanist;
    background: #F0F6FA;
    margin: 0;
  }

  a {
    color: #1EEFA4;
    text-decoration: none;
    transition: 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
`
