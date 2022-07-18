import React from "react";
import { createStructuredSelector } from 'reselect';
import { compose } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl'
import { } from '../../utils/duck'
import { types, defaultProps } from './MainTypes.js'

import styles from './Main.module.scss';

const Main = ({
	intl
}) => {
  return (
		<div>
			
			<div className={styles.container}>
				<div className={styles.item1}>Item</div>
				<div className={styles.item2}>Item</div>
				<div className={styles.break} />
				<div className={styles.item3}>Item</div>
				<div className={styles.item4}>Item</div>
			</div>

		</div>
	);
}

Main.propTypes = types;
Main.defaultProps = defaultProps;

const mapDispatchToProps = {
};

const mapStateToProps = createStructuredSelector({
});

const hocChain = compose(
	injectIntl,
	connect(mapStateToProps, mapDispatchToProps),
);

export default hocChain(Main);