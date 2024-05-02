import React, { useEffect, useState } from "react";
import { createStructuredSelector } from 'reselect';
import { compose } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import axios from 'axios';
import { Button, Select } from 'antd';

import styles from './Main.module.scss';

const Main = ({
	intl
}) => {
	const [lists, setLists] = useState();
	const [selectedList, setSelectedList] = useState(1);
	const [film, setSelectedFilm] = useState();

	useEffect(() => {
		getAllLists();
	}, []);

	const getAllLists = () => {
		axios.post('https://samalot.dev/api/film/list/get', {})
		.then(result => setLists(result.data.map(list => ({ label: list.name, value: list.id }))));
	};

	const selectFilm = () => {
		const date = new Date();
		date.setHours(0,0,0,0);
		axios.post('https://samalot.dev/api/film/list/selectFilm', { list: selectedList, date })
		.then(result => {
			setSelectedFilm(result.data);
		});
	};

	const nth = (d) => {
		if (d > 3 && d < 21) return 'th';
		switch (d % 10) {
			case 1:  return "st";
			case 2:  return "nd";
			case 3:  return "rd";
			default: return "th";
		}
	};
	
	const getDate = () => {
		const date = new Date();
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'long' });

		return `${day}${nth(day)} ${month}`;
	}

	const seenFilm = () => {
		axios.post('https://samalot.dev/api/film/list/seen', { id: film.id })
		.then(result => {
			selectFilm();
		});
	};

  return (
		<div className={styles.container}>
			<h2>Select</h2>
			<div>
				<Select
					defaultValue={selectedList}
					style={{ width: 200, marginBottom: 10 }}
					options={lists}
					onChange={(value) => setSelectedList(value)}
				/>
				<Button type="primary" onClick={() => selectFilm()} className={styles.button} style={{marginLeft: 10}}>
					Search
				</Button>
			</div>
			{
				film && (
					<div>
						<div className={styles.filmContainer}>
							<div className={styles.filmImgContainer}>
								<img src={film.poster} className={styles.filmImg} />
								<img src="ribbon.png" className={styles.ribbon}/>
							</div>
							<div  className={styles.filmInfoContianer}>
								<h3 style={{textAlign: 'left', margin: 0}}>{getDate()}</h3>
								<h1 className={styles.filmTitle}>{film.name}</h1>
								<p className={styles.filmPlot}>{film.plot}</p>
								<h3>{`${film.rating}/10 ⭐`}</h3>
							</div>
							
						</div>
						<div style={{textAlign: 'right'}}>
							<Button type="primary" onClick={() => seenFilm()} className={styles.button} style={{marginLeft: 0, width: 140}}>
								👀 Mark as Seen
							</Button>
						</div>
					</div>
				)
			}
		</div>
	);
}

const mapDispatchToProps = {
};

const mapStateToProps = createStructuredSelector({
});

const hocChain = compose(
	injectIntl,
	connect(mapStateToProps, mapDispatchToProps),
);

export default hocChain(Main);