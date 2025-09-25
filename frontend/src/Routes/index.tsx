import React from 'react';
import {Routes, Route} from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import {authProtectedRoutes, publicRoutes} from "./allRoutes";
import AuthProtected from './AuthProtected';

const Index = () => {
    return (
        <React.Fragment>
            <Routes>
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={<NonAuthLayout>{route.element}</NonAuthLayout>}
                            key={idx}
                        />
                    ))}
                </Route>

                <Route>
                    {authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    <VerticalLayout>{route.element}</VerticalLayout>
                                </AuthProtected>
                            }
                            key={idx}
                        />
                    ))}
                </Route>
            </Routes>
        </React.Fragment>
    );
};

export default Index;