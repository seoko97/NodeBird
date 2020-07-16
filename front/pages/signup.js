import React, { useState, useCallback } from 'react';
import Applayout from '../component/AppLayout';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';

const Signup = () => {
	// 커스텀 훅
	// 중복되는 부분을 줄이기위함
	const useInput = (init = null) => {
		const [value, setter] = useState(init);
		const handler = useCallback((e) => {
			setter(e.target.value);
		}, []);
		return [value, handler];
	};
	// const [id, onChangeId] = useState('');
	// const onChangePasswordChk = (e) => {
	// 	onChangeId(e.target.value);
	// };

	const [id, onChangeId] = useInput('');
	const [nick, onChangeNick] = useInput('');
	const [password, onChangePassword] = useInput('');
	const [passwordcheck, setPasswordcheck] = useState('');
	const [term, setTerm] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [termError, setTermError] = useState(false);

	const onSubmits = (e) => {
		e.preventDefault();

		if (password !== passwordcheck) {
			return setPasswordError(true);
		}
		if (!term) {
			return setTermError(true);
		}
	};

	const onChangePasswordChk = (e) => {
		setPasswordError(e.target.value !== password);
		setPasswordcheck(e.target.value);
	};

	const onChangeTerm = (e) => {
		setTermError(e.target.value);
		setTerm(e.target.checked);
	};

	return (
		<>
			<Head>
				<title>NodeBird</title>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
				/>
			</Head>
			<Applayout>
				<Form onSubmit={onSubmits} style={{ padding: 10 }}>
					회원가입
					<div>
						<label>아이디</label>
						<br />
						<Input name="user-id" value={id} required onChange={onChangeId} />
					</div>
					<div>
						<label>닉네임</label>
						<br />
						<Input name="user-nick" value={nick} required onChange={onChangeNick} />
					</div>
					<div>
						<label>비밀번호</label>
						<br />
						<Input
							name="user-password"
							value={password}
							type="password"
							required
							onChange={onChangePassword}
						/>
					</div>
					<div>
						<label>비밀번호 체크</label>
						<br />
						<Input
							name="user-password-check"
							value={passwordcheck}
							type="password"
							required
							onChange={onChangePasswordChk}
						/>
						{passwordError && <div style={{ color: 'red' }}>일치하지 않습니다.</div>}
					</div>
					<div>
						<Checkbox name="user-term" value={term} onChange={onChangeTerm}>
							약관동의
						</Checkbox>

						{termError && <div style={{ color: 'red' }}>약관에 동의하세요.</div>}
					</div>
					<div style={{ marginTop: 10 }}>
						<Button type="primary" htmlType="submit">
							가입하기
						</Button>
					</div>
				</Form>
			</Applayout>
		</>
	);
};

export default Signup;
