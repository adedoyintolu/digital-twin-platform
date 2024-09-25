import * as React from 'react';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import {Button} from '@mui/material'
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState } from "react";
import { Data } from '../data'
import PieChart from "../components/piechart";
import {BarChart} from "../components/barchart";
import Image from 'next/image'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router'
import HumanBody from '../images/vecteezy_silhouette-of-a-human-body_-min-Photoroom.png'


export default function Home() {
  const pieChartRef = React.useRef(null);
  const barChart1Ref = React.useRef(null);
  const barChart2Ref = React.useRef(null);

  const router = useRouter()
  Chart.register(CategoryScale);
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.year), 
    datasets: [
      {
        minBarLength: 50,
        label: "Users Gained ",
        data: Data.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0"
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });

  const [open, setOpen] = React.useState(false);
    const [openAnalysis, setAnalysisOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleCloseDialog = () => {
    setAnalysisOpen(false);
  };

  const handleClickOpenDialog = () => {
    setAnalysisOpen(true);
  };

  const visitSubjectiveEvaluation = () => {
    router.push('/subjective-evaluation');
  }

    const visitSubjectiveAnalysis= () => {
    router.push('/subjective-analysis');
  }

    const visitOjectiveEvaluation = () => {
    router.push('/objective-evaluation');
  }

  React.useEffect(() => {
    // Destroy the previous chart instances if they exist
    if (pieChartRef.current) pieChartRef.current.destroy();
    if (barChart1Ref.current) barChart1Ref.current.destroy();
    if (barChart2Ref.current) barChart2Ref.current.destroy();

    // Pie Chart
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    pieChartRef.current = new Chart(ctxPie, {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
          data: [300, 50, 100],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
      }
    });

    // Bar Chart 1
    const barChart1Canvas = document.getElementById('barChart1');
    barChart1Canvas.height = 500; // Set bar chart height in pixels
    const ctxBar1 = barChart1Canvas.getContext('2d');
    barChart1Ref.current = new Chart(ctxBar1, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [{
          label: 'Sales',
          data: [12, 19, 3, 5],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Bar Chart 2
    const barChart2Canvas = document.getElementById('barChart2');
    barChart2Canvas.height = 500; // Set bar chart height in pixels
    const ctxBar2 = barChart2Canvas.getContext('2d');
    barChart2Ref.current = new Chart(ctxBar2, {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Revenue',
          data: [22, 29, 15, 10],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Cleanup on component unmount
    return () => {
      if (pieChartRef.current) pieChartRef.current.destroy();
      if (barChart1Ref.current) barChart1Ref.current.destroy();
      if (barChart2Ref.current) barChart2Ref.current.destroy();
    };
  }, []);

  return (
    <>
      <Dialog
        sx={{padding: '30px'}}
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Choose your preferred data input evaluation"}
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <Button autoFocus  onClick={visitSubjectiveEvaluation}>
            Subjective 
          </Button>
          <Button  onClick={visitOjectiveEvaluation} autoFocus>
            Objective 
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog
        sx={{padding: '30px'}}
        fullScreen={fullScreen}
        open={openAnalysis}
        onClose={handleCloseDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Choose your preferred data evaluation analysis"}
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <Button autoFocus  onClick={visitSubjectiveAnalysis}>
            Subjective 
          </Button>
          <Button  onClick={visitOjectiveEvaluation} autoFocus>
            Objective 
          </Button>
        </DialogContent>
      </Dialog>
    <div className={styles.container}>
      <Head>
        <title>Twin Digital Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="#">Twin Digital Platform!</a>
        </h1>
        <div className={styles.buttonSection}>
          <div>

          <Button  onClick={handleClickOpen}>
            Data Input
          </Button>
          </div>
          <div>
          <Button onClick={handleClickOpenDialog}>
            Analyse Risk
          </Button>
            </div>
        </div>
        <div className={styles.container}>
          <div className={styles.column}>
            <h2>Bar Chart 1</h2>
            <canvas id="barChart1"></canvas>
          </div>
           <div className={styles.column}>
            <h2>Pie Chart</h2>
            <canvas id="pieChart"></canvas>
          </div>
          <div className={styles.column}>
            <h2>Bar Chart 2</h2>
            <canvas id="barChart2"></canvas>
          </div>
        </div>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
    </>
  );
}
