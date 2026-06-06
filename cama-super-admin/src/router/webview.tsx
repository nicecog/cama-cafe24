import Treatment from "@/app/webview/treatment/Page";

import CoachingLayout from "@/app/webview/coaching/Layout";
import HealthCoaching from "@/app/webview/coaching/Page";

import Sleep from "@/app/webview/coaching/sleep";
import Exercise from "@/app/webview/coaching/exercise";
import DietaryHabits from "@/app/webview/coaching/dietaryHabits";

import MentalPage from "@/app/webview/coaching/mental/Page";

import Activity from "@/app/webview/coaching/activity/Page";
import ActivityEval from "@/app/webview/coaching/activity/eval/Page";
import ActivityCancer from "@/app/webview/coaching/activity/eval/checkCancer/Page";
import ActivityQuestion from "@/app/webview/coaching/activity/eval/question/Page";
import ActivityResult from "@/app/webview/coaching/activity/eval/result/Page";
import ActivityContent from "@/app/webview/coaching/activity/content/Page";
import ActivityWorkoutContent from "@/app/webview/coaching/activity/content/workoutContent/Page";
import ActivityContentResult from "@/app/webview/coaching/activity/content/result/Page";
import WellBeingPage from "@/app/webview/coaching/wellbeing/Page";
import WellBeingDetailPage from "@/app/webview/coaching/wellbeing/detail/Page";
import HelpPage from "@/app/webview/help/Page";
import HelpDetail from "@/app/webview/help/HelpDetail";
import Laboratory from "@/app/webview/coaching/laboratory/Page";

// WebViews
export const webviewRouters = [
	{ path: "/webview/treatment/:seq", element: <Treatment /> },
	{ path: "/webview/help", element: <HelpPage /> },
	{ path: "/webview/coaching/laboratory/:loginId", element: <Laboratory /> },
	{ path: "/webview/help/:no", element: <HelpDetail /> },
	{
		path: "/webview/coaching",
		element: <CoachingLayout />,
		children: [
			{
				path: "/webview/coaching/wellbeing/:loginId",
				element: <WellBeingPage />,
			},
			{
				path: "/webview/coaching/wellbeing/:id/:loginId",
				element: <WellBeingDetailPage />,
			},
			{ path: "/webview/coaching/:loginId", element: <HealthCoaching /> },

			// 수면
			{ path: "/webview/coaching/A/:loginId", element: <Sleep /> },
			// 신체 활동
			{ path: "/webview/coaching/C/:loginId", element: <Exercise /> },

			{ path: "/webview/coaching/B/:loginId", element: <DietaryHabits /> },

			// 운동
			{
				path: "/webview/coaching/E/:loginId",
				element: <Activity />,
			},
			// 운동평가
			{
				path: "/webview/coaching/E/eval/:loginId",
				element: <ActivityEval />,
			},
			// 운동평가 -암종확인
			{
				path: "/webview/coaching/E/eval/checkCancer/:loginId",
				element: <ActivityCancer />,
			},
			// 운동평가 설문조사
			{
				path: "/webview/coaching/E/eval/question/:loginId",
				element: <ActivityQuestion />,
			},
			// 운동평가 결과
			{
				path: "/webview/coaching/E/eval/result/:loginId",
				element: <ActivityResult />,
			},
			{
				path: "/webview/coaching/E/content/:loginId",
				element: <ActivityContent />,
			},
			{
				path: "/webview/coaching/E/content/workoutContent/:loginId",
				element: <ActivityWorkoutContent />,
			},
			{
				path: "/webview/coaching/E/content/result/:loginId",
				element: <ActivityContentResult />,
			},
			{
				path: "/webview/coaching/D/:loginId",
				element: <MentalPage />,
			},
		],
	},
	//  수면
];
