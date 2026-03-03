import { Tabs } from "antd";
import GuessNumber from "./GuessNumber";
import StudyManager from "./StudyManager";

const { TabPane } = Tabs;

const TH01 = () => {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Game" key="1">
        <GuessNumber />
      </TabPane>
      <TabPane tab="Study" key="2">
        <StudyManager />
      </TabPane>
    </Tabs>
  );
};

export default TH01;