import React from "react";
import {Container} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";


const Roles = () => {
    document.title = "Dashboard | Velzon - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="Dashboard" pageTitle="Dashboards"/>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Roles;
