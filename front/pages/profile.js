import React from 'react';
import Link from 'next/link';
import AppLayOut from '../component/AppLayout';
import Head from 'next/head';

const Profile = ({ children }) => {
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
				<div>프로필</div>
			</AppLayOut>
		</>
	);
};
export default Profile;
