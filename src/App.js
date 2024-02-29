import { useState, createContext, useEffect } from 'react';
import Layout from './layouts/Layout';
import {BrowserRouter} from 'react-router-dom'
import {Container} from "react-bootstrap";
import AppRouter from "./route/AppRouter";
import {UserInfo} from "./api/const/UserInfo";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [member, setMember] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem(UserInfo.EMAIL);
    const id = localStorage.getItem(UserInfo.ID)
    setMember({ email, id });
  }, []);

  return (
      <AuthContext.Provider
          value={{ member, setMember }}
      >
        {children}
      </AuthContext.Provider>
  );
};

const App = () => {
  return (
      <>
          <AuthProvider>
              <BrowserRouter>
                  <Layout>
                      <Container style={ {minHeight: "75vh"} }>
                          <AppRouter />
                      </Container>
                  </Layout>
              </BrowserRouter>
          </AuthProvider>
      </>
  )
}

export default App;
