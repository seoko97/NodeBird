import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';
import { SIGN_UP_REQUEST } from '../reducers/user';

export const useInput = (init = null) => {
	const [value, setter] = useState(init);
	const handler = useCallback((e) => {
		setter(e.target.value);
	}, []);
	return [value, handler];
};

const Error = styled.div`
	color: red;
`;

const Signup = () => {
	// 커스텀 훅
	// 중복되는 부분을 줄이기위함
	// const [id, onChangeId] = useState('');
	// const onChangePasswordChk = (e) => {
	// 	onChangeId(e.target.value);
	// }
	const [id, onChangeId] = useInput('');
	const [nick, onChangeNick] = useInput('');
	const [password, onChangePassword] = useInput('');

	const [passwordcheck, setPasswordcheck] = useState('');
	const [term, setTerm] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [termError, setTermError] = useState(false);
	const { isSigningUp, me } = useSelector((state) => state.user);

	useEffect(() => {
		if (me) {
			alert('로그인했으니 메인페이지로 이동합니다.');
			Router.push('/');
		}
	}, [me && me.id]);

	const dispatch = useDispatch();

	const onSubmit = useCallback(
		(e) => {
			e.preventDefault();

			if (password !== passwordcheck) {
				return setPasswordError(true);
			}
			if (!term) {
				return setTermError(true);
			}
			dispatch({
				type: SIGN_UP_REQUEST,
				data: {
					userId: id,
					password,
					nickname: nick,
				},
			});
		},
		// 함수 내부에서 state를 사용하기 때문에 해당 배열에 입력
		[id, nick, password, passwordcheck, term],
	);

	const onChangePasswordChk = useCallback(
		(e) => {
			setPasswordError(e.target.value !== password);
			setPasswordcheck(e.target.value);
		},
		[password],
	);

	const onChangeTerm = useCallback((e) => {
		setTermError(false);
		setTerm(e.target.checked);
	}, []);

	if (me) {
		return null;
	}

	return (
		<>
			<Form onSubmit={onSubmit} style={{ padding: 10 }}>
				회원가입
				<div>
					<label htmlFor="user-id">아이디</label>
					<br />
					<Input name="user-id" value={id} required onChange={onChangeId} />
				</div>
				<div>
					<label htmlFor="user-nick">닉네임</label>
					<br />
					<Input name="user-nick" value={nick} required onChange={onChangeNick} />
				</div>
				<div>
					<label htmlFor="user-password">비밀번호</label>
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
					<label htmlFor="user-password-check">비밀번호 체크</label>
					<br />
					<Input
						name="user-password-check"
						value={passwordcheck}
						type="password"
						required
						onChange={onChangePasswordChk}
					/>
					{passwordError && <Error>일치하지 않습니다.</Error>}
				</div>
				<div>
					<Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
						약관동의
					</Checkbox>

					{termError && <Error>약관에 동의하세요.</Error>}
				</div>
				<div style={{ marginTop: 10 }}>
					<Button type="primary" htmlType="submit" loading={isSigningUp}>
						가입하기
					</Button>
				</div>
			</Form>
		</>
	);
};

export default Signup;
