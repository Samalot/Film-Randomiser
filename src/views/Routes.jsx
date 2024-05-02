import React from "react";
import { Route, Switch } from "react-router-dom";

import Main from "./Main/Main";
import Add from "./Add/Add";

const Routes = () => {
  return (
		<Switch>
			<Route path={`${process.env.PUBLIC_URL}/`} component={Main} exact />
			<Route path={`${process.env.PUBLIC_URL}/add`} component={Add} exact />
		</Switch>
	);
}

export default Routes;