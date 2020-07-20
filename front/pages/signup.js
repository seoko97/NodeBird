import React, { useState, useCallback } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import PropTypes from 'prop-types';

const TextInput = ({ value }) => {
	return <div>{value}</div>;
};

TextInput.PropTypes = {
	value: PropTypes.string,
};

export const useInput = (init = null) => {
	const [value, setter] = useState(init);
	const handler = useCallback((e) => {
		setter(e.target.value);
	}, []);
	return [value, handler];
};

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

	const onSubmit = useCallback(
		(e) => {
			e.preventDefault();

			if (password !== passwordcheck) {
				return setPasswordError(true);
			}
			if (!term) {
				return setTermError(true);
			}
		},
		//함수 내부에서 state를 사용하기 때문에 해당 배열에 입력
		[password, passwordcheck, term],
	);

	const onChangePasswordChk = useCallback(
		(e) => {
			setPasswordError(e.target.value !== password);
			setPasswordcheck(e.target.value);
		},
		[password],
	);

	const onChangeTerm = useCallback((e) => {
		setTerm(e.target.checked);
	}, []);

	return (
		<>
			<Form onSubmit={onSubmit} style={{ padding: 10 }}>
				<TextInput value="135" />
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
					<Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
						약관동의
					</Checkbox>

					{!term && <div style={{ color: 'red' }}>약관에 동의하세요.</div>}
				</div>
				<div style={{ marginTop: 10 }}>
					<Button type="primary" htmlType="submit">
						가입하기
					</Button>
				</div>
			</Form>
		</>
	);
};

export default Signup;
