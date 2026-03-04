import React, { useState, useEffect } from 'react';
import { Card, Input, Button, notification } from 'antd';

export default function GuessingGame() {
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(10);
  const [history, setHistory] = useState<number[]>([]);
  const [status, setStatus] = useState<'playing'| 'won'| 'lost'>('playing');

  const newNumber = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(randomNumber);
    setGuess('');
    setAttempts(10);
    setHistory([]);
    setStatus('playing');
    notification.info({ message: 'Hãy đoán một số từ 1 đến 100!' });
  };

  useEffect(() => {
    newNumber();
  }, []);

  const handleGuess = () => {
    const guessNumber = parseInt(guess);
    
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 100) {
      notification.warning({ message: 'Vui lòng nhập số từ 1 đến 100!' });
      return;
    }

    const newAttempts = attempts - 1;
    setAttempts(newAttempts);
    setHistory([...history, guessNumber]);

    if (guessNumber === targetNumber) {
      notification.success({ message: `Chúc mừng! Bạn đã đoán đúng số ${targetNumber}!` });
      setStatus('won');
    } else if (newAttempts === 0) {
      notification.error({ message: `Bạn đã hết lượt! Số đúng là ${targetNumber}.` });
      setStatus('lost');
    } else if (guessNumber < targetNumber) {
      notification.info({ message: `Bạn đoán quá thấp! Còn ${newAttempts} lượt.` });
    } else {
      notification.warning({ message: `Bạn đoán quá cao! Còn ${newAttempts} lượt.` });
    }

    setGuess('');
  };

  return (
    <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
      <Card title="Trò Chơi Đoán Số">
        <p style={{ textAlign: 'center', fontSize: '18px' }}>
          Đoán số từ 1 đến 100
        </p>

        <div style={{ textAlign: 'center', fontSize: '32px', margin: '20px 0' }}>
          Lượt còn lại: {attempts}
        </div>

        {status === 'playing' && (
          <div>
            <Input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onPressEnter={handleGuess}
              placeholder="Nhập số của bạn"
              style={{ marginBottom: '10px' }}
            />
            <Button type="primary" block onClick={handleGuess}>
              Đoán
            </Button>
          </div>
        )}

        {status !== 'playing' && (
          <Button type="primary" block onClick={newNumber}>
            Chơi lại
          </Button>
        )}

        {history.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <p>Số đã đoán:</p>
            <div>
              {history.map((num, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    margin: '5px',
                    background: num === targetNumber ? 'green' : num < targetNumber ? 'blue' : 'red',
                    color: 'white',
                    borderRadius: '5px'
                  }}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
