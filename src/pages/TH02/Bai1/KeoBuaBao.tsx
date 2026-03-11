import { useState } from 'react';
import { Button, Card, List, Tag } from 'antd';

type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Thắng' | 'Thua' | 'Hòa';
interface Round {
	player: Choice;
	computer: Choice;
	result: Result;
}

const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

export default function Game() {
	const [history, setHistory] = useState<Round[]>([]);

	const getResult = (player: Choice, computer: Choice): Result => {
		if (player === computer) return 'Hòa';
		if (
			(player === 'Kéo' && computer === 'Bao') ||
			(player === 'Búa' && computer === 'Kéo') ||
			(player === 'Bao' && computer === 'Búa')
		) {
			return 'Thắng';
		}
		return 'Thua';
	};

	const play = (playerChoice: Choice) => {
		const computerChoice = choices[Math.floor(Math.random() * choices.length)];

		const result = getResult(playerChoice, computerChoice);

		setHistory([{ player: playerChoice, computer: computerChoice, result }, ...history]);
	};

	return (
		<Card title='Game Kéo Búa Bao' style={{ maxWidth: 400, margin: 'auto' }}>
			<div style={{ marginBottom: 20 }}>
				{choices.map((c) => (
					<Button key={c} onClick={() => play(c)} style={{ marginRight: 10 }}>
						{c}
					</Button>
				))}
			</div>
			<List
				header='Lịch sử ván đấu'
				bordered
				dataSource={history}
				renderItem={(item, index) => (
					<List.Item>
						{index + 1} | Bạn: <b>{item.player}</b> vs Máy: <b>{item.computer}</b> →{' '}
						<Tag color={item.result === 'Thắng' ? 'green' : item.result === 'Thua' ? 'red' : 'gold'}>{item.result}</Tag>
					</List.Item>
				)}
			/>
		</Card>
	);
}
