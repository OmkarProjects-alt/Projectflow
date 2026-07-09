import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Auth from '../pages/Auth/Auth';
import Dashboard from '../pages/user/Dashboard';
import AppLayout from '../Layout/AppLayout';
import UserContext from '../context/UserContext';
import ErrorContextProvider from '../context/ErrorAndSuccessMsgContext';
import MessageAlert from '../components/common/MessageAlert';
import Projects from '../pages/user/Projects';
import ProjectDetails from '../components/Project/ProjectDetail/ProjectDetails';
import TaskDetail from '../components/Project/ProjectDetail/ProjectTasksDetails/TaskDetail/TaskDetail';
import Tasks from '../pages/user/Tasks';
import KanbanBoard from '../pages/user/KanbanBoard';
import Team from '../pages/user/Team';
import UserProfile from '../pages/user/UserProfile';
import ThemeProvider from '../context/ThemeProvider';
import { SocketProvider } from '../context/SocketContext';
import SocketListener from '../socket/SocketListener';
import Activities from '../pages/user/Activities';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <ErrorContextProvider>
          <ThemeProvider>
            <UserContext>
              <SocketProvider>
                <MessageAlert />
                <Routes>
                    <Route
                      path='/'
                      element={ <Auth />}
                    />

                    <Route
                      path='/projectflow'
                      element={
                        <AppLayout/>
                      }
                    >
                    <Route 
                      path='dashboard'
                      element = { 
                        <Dashboard /> 
                      }
                    />

                    <Route
                      path='projects'
                      element = {
                        <Projects />
                      }
                    />

                    <Route 
                      path='projects/:projectId'
                      element = {
                        <ProjectDetails />
                      }
                    />

                    <Route
                      path='task/:taskId'
                      element = {
                        <TaskDetail />
                      }
                    />

                    <Route 
                      path='tasks'
                      element = {
                        <Tasks />
                      }
                    />


                    <Route
                      path='kanban'
                      element = {
                        <KanbanBoard />
                      }
                    />

                    <Route 
                      path='team'
                      element = {
                        <Team />
                      }
                    />

                    <Route 
                      path='activity'
                      element = {
                        <Activities />
                      }
                    />

                    <Route 
                      path='user/:userId'
                      element = {
                        <UserProfile />
                      }
                    />

                </Route>

                </Routes>
                <SocketListener />
              </SocketProvider>
            </UserContext>
          </ThemeProvider>
        </ErrorContextProvider>
      </Router>
    </>
  )
}

export default App
