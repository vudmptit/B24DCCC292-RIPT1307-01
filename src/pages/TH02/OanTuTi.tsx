import { useState } from "react";
import { Button, Card, Table, Space, Tag } from "antd";

type Choice = "Kéo" | "Búa" | "Bao";
type Result = "Thắng" | "Thua" | "Hòa";

interface GameHistory {
  key: number;
  player: Choice;
  computer: Choice;
  result: Result;
}

const choices: Choice[] = ["Kéo", "Búa", "Bao"];

const OanTuTi = () => {
  const [history, setHistory] = useState<GameHistory[]>([]);

  const playGame = (playerChoice: Choice) => {
    const computerChoice = choices[Math.floor(Math.random() * 3)];

    let result: Result;

    if (playerChoice === computerChoice) {
      result = "Hòa";
    } else if (
      (playerChoice === "Kéo" && computerChoice === "Bao") ||
      (playerChoice === "Búa" && computerChoice === "Kéo") ||
      (playerChoice === "Bao" && computerChoice === "Búa")
    ) {
      result = "Thắng";
    } else {
      result = "Thua";
    }

    const newRound: GameHistory = {
      key: history.length + 1,
      player: playerChoice,
      computer: computerChoice,
      result: result,
    };

    setHistory([newRound, ...history]);
  };

  const columns = [
    {
      title: "Người chơi",
      dataIndex: "player",
      key: "player",
    },
    {
      title: "Máy",
      dataIndex: "computer",
      key: "computer",
    },
    {
      title: "Kết quả",
      dataIndex: "result",
      key: "result",
      render: (result: Result) => {
        let color = "blue";
        if (result === "Thắng") color = "green";
        if (result === "Thua") color = "red";

        return <Tag color={color}>{result}</Tag>;
      },
    },
  ];

  return (
    <Card title="Trò chơi Oẳn Tù Tì" style={{ width: 600, margin: "auto" }}>
      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => playGame("Kéo")}>
          Kéo
        </Button>

        <Button type="primary" onClick={() => playGame("Búa")}>
          Búa
        </Button>

        <Button type="primary" onClick={() => playGame("Bao")}>
          Bao
        </Button>
      </Space>

      <Table<GameHistory>
        columns={columns}
        dataSource={history}
        pagination={false}
      />
    </Card>
  );
};

export default OanTuTi;