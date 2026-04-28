export interface GoalType {
    id: number;
    title: string;
    type: 'Giảm cân' | 'Tăng cơ' | 'Sức bền' | 'Khác';
    target: number;
    current: number;
    deadline: string;
    status: string;
}

export const initialGoals: GoalType[] = [
    { id: 1, title: 'Giảm cân đón Tết', type: 'Giảm cân', target: 65, current: 70, deadline: '2026-01-20', status: 'Đang thực hiện' },
    { id: 2, title: 'Hít đất mỗi ngày', type: 'Sức bền', target: 50, current: 20, deadline: '2026-02-15', status: 'Đang thực hiện' },
];

export const initialExercises = [
    { id: 1, name: 'Plank', muscle: 'Core', level: 'Dễ', desc: 'Giữ thân người thẳng, chống bằng khuỷu tay.', calo: 150, color: 'green' },
    { id: 2, name: 'Squat', muscle: 'Legs', level: 'Trung bình', desc: 'Hạ hông xuống thấp như đang ngồi ghế.', calo: 250, color: 'orange' },
    { id: 3, name: 'Push Up', muscle: 'Chest', level: 'Khó', desc: 'Nâng hạ thân người bằng đôi tay.', calo: 300, color: 'red' },
];