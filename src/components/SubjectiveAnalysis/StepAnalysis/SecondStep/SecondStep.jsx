import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from '../FirstStep/FirstStep.module.css'
import CognitiveWorkloadChart from '../../../ScoreCard/ScoreCard'

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


const SecondStepAnalysis = (props) => {
  const{data} = props;


  const newData =data?.data?.cognitiveWorkload


  // Data for the bar chart
  const barChartData = {
    labels: [
      "Effort",
      "Frustration",
      "Mental Demand",
      "Performance",
      "Physical Demand",
      "Temporal Demand"
    ],
    datasets: [
      {
        label: "Ratings",
        data: [
          newData?.average_effort,
          newData?.average_frustration,
          newData?.average_mental_demand,
          newData?.average_performance,
          newData?.average_physical_demand,
          newData?.average_temporal_demand,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

   const barChartOptions = {
    maintainAspectRatio: false,  // This allows control over height
  };

  return (
    <>
    <div className={styles.main}>
        <h6>Perceived Cognitive Workload Analysis</h6>
      <div className={styles.container}>
        {/* Column 1 - Bar Chart */}
        {/* <div className={styles.colmd}>
          <h3>Cognitive Workload Representation</h3>
          <Bar data={barChartData} options={barChartOptions} height={500} />
        </div> */}

        {/* Column 3 - Summary */}
        <div className={styles.colmd}>
             <h3>Cognitive Workload Overview</h3>
          <CognitiveWorkloadChart data={newData}/>
        </div>
      </div>
        {/* <div>
          <h3>Summary</h3>
          <p>Total Average: {newData?.totalAverage.toFixed(2)}</p>
        </div> */}
    </div>
    </>
  );
};

export default SecondStepAnalysis;
