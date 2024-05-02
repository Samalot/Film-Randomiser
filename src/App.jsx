import React, { useEffect } from "react";
import { createStructuredSelector } from 'reselect';
import { compose } from "redux";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { IntlProvider } from 'react-intl';
import { parse as UrlParse } from 'query-string';
import { getLocale, setLocale } from './utils/duck';
import { getLabels, validLocale } from './utils/labels';
import Snowfall from 'react-snowfall'

import Routes from './views/Routes';
import Header from './components/Header/Header';

import "./style/stylesheet.scss";

const App = ({
	locale,
	setLocale
}) => {
	let location = useLocation();

	useEffect(() => {
		const params = UrlParse(location.search);
		validLocale(params.locale) && setLocale(params.locale);
	}, []);

  return (
    <IntlProvider messages={getLabels(locale)} locale={locale} defaultLocale="en-GB">
			<div className="pageWrapper">
			<Snowfall />
				<Header />

				<div className="mainContent">
					<Routes />
				</div>
			</div>
    </IntlProvider>
  );
}

const mapDispatchToProps = {
	setLocale,
};

const mapStateToProps = createStructuredSelector({
	locale: getLocale,
});

const hocChain = compose(
	connect(mapStateToProps, mapDispatchToProps),
);

export default hocChain(App);
