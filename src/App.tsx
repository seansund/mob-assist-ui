import React from 'react';
import {Route, Routes} from "react-router-dom";

import './App.css';
import {UIShell, ViewShell} from "./components";
import {
    HomeView,
    MemberAddEditView,
    MemberDeleteView, MemberDetailView,
    MemberListView,
    SignupAddEditView, SignupDeleteView, SignupDetailView,
    SignupListView
} from "./views";
import {AssignmentDiagramView} from "./views/AssignmentDiagramView";

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<UIShell />}>
              <Route index element={<HomeView />} />
              <Route path="members" element={<ViewShell />}>
                  <Route index element={<MemberListView navAddEdit="/members/addEdit" navDelete="/members/delete" navDetail="/members/detail" />}></Route>
                  <Route path="detail" element={<MemberDetailView nav="/members" />}></Route>
                  <Route path="addEdit" element={<MemberAddEditView nav="/members" />}></Route>
                  <Route path="delete" element={<MemberDeleteView nav="/members" />}></Route>
              </Route>
              <Route path="signups" element={<ViewShell />}>
                  <Route index element={<SignupListView navAddEdit="/signups/addEdit" navDelete="/signups/delete" navDetail="/signups/detail" />}></Route>
                  <Route path="detail" element={<SignupDetailView nav="/signups" />}></Route>
                  <Route path="addEdit" element={<SignupAddEditView nav="/signups" />}></Route>
                  <Route path="delete" element={<SignupDeleteView nav="/signups" />}></Route>
              </Route>
          </Route>
          <Route path="/assignment" element={<AssignmentDiagramView />}>
              <Route path=":assignment" element={<AssignmentDiagramView />} />
          </Route>
      </Routes>
    </div>
  );
}

export default App;
