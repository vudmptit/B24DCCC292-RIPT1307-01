import { useState } from "react";
import { Card, InputNumber, Button, Typography } from "antd";

const { Title, Text } = Typography;

const GuessNumber = () => {
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * 100) + 1
  );

  const [guess, setGuess] = useState<number | null>(null);
  const [turns, setTurns] = useState(5);
  const [message, setMessage] = useState("");

  const handleGuess = () => {
    if (guess === null) {
      setMessage("Vui lòng nhập số!");
      return;
    }

    if (turns === 0) {
      setMessage("Hơi nonnnnnn!");
      return;
    }

    if (guess < randomNumber) {
      setMessage("Xuống tí nữa em êy");
    } else if (guess > randomNumber) {
      setMessage("Hơi cao rồi em êy!");
    } else {
      setMessage("Hehe đúng rồi");
      return;
    }

    setTurns(turns - 1);

    if (turns - 1 === 0) {
      setMessage("Bạn đã hết lượt! Số đúng là " + randomNumber);
    }
  };

  const resetGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setTurns(5);
    setGuess(null);
    setMessage("");
  };

  return (
    <Card
      style={{
        width: 400,
        margin: "50px auto",
        textAlign: "center",
      }}
    >
      <Title level={3}>Game Đoán Số</Title>

      <Text>Đoán số từ 1 đến 100</Text>

      <div style={{ margin: "20px 0" }}>
        <InputNumber
          min={1}
          max={100}
          value={guess ?? undefined}
          onChange={(value) => setGuess(value)}
        />
      </div>

      <Button type="primary" onClick={handleGuess}>
        Đoán
      </Button>

      <Button style={{ marginLeft: 10 }} onClick={resetGame}>
        Chơi lại
      </Button>

      <div style={{ marginTop: 20 }}>
        <Text strong>{message}</Text>
        <br />
        <Text>Lượt còn lại: {turns}</Text>
      </div>
    </Card>
  );
};

export default GuessNumber;