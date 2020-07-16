import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

import AppLayOut from '../component/AppLayout';

const Home = ({ children }) => {
	return (
		<>
			<Head>
				<title>NodeBird</title>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
				/>
			</Head>
			<AppLayOut>
				<div>홈</div>
			</AppLayOut>
		</>
	);
};
export default Home;
