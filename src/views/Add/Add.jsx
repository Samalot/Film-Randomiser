import React, { Fragment, useEffect, useRef, useState, useId } from "react";
import { createStructuredSelector } from 'reselect';
import { compose } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Collapse, Button, Form, Input, Select, Spin, Alert  } from 'antd';
import axios from 'axios';

import styles from './Add.module.scss';

const Add = () => {
	const formRef = useRef(null);
	const [film, setFilm] = useState();
	const [lists, setLists] = useState();
	const [selectedList, setSelectedList] = useState(1);
	const [editList, setEditList] = useState(1);
	const [searchedEditList, setSearchedEditList] = useState();
	const [loading, setLoading] = useState(false);
	const [duplicateFilm, setDuplicateFilm] = useState(false);

	useEffect(() => {
		getAllLists();
	}, []);

	const getAllLists = () => {
		axios.post('https://samalot.dev/api/film/list/get', {})
		.then(result => setLists(result.data.map(list => ({ label: list.name, value: list.id }))));
	};

	const onListSubmit = (values) => {
		axios.post('https://samalot.dev/api/film/list/add', values)
			.then(() => getAllLists());
  };

	const onSearchSubmit = (values) => {
		axios.post('https://samalot.dev/api/film/search', { search: values.search })
			.then(result => {
				setDuplicateFilm(false);
				setFilm(result.data);
			});
  };

	const onSearchIMDBSubmit = (values) => {
		axios.post('https://samalot.dev/api/film/search/imdb', { search: values.searchIMDB })
			.then(result => {
				setDuplicateFilm(false);
				setFilm(result.data);
			});
  };

	const onEditSearchSubmit = () => {
		axios.post('https://samalot.dev/api/film/list/search', { search: editList })
			.then(result => setSearchedEditList(result.data[0].films));
  };

	const onFilmSubmit = () => {
		axios.post('https://samalot.dev/api/film/film/add', {
			name: film.Title,
			poster: film.Poster,
			rating: film.imdbRating,
			plot: film.Plot,
			list_id: selectedList,
			imdb: film.imdbID,
		})
			.then(() => {
				setFilm(undefined);
				setSearchedEditList(undefined);
			})
			.catch(() => setDuplicateFilm(true));
	}

	const removeFilm = (filmId) => {
		axios.post('https://samalot.dev/api/film/film/delete', { id: filmId })
			.then(() => {
				onEditSearchSubmit();
			});
	}

	const Film = () => film ? (
		<div className={styles.filmContainer}>
			<div className={styles.filmImgContainer}>
				<img src={film.Poster} className={styles.filmImg} />
			</div>
			<div  className={styles.filmInfoContianer}>
				<h1 className={styles.filmTitle}>{`${film.Title} (${film.Year})`}</h1>
				<p className={styles.filmPlot}>{film.Plot}</p>
				<Select
					defaultValue={selectedList}
					style={{ width: 200, marginBottom: 10 }}
					options={lists}
					onChange={(value) => setSelectedList(value)}
				/>
				{ loading ? <Spin /> : (
					<div>
						<Button type="primary" style={{marginRight: 10}} onClick={() => onFilmSubmit()}>Add</Button>
						<Button type="primary" danger onClick={() => setFilm(undefined)}>Cancel</Button>
					</div>
				)}
				{ duplicateFilm && <Alert message="Error - Film already exists in list" type="error" style={{marginTop: 10}} /> }		
			</div>	
		</div>
	) : (
		<Fragment>
			<Form
				ref={formRef}
				name="control-ref"
				onFinish={onSearchSubmit}
			>
				<Form.Item name="search">
					<div style={{display: "flex"}}>
						<Input
							placeholder="Film name"
						/>
						<Button type="primary" htmlType="submit" className={styles.button} style={{marginLeft: 10}}>
							Search
						</Button>
					</div>		
				</Form.Item>
			</Form>
			<Form
				ref={formRef}
				name="control-ref"
				onFinish={onSearchIMDBSubmit}
			>
				<Form.Item name="searchIMDB">
					<div style={{display: "flex"}}>
						<Input
							placeholder="Film IMDb Id"
						/>
						<Button type="primary" htmlType="submit" className={styles.button} style={{marginLeft: 10}}>
							Search
						</Button>
					</div>		
				</Form.Item>
			</Form>
		</Fragment>
	);

	const Edit = () => searchedEditList ? (
		<Fragment>
			{
				(searchedEditList.length > 0) ? searchedEditList.map((film) => (
					<div className={styles.editRow} key={film.id}>
						<a onClick={() => removeFilm(film.id)}>❌</a>
						<img src={film.poster} style={{width: 25, marginLeft: 10, marginRight: 10}} />
						<div> { film.name } </div>
					</div>
					)) : (<div>😔 Empty</div>)
			}
			<hr style={{marginTop: 20, marginBottom: 20}}/>
			<div style={{display: 'flex'}}>
				<Button type="primary" danger onClick={() => setSearchedEditList(undefined)} className={styles.button}>Cancel</Button>
				<div style={{flexGrow: 1}}/>
				<Button type="primary" danger onClick={() => {}} style={{marginLeft: 10}}>Delete List</Button>
			</div>
		</Fragment>
	) : (
		<Fragment>
			<Select
				defaultValue={editList}
				style={{ width: 200, marginBottom: 10 }}
				options={lists}
				onChange={(value) => setEditList(value)}
			/>
			<Button
				type="primary"
				htmlType="submit"
				className={styles.button}
				style={{marginLeft: 10}}
				onClick={() => onEditSearchSubmit()}
			>
				Search
			</Button>
		</Fragment>
	);

	const items = [
		{
			key: '1',
			label: '📝 Add List',
			children: (
				<Form
					ref={formRef}
					name="control-ref"
					onFinish={onListSubmit}
				>				
					<Form.Item name="name">
						<div style={{display: "flex"}}>
							<Input
								placeholder="Name"
							/>
							<Button type="primary" htmlType="submit" className={styles.button} style={{marginLeft: 10}}>
								Submit
							</Button>
						</div>		
					</Form.Item>
				</Form>
			),
		},
		{
			key: '2',
			label: '📽️ Add Film',
			children: <Film />,
		},
		{
			key: '3',
			label: '✏️ Edit List',
			children: <Edit />,
		}
	];

  return (
		<div className={styles.container}>

			<Collapse 
				accordion
				items={items}
      	defaultActiveKey={['2']}
				className={styles.accordian}
			/>
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

export default hocChain(Add);