import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Contacts from "./scenes/contacts";
import Dashboard from "./scenes/dashboard";
import Invoices from "./scenes/invoices";
import { Login } from "./scenes/login";
import Team from "./scenes/team";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/team"
        element={
          <Layout>
            <Team />
          </Layout>
        }
      />
      <Route
        path="/contacts"
        element={
          <Layout>
            <Contacts />
          </Layout>
        }
      />
      <Route
        path="/invoices"
        element={
          <Layout>
            <Invoices />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/form" element={<Form />} /> */}
      {/* <Route path="/bar" element={<Bar />} /> */}
      {/* <Route path="/pie" element={<Pie />} /> */}
      {/* <Route path="/line" element={<Line />} /> */}
      {/* <Route path="/faq" element={<FAQ />} /> */}
      {/* <Route path="/calendar" element={<Calendar />} /> */}
      {/* <Route path="/geography" element={<Geography />} /> */}
    </Routes>
  );
}

export default App;
