import React from "react";
import { createStructuredSelector } from 'reselect';
import { compose } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Link } from "react-router-dom";

import styles from './Header.module.scss';


const Header = () => {
  return (
		<div className={styles.headerContainer}>
			<Link to={`${process.env.PUBLIC_URL}/`} className={styles.link}> 🎥 Film </Link> 
			<Link to={`${process.env.PUBLIC_URL}/add`} className={styles.link}> ➕ Add </Link>
		</div>
	);
}

const mapStateToProps = createStructuredSelector({});

const hocChain = compose(
	injectIntl,
	connect(mapStateToProps),
);

export default hocChain(Header);
