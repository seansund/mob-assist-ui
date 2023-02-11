import React from 'react';
import {Route, Routes} from "react-router-dom";

import './App.css';
import {LoadingOverlay, UIShell, ViewShell} from "./components";
import {HomeView, MemberAddEditView, MemberDeleteView, MemberListView} from "./views";

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <LoadingOverlay />
          <Routes>
              <Route path="/" element={<UIShell />}>
                  <Route index element={<HomeView />} />
                  <Route path="members" element={<ViewShell />}>
                      <Route index element={<MemberListView />}></Route>
                      <Route path="addEdit" element={<MemberAddEditView />}></Route>
                      <Route path="delete" element={<MemberDeleteView />}></Route>
                  </Route>
              </Route>
          </Routes>
      </header>
    </div>
  );
}

export default App;
