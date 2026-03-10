import { Tabs } from "antd";
import OanTuTi from "./OanTuTi";
import QuestionBank from "./QuestionBank";

const { TabPane } = Tabs;

const TH02 = () => {
    return(
        <Tabs defaultActiveKey="1">
            <TabPane tab="Game" key="1">
                <OanTuTi />
            </TabPane>
            <TabPane tab="Study" key="2">
                <QuestionBank />
            </TabPane>
        </Tabs>
    )
}

export default TH02